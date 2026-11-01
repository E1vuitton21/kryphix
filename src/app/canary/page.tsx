"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CanaryPage() {
  const [activeTab, setActiveTab] = useState<"create" | "detect">("create");

  // Create state
  const [baseDoc, setBaseDoc] = useState("");
  const [recipientsInput, setRecipientsInput] = useState("");
  const [generatedCopies, setGeneratedCopies] = useState<
    Array<{ label: string; text: string; signature: string }>
  >([]);

  // Detect state
  const [leakedText, setLeakedText] = useState("");
  const [detectionResult, setDetectionResult] = useState<any>(null);

  const ZW_ZERO = "\u200B";
  const ZW_ONE = "\u200C";
  const ZW_DELIM = "\uFEFF";

  const handleGenerateCanaries = () => {
    if (!baseDoc.trim() || !recipientsInput.trim()) return;

    const labels = recipientsInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const copies: Array<{ label: string; text: string; signature: string }> = [];

    labels.forEach((label, idx) => {
      // 8-bit binary signature
      const signatureBinary = (idx + 1).toString(2).padStart(8, "0");

      let zeroWidthStr = ZW_DELIM;
      for (let i = 0; i < signatureBinary.length; i++) {
        zeroWidthStr += signatureBinary[i] === "1" ? ZW_ONE : ZW_ZERO;
      }
      zeroWidthStr += ZW_DELIM;

      // Inject after first space or word
      const spaceIdx = baseDoc.indexOf(" ");
      const injectedText =
        spaceIdx !== -1
          ? baseDoc.slice(0, spaceIdx) + zeroWidthStr + baseDoc.slice(spaceIdx)
          : baseDoc + zeroWidthStr;

      copies.push({
        label,
        text: injectedText,
        signature: signatureBinary,
      });
    });

    setGeneratedCopies(copies);
  };

  const handleDetectLeak = () => {
    if (!leakedText.trim()) return;

    const regex = new RegExp(`${ZW_DELIM}([${ZW_ZERO}${ZW_ONE}]+)${ZW_DELIM}`, "g");
    const match = regex.exec(leakedText);

    if (!match) {
      setDetectionResult({
        detected: false,
        message: "Tidak ditemukan tanda air tak kasat mata (Canary Trap) pada teks ini.",
      });
      return;
    }

    const binary = match[1]
      .split("")
      .map((ch) => (ch === ZW_ONE ? "1" : "0"))
      .join("");

    const recipientIndex = parseInt(binary, 2);

    setDetectionResult({
      detected: true,
      binary,
      recipientIndex,
      message: `Tanda air berhasil dideteksi! Teks ini berasal dari salinan penerima indeks #${recipientIndex} (Binary: ${binary}).`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full uppercase tracking-wider">
              FORENSIK TEKS ZERO-WIDTH
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Canary Trap & Watermark Forensik
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Sisipkan tanda unik tak kasat mata untuk setiap penerima berkas. Lacak siapa yang membocorkan dokumen secara matematis.
            </p>
          </div>

          <div className="flex justify-center border-b border-slate-200">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "create"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              🐥 Buat Salinan Canary Trap
            </button>
            <button
              onClick={() => setActiveTab("detect")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "detect"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              🔎 Deteksi Asal Kebocoran
            </button>
          </div>

          {activeTab === "create" && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                  1. Teks Dokumen Asli
                </label>
                <textarea
                  rows={4}
                  value={baseDoc}
                  onChange={(e) => setBaseDoc(e.target.value)}
                  placeholder="Ketik atau tempel draf naskah perjanjian, laporan keuangan, atau instruksi rahasia..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                  2. Daftar Nama Penerima (Satu baris per penerima)
                </label>
                <textarea
                  rows={3}
                  value={recipientsInput}
                  onChange={(e) => setRecipientsInput(e.target.value)}
                  placeholder={"Budi Santoso (Direksi)\nDewi Sartika (Legal)\nAgus Wijaya (Vendor IT)"}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 font-mono text-xs"
                />
              </div>

              <button
                onClick={handleGenerateCanaries}
                disabled={!baseDoc.trim() || !recipientsInput.trim()}
                className="w-full py-4 rounded-xl font-bold text-sm bg-pink-600 hover:bg-pink-500 text-white shadow-md transition-all disabled:opacity-50"
              >
                ⚡ Buat Salinan Watermark Tak Kasat Mata
              </button>

              {generatedCopies.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">
                    Salinan Dokumen Ter-Watermark ({generatedCopies.length} Penerima):
                  </h4>
                  {generatedCopies.map((copy, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{copy.label}</span>
                        <span className="text-[10px] font-mono text-pink-600">
                          Signature: {copy.signature} (Indeks #{idx + 1})
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(copy.text);
                          alert(`Salinan teks untuk '${copy.label}' berhasil disalin ke clipboard!`);
                        }}
                        className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 shadow-sm"
                      >
                        Salin Teks Khusus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "detect" && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                  Tempelkan Teks yang Bocor ke Sini
                </label>
                <textarea
                  rows={5}
                  value={leakedText}
                  onChange={(e) => setLeakedText(e.target.value)}
                  placeholder="Tempelkan potongan teks dari postingan media sosial, artikel, atau tangkapan layar..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              <button
                onClick={handleDetectLeak}
                disabled={!leakedText.trim()}
                className="w-full py-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md transition-all disabled:opacity-50"
              >
                🔍 Lacak & Identifikasi Sumber Kebocoran
              </button>

              {detectionResult && (
                <div
                  className={`p-6 rounded-xl border space-y-2 ${
                    detectionResult.detected
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="font-bold text-sm">
                    {detectionResult.detected ? "🎯 BUKTI FORENSIK DITEMUKAN!" : "⚠️ TIDAK DITEMUKAN"}
                  </div>
                  <p className="text-xs leading-relaxed">{detectionResult.message}</p>
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

