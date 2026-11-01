"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RecipientMessagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [hasInteracted, setHasInteracted] = useState(false);
  const [keyHex, setKeyHex] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [requiresPassphrase, setRequiresPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBurned, setIsBurned] = useState(false);
  const [certCode, setCertCode] = useState<string | null>(null);
  const [screenShield, setScreenShield] = useState(false);
  const [isHoldingShield, setIsHoldingShield] = useState(false);
  const [clientIp, setClientIp] = useState("127.0.0.1");

  useEffect(() => {
    // Extract key from hash fragment on client
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setKeyHex(hash);
      }
    }
  }, []);

  const handleOpenSecret = async () => {
    setHasInteracted(true);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!keyHex) {
        throw new Error(
          "Kunci dekripsi tidak ditemukan pada tautan (fragmen hash URL hilang). Pesan tidak dapat didekripsi."
        );
      }

      const headers: Record<string, string> = {};
      if (passphrase) {
        headers["x-gate-passphrase"] = passphrase;
      }

      const res = await fetch(`/api/v1/messages/${slug}`, { headers });
      const data = await res.json();

      if (res.status === 410) {
        setIsBurned(true);
        setCertCode(data.certificateCode);
        throw new Error(data.message || "Pesan telah dihancurkan dari server.");
      }

      if (!res.ok) {
        if (data.requiresPassphrase) {
          setRequiresPassphrase(true);
          setScreenShield(data.screenShield);
          setIsLoading(false);
          return;
        }
        throw new Error(data.message || "Gagal mengambil pesan");
      }

      if (data.requiresPassphrase) {
        setRequiresPassphrase(true);
        setScreenShield(data.screenShield);
        setIsLoading(false);
        return;
      }

      // Decrypt using Web Crypto API
      setScreenShield(Boolean(data.screenShield));
      if (data.certificateCode) {
        setCertCode(data.certificateCode);
      }

      const rawKeyBytes = new Uint8Array(
        keyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );

      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        rawKeyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const ivBytes = Uint8Array.from(atob(data.ivBase64), (c) => c.charCodeAt(0));
      const ciphertextBytes = Uint8Array.from(atob(data.ciphertextBase64), (c) =>
        c.charCodeAt(0)
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes },
        cryptoKey,
        ciphertextBytes
      );

      const plaintext = new TextDecoder().decode(decryptedBuffer);
      setDecryptedText(plaintext);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat membuka pesan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              ZERO-KNOWLEDGE DECRYPTION GATE
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pesan Rahasia Terenkripsi
            </h1>
          </div>

          {/* Step 1: Anti-Bot Interstitial Screen */}
          {!hasInteracted && !isBurned && (
            <div className="cyber-card rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
                🔒
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Pesan Ini Dilindungi Fitur Hancur Mandiri
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Untuk melindungi pesan dari bot pratinjau tautan (WhatsApp, Telegram, Slack), klik tombol di bawah untuk mendekripsi pesan di peramban Anda.
                </p>
              </div>

              <button
                onClick={handleOpenSecret}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>⚡</span> Buka & Dekripsi Pesan Sekarang
              </button>
            </div>
          )}

          {/* Passphrase Gate Form */}
          {requiresPassphrase && !decryptedText && !isBurned && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span>🔑</span> Masukkan Kata Sandi Pembuka
              </div>
              <p className="text-xs text-slate-500">
                Pengirim mengunci pesan ini dengan kata sandi tambahan.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 outline-none focus:border-cyan-500"
              />

              <button
                onClick={handleOpenSecret}
                disabled={isLoading || !passphrase}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? "Mendekripsi..." : "Buka Pesan"}
              </button>
            </div>
          )}

          {/* Error / Burned State */}
          {isBurned && (
            <div className="cyber-card rounded-2xl p-8 border-2 border-red-300 bg-red-50/50 shadow-xl text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
                🔥
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pesan Telah Hancur Lebur Tanpa Jejak
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Pesan ini telah dibaca atau batas waktunya telah habis. Ciphertext telah dimusnahkan secara permanen menggunakan protokol DoD 5220.22-M Zeroization.
              </p>
              {certCode && (
                <div className="pt-2">
                  <Link
                    href={`/verify-shred`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-red-200 text-xs font-mono text-pink-700 font-bold hover:bg-red-50"
                  >
                    <span>📜</span> Verifikasi Sertifikat: {certCode}
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Decrypted Plaintext Reveal */}
          {decryptedText && (
            <div className="space-y-4 animate-fadeIn">
              <div className="cyber-card rounded-2xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                      PESAN BERHASIL DIDEKRIPSI
                    </span>
                  </div>
                  {certCode && (
                    <span className="text-[10px] font-mono text-pink-600 font-bold bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full">
                      🔥 MEMORI SERVER TELAH DI-SHRED
                    </span>
                  )}
                </div>

                {/* Screen Shield Interactivity */}
                {screenShield ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <span>🛡️</span> Screen Shield Aktif: Tahan tombol di bawah untuk melihat pesan. Watermark identitas akan ditempelkan pada layar.
                    </div>

                    <div
                      className={`relative p-6 rounded-xl border border-slate-300 min-h-[160px] flex items-center justify-center transition-all ${
                        isHoldingShield ? "bg-white" : "bg-slate-100 select-none"
                      }`}
                    >
                      {/* Diagonal Dynamic Watermark */}
                      {isHoldingShield && (
                        <div className="absolute inset-0 screen-shield-watermark flex items-center justify-center pointer-events-none overflow-hidden">
                          <span className="text-[14px] font-mono font-bold text-slate-300/60 rotate-[-25deg] uppercase tracking-widest whitespace-nowrap">
                            KRYPHIX CONFIDENTIAL • {new Date().toISOString()}
                          </span>
                        </div>
                      )}

                      {isHoldingShield ? (
                        <div className="relative z-10 font-mono text-sm text-slate-900 whitespace-pre-wrap leading-relaxed select-none">
                          {decryptedText}
                        </div>
                      ) : (
                        <div className="text-center text-xs text-slate-400 font-mono">
                          [ Konten Tersembunyi • Tahan Layar untuk Membaca ]
                        </div>
                      )}
                    </div>

                    <button
                      onMouseDown={() => setIsHoldingShield(true)}
                      onMouseUp={() => setIsHoldingShield(false)}
                      onTouchStart={() => setIsHoldingShield(true)}
                      onTouchEnd={() => setIsHoldingShield(false)}
                      className="w-full py-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg active:bg-cyan-500 active:text-slate-950 transition-all select-none"
                    >
                      👆 TAHAN DI SINI UNTUK MEMBACA RAHASIA
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                    {decryptedText}
                  </div>
                )}

                {/* Audit Certificate Link */}
                {certCode && (
                  <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-slate-500">
                      Sertifikat Penghancuran Terbit: <strong className="font-mono text-slate-800">{certCode}</strong>
                    </span>
                    <Link
                      href={`/verify-shred`}
                      className="text-pink-600 font-bold hover:underline"
                    >
                      Cek Bukti Kriptografis →
                    </Link>
                  </div>
                )}
              </div>

              <div className="text-center pt-4">
                <Link
                  href="/#instant-creator"
                  className="text-xs font-bold text-cyan-600 hover:underline"
                >
                  ⚡ Buat & kirim pesan rahasia Anda sendiri
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

