"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function DecoyMasqueradePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [showSecretModal, setShowSecretModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [decryptedSecret, setDecryptedSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBurned, setIsBurned] = useState(false);
  const [certCode, setCertCode] = useState<string | null>(null);
  const [hashKey, setHashKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) setHashKey(hash);
    }
  }, []);

  const handleReveal = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const effectiveKey = keyInput.trim() || hashKey;

      const headers: Record<string, string> = {};
      if (keyInput.trim()) {
        headers["x-gate-passphrase"] = keyInput.trim();
      }

      const res = await fetch(`/api/v1/messages/${slug}`, { headers });
      const data = await res.json();

      if (res.status === 410) {
        setIsBurned(true);
        setCertCode(data.certificateCode);
        throw new Error(data.message || "Pesan telah dihancurkan dari server (DoD 5220.22-M).");
      }

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil pesan tersembunyi.");
      }

      if (!effectiveKey) {
        throw new Error("Kunci dekripsi diperlukan untuk membuka konten terenkripsi.");
      }

      // Check if effectiveKey is 64 hex characters (32 bytes AES-256)
      let cryptoKey: CryptoKey;
      if (/^[0-9a-fA-F]{64}$/.test(effectiveKey)) {
        const rawKeyBytes = new Uint8Array(
          effectiveKey.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
        );
        cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          rawKeyBytes,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
      } else {
        // Derive key from text password using SHA-256
        const passBytes = new TextEncoder().encode(effectiveKey);
        const digest = await window.crypto.subtle.digest("SHA-256", passBytes);
        cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          digest,
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
      }

      const ivBytes = Uint8Array.from(atob(data.ivBase64), (c) => c.charCodeAt(0));
      const ciphertextBytes = Uint8Array.from(atob(data.ciphertextBase64), (c) => c.charCodeAt(0));

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes },
        cryptoKey,
        ciphertextBytes
      );

      const plaintext = new TextDecoder().decode(decryptedBuffer);
      setDecryptedSecret(plaintext);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mendekripsi pesan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2A26] font-serif leading-relaxed antialiased">
      {/* Blog Header */}
      <header className="border-b border-amber-200/60 bg-amber-50/50 py-8 px-4 text-center">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-sans font-bold">
          Dapur Nusantara & Kuliner Tradisional
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-950 mt-2">
          Resep Rendang Daging Sapi Spesial Asli Minang
        </h1>
        <p className="text-xs text-amber-700/80 font-sans mt-2">
          Diposting oleh Chef Rahma • 15 Menit Persiapan • 4 Jam Memasak • 6 Porsi
        </p>
      </header>

      {/* Main Recipe Content */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8 font-sans">
        <div className="bg-amber-100/60 p-6 rounded-2xl border border-amber-200/80 space-y-3">
          <h2 className="text-lg font-serif font-bold text-amber-950">Bahan-Bahan Utama:</h2>
          <ul className="text-sm text-amber-900 space-y-1.5 list-disc pl-5">
            <li>1 kg daging sapi segar (bagian paha atas), potong sesuai selera</li>
            <li>1.000 ml santan kental dari 3 butir kelapa tua</li>
            <li>1.000 ml santan encer</li>
            <li>4 batang serai, memarkan</li>
            <li>6 lembar daun jeruk purut, buang tulang daunnya</li>
            <li>2 lembar daun kunyit, simpulkan</li>
            <li>2 buah asam kandis</li>
          </ul>
        </div>

        <div className="space-y-4 text-slate-800 text-sm leading-relaxed">
          <h2 className="text-lg font-serif font-bold text-amber-950">Langkah-Langkah Memasak:</h2>
          <p>
            1. Haluskan bumbu rempah: bawang merah, bawang putih, cabai merah keriting, jahe, lengkuas, ketumbar, dan pala.
          </p>
          <p>
            2. Rebus santan encer bersama bumbu halus, serai, daun jeruk, dan daun kunyit dengan api sedang sambil diaduk perlahan agar santan tidak pecah.
          </p>
          <p>
            3. Masukkan potongan daging sapi setelah santan mulai mengeluarkan minyak. Masak terus dengan api kecil hingga santan menyusut dan daging empuk.
          </p>
          <p>
            4. Tuangkan santan kental, aduk terus secara berkala selama 3 hingga 4 jam hingga warna kuah berubah menjadi cokelat gelap kehitaman yang harum dan berminyak.
          </p>
        </div>

        {/* Hidden stealth trigger disguised as copyright footnote */}
        <div className="pt-12 border-t border-amber-200/60 text-center">
          <button
            onClick={() => setShowSecretModal(true)}
            className="text-[11px] text-amber-800/40 hover:text-amber-800 transition-colors font-mono"
          >
            [ Versi Arsip Resmi Dokumen No. {slug.slice(0, 8)} ]
          </button>
        </div>
      </main>

      {/* Secret Prompt Modal (Masquerade Reveal) */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-400 rounded-2xl p-6 text-white font-mono space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                ⚡ KRYPHIX STEALTH GATEWAY
              </span>
              <button
                onClick={() => setShowSecretModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {isBurned ? (
              <div className="space-y-3">
                <span className="text-xs text-red-400 font-bold block">
                  🔥 PESAN TELAH DIHANCURKAN (ZERO-BYTE RETENTION)
                </span>
                <p className="text-xs text-slate-400">
                  Data telah dimusnahkan secara permanen mengikuti standar DoD 5220.22-M.
                </p>
                {certCode && (
                  <div className="p-3 bg-slate-950 border border-red-500/40 rounded-lg text-[11px] text-pink-400">
                    Sertifikat Audit: {certCode}
                  </div>
                )}
              </div>
            ) : decryptedSecret ? (
              <div className="space-y-3">
                <span className="text-xs text-emerald-400 font-bold block">
                  ✓ RAHASIA TERBUKA DARI SAMARAN BLOG
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs text-slate-200 whitespace-pre-wrap break-all">
                  {decryptedSecret}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Halaman ini adalah samaran (Masquerade Decoy). Masukkan sandi dekripsi Anda untuk membuka muatan sesungguhnya:
                </p>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={hashKey ? "Kunci hash terdeteksi dari URL" : "Masukkan kata sandi / kunci..."}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                />

                {errorMsg && (
                  <div className="text-[11px] text-red-400 bg-red-950/40 p-2 rounded border border-red-800">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleReveal}
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase disabled:opacity-50"
                >
                  {isLoading ? "Mendekripsi Klien..." : "🔓 Dekripsi Pesan Rahasia"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
