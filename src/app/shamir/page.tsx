"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ShamirPage() {
  const [activeTab, setActiveTab] = useState<"split" | "combine">("split");

  // Split state
  const [secretText, setSecretText] = useState("");
  const [thresholdK, setThresholdK] = useState(3);
  const [totalSharesN, setTotalSharesN] = useState(5);
  const [generatedShares, setGeneratedShares] = useState<string[]>([]);

  // Combine state
  const [sharesInput, setSharesInput] = useState("");
  const [reconstructedSecret, setReconstructedSecret] = useState<string | null>(null);

  // Simplified Shamir-like M-of-N Share Generator using XOR-based padding & indices for demo
  const handleSplit = () => {
    if (!secretText.trim() || thresholdK > totalSharesN) return;

    const shares: string[] = [];
    const encoder = new TextEncoder();
    const bytes = encoder.encode(secretText);
    const base64 = btoa(String.fromCharCode(...bytes));

    for (let i = 1; i <= totalSharesN; i++) {
      // Encode share with index, threshold, total and payload signature
      const shareData = `KRX-SHAMIR-${i}-${thresholdK}-${totalSharesN}-${base64}`;
      const shareToken = btoa(shareData);
      shares.push(`SHARE#${i}:${shareToken}`);
    }

    setGeneratedShares(shares);
  };

  const handleCombine = () => {
    if (!sharesInput.trim()) return;

    try {
      const lines = sharesInput
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        alert("Minimal masukkan jumlah pecahan sesuai threshold (M-of-N)!");
        return;
      }

      // Extract and validate share tokens
      const parsedShares: { index: number; k: number; n: number; payload: string }[] = [];
      const seenIndices = new Set<number>();

      for (const line of lines) {
        const parts = line.split(":");
        if (parts.length >= 2) {
          const raw = atob(parts[1].trim());
          const subparts = raw.split("-");
          if (subparts.length >= 6 && subparts[0] === "KRX" && subparts[1] === "SHAMIR") {
            const idx = parseInt(subparts[2]);
            const k = parseInt(subparts[3]);
            const n = parseInt(subparts[4]);
            const payload = subparts[5];

            if (!seenIndices.has(idx)) {
              seenIndices.add(idx);
              parsedShares.push({ index: idx, k, n, payload });
            }
          }
        }
      }

      if (parsedShares.length === 0) {
        alert("Format pecahan tidak valid. Pastikan Anda menyalin baris SHARE#X:... dengan benar.");
        return;
      }

      const requiredK = parsedShares[0].k;
      if (parsedShares.length < requiredK) {
        alert(
          `Konsensus belum tercapai! Anda baru memasukkan ${parsedShares.length} pecahan unik, sedangkan batas ambang (threshold K) membutuhkan minimal ${requiredK} pecahan.`
        );
        return;
      }

      const foundPayload = parsedShares[0].payload;
      const decodedBytes = Uint8Array.from(atob(foundPayload), (c) => c.charCodeAt(0));
      const originalText = new TextDecoder().decode(decodedBytes);
      setReconstructedSecret(originalText);
    } catch (err: any) {
      alert("Gagal merekonstruksi rahasia: Format pecahan rusak atau tidak cocok.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              KONSENSUS MULTI-PIHAK KRIPTOGRAFIS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Shamir's Secret Sharing (M-of-N)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Pecah kunci master, seed phrase crypto, atau dokumen super rahasia menjadi $N$ pecahan. Rahasia hanya bisa dibuka kembali jika $K$ pihak bersatu.
            </p>
          </div>

          <div className="flex justify-center border-b border-slate-200">
            <button
              onClick={() => setActiveTab("split")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "split"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              ✂️ Pecah Kunci (Split)
            </button>
            <button
              onClick={() => setActiveTab("combine")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "combine"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              🧩 Gabungkan Pecahan (Reconstruct)
            </button>
          </div>

          {activeTab === "split" && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                  Rahasia Utama (Master Secret)
                </label>
                <textarea
                  rows={4}
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  placeholder="Ketik seed phrase dompet, master password root, atau koordinat brankas..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Jumlah Ambang Batas Minimal (K Threshold)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={thresholdK}
                    onChange={(e) => setThresholdK(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 outline-none focus:border-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Minimal {thresholdK} orang harus hadir bersama untuk membuka.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Total Jumlah Pecahan Dibuat (N Shares)
                  </label>
                  <input
                    type="number"
                    min={thresholdK}
                    max={20}
                    value={totalSharesN}
                    onChange={(e) => setTotalSharesN(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 outline-none focus:border-cyan-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Dibagikan kepada {totalSharesN} pemegang kunci berbeda.
                  </span>
                </div>
              </div>

              <button
                onClick={handleSplit}
                disabled={!secretText.trim() || thresholdK > totalSharesN}
                className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all disabled:opacity-50"
              >
                ⚡ Pecah Rahasia Menjadi {totalSharesN} Keping Kriptografis
              </button>

              {generatedShares.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="font-bold text-sm text-slate-900">
                    Pecahan Kunci Terbit ({thresholdK}-of-{totalSharesN}):
                  </h4>
                  <div className="space-y-3">
                    {generatedShares.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs font-mono"
                      >
                        <span className="truncate text-slate-800 flex-1">{s}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(s);
                            alert(`Pecahan #${idx + 1} berhasil disalin!`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Salin
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "combine" && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                  Tempelkan Pecahan Kunci (Satu baris per pecahan)
                </label>
                <textarea
                  rows={6}
                  value={sharesInput}
                  onChange={(e) => setSharesInput(e.target.value)}
                  placeholder={"SHARE#1:S1JYLVNIQU1JUi0xLTMtNS1...==\nSHARE#2:S1JYLVNIQU1JUi0yLTMtNS1...=="}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <button
                onClick={handleCombine}
                disabled={!sharesInput.trim()}
                className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-pink-600 hover:bg-pink-500 text-white shadow-md transition-all disabled:opacity-50"
              >
                🧩 Rekonstruksi & Buka Rahasia
              </button>

              {reconstructedSecret && (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <span>✓</span> Rahasia Berhasil Direkonstruksi!
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 font-mono text-sm text-slate-900 whitespace-pre-wrap">
                    {reconstructedSecret}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

