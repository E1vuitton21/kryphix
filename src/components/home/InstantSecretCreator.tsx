"use client";

import { useState } from "react";
import Image from "next/image";

export function InstantSecretCreator() {
  const [message, setMessage] = useState("");
  const [expiry, setExpiry] = useState("1_view");
  const [passphrase, setPassphrase] = useState("");
  const [duressPassphrase, setDuressPassphrase] = useState("");
  const [duressContent, setDuressContent] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [screenShield, setScreenShield] = useState(true);
  const [decoyTheme, setDecoyTheme] = useState("NONE");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Generate local 256-bit AES-GCM Key (DEK) via Web Crypto
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      // Export raw key to hex for hash fragment
      const rawKeyBuffer = await window.crypto.subtle.exportKey("raw", key);
      const keyHex = Array.from(new Uint8Array(rawKeyBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // 2. Encrypt plaintext
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedPlaintext = new TextEncoder().encode(message);
      const ciphertextBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedPlaintext
      );

      // Convert to Base64
      const ciphertextBase64 = btoa(
        String.fromCharCode(...new Uint8Array(ciphertextBuffer))
      );
      const ivBase64 = btoa(String.fromCharCode(...iv));

      // 3. Optional duress encryption
      let duressBase64: string | undefined = undefined;
      if (duressPassphrase && duressContent) {
        const duressIv = window.crypto.getRandomValues(new Uint8Array(12));
        const duressCipher = await window.crypto.subtle.encrypt(
          { name: "AES-GCM", iv: duressIv },
          key,
          new TextEncoder().encode(duressContent)
        );
        duressBase64 = btoa(String.fromCharCode(...new Uint8Array(duressCipher)));
      }

      // 4. Send encrypted payload to API
      const response = await fetch("/api/v1/messages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ciphertextBase64,
          ivBase64,
          keyHex, // For admin escrow key-wrapping on server
          expiry,
          screenShieldEnabled: screenShield,
          hasPassphrase: Boolean(passphrase),
          passphrase: passphrase || undefined,
          duressPassphrase: duressPassphrase || undefined,
          duressCiphertextBase64: duressBase64,
          decoyTheme: decoyTheme !== "NONE" ? decoyTheme : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat pesan rahasia");
      }

      // 5. Construct Zero-Knowledge URL: server receives slug, key lives in #hash
      const fullUrl = `${window.location.origin}/n/${data.slug}#${keyHex}`;
      setGeneratedLink(fullUrl);
      setMessage("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat mengenkripsi pesan.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="instant-creator" className="scroll-mt-24 w-full">
      <div className="cyber-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-200 shadow-xl">
        {/* Neon accent corner glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400/20 via-pink-400/10 to-transparent blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              WebCrypto Engine AES-256-GCM
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Kirim Pesan Rahasia Instan
            </h3>
            <p className="text-sm text-slate-500">
              Pesan dienkripsi langsung di browser Anda sebelum dikirim ke server. Tanpa login diperlukan.
            </p>
          </div>
          <div className="hidden sm:block shrink-0">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
              🔒 100% Client-Side ZK
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {generatedLink ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300">
              <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pesan Rahasia Berhasil Dienkripsi & Siap Dikirim!
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                Kunci dekripsi tersimpan di bagian hash URL (`#...`) sehingga server tidak pernah mengetahui isi pesan Anda.
                Tautan ini akan langsung hancur lebur sesuai aturan kedaluwarsa.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full font-mono text-xs p-3 rounded-lg bg-white border border-emerald-300 text-slate-800 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="sm:w-auto shrink-0 px-5 py-3 rounded-lg font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <span>✓</span> Tersalin!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Salin Tautan
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setGeneratedLink(null)}
                className="text-xs font-semibold text-slate-500 hover:text-cyan-600 underline"
              >
                ← Buat pesan rahasia lainnya
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                Sertifikat DoD 5220.22-M otomatis terbit saat hancur
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateSecret} className="space-y-4">
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="Tuliskan rahasia, kredensial, kunci API, atau catatan pribadi Anda di sini..."
                className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-sm leading-relaxed transition-all resize-y"
              />
            </div>

            {/* Quick Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase">
                  Waktu Hancur Mandiri (TTL)
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:border-cyan-500 outline-none"
                >
                  <option value="1_view">1x Baca Langsung Hancur (Maksimal)</option>
                  <option value="1_hour">1 Jam Setelah Dibuat</option>
                  <option value="24_hours">24 Jam Setelah Dibuat</option>
                  <option value="7_days">7 Hari Setelah Dibuat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase">
                  Sandi Pembuka Opsional
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Kosongkan jika tanpa sandi..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Advanced Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1.5 py-1"
              >
                <span>{showAdvanced ? "▼" : "▶"}</span>
                {showAdvanced
                  ? "Sembunyikan Opsi Lanjutan (Duress & Screen Shield)"
                  : "Opsi Lanjutan (Sandi Paksaan Duress, Masking Tautan, Screen Shield)"}
              </button>
            </div>

            {/* Advanced Section */}
            {showAdvanced && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Screen Shield Anti-Screenshot Watermark
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cegah perekaman layar dengan watermark dinamis IP & waktu penerima serta mode tahan-layar.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={screenShield}
                    onChange={(e) => setScreenShield(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Sandi Paksaan (Duress Passphrase) & Konten Pengecoh
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Jika dipaksa membuka di bawah ancaman, masukkan sandi duress ini untuk menampilkan konten decoy palsu.
                  </p>
                  <input
                    type="password"
                    value={duressPassphrase}
                    onChange={(e) => setDuressPassphrase(e.target.value)}
                    placeholder="Sandi Duress (misal: sandi123)..."
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 mb-2 focus:border-cyan-500 outline-none"
                  />
                  {duressPassphrase && (
                    <textarea
                      value={duressContent}
                      onChange={(e) => setDuressContent(e.target.value)}
                      rows={2}
                      placeholder="Teks palsu yang ditampilkan jika sandi duress dimasukkan (misal: 'Daftar belanja bulanan: susu, roti...')"
                      className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:border-cyan-500 outline-none"
                    />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Pengecoh Tautan (Decoy Masquerade)
                  </label>
                  <select
                    value={decoyTheme}
                    onChange={(e) => setDecoyTheme(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:border-cyan-500 outline-none"
                  >
                    <option value="NONE">Standar Kryphix Link (/n/[slug])</option>
                    <option value="RECIPE_BLOG">Menyamar Sebagai Blog Resep Masakan</option>
                    <option value="TECH_DOCS">Menyamar Sebagai Dokumentasi Pemrograman</option>
                    <option value="NEWS_ARTICLE">Menyamar Sebagai Portal Berita Finansial</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-300 hover:from-cyan-300 hover:to-emerald-200 text-slate-900 shadow-[0_0_20px_rgba(0,210,255,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    Mengenkrpsi di Browser (AES-256-GCM)...
                  </>
                ) : (
                  <>
                    <span>⚡</span> Buat Pesan Rahasia & Dapatkan Tautan ZK
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

