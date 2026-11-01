"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function VerifyShredPage() {
  const [certCode, setCertCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/v1/shred/verify?code=${encodeURIComponent(certCode.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sertifikat tidak ditemukan atau tidak valid");
      }

      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memverifikasi sertifikat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full uppercase tracking-wider">
              AUDIT FORENSIK DIGITAL
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Verifikasi Bukti Penghancuran (Proof of Shredding)
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Periksa integritas dan validitas sertifikat penghancuran data memori digital standar DoD 5220.22-M yang ditandatangani secara kriptografis menggunakan Ed25519 CA.
            </p>
          </div>

          {/* Search Box Card */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg">
            <form onSubmit={handleVerify} className="space-y-4">
              <label className="block text-xs font-mono font-bold uppercase text-slate-700">
                Masukkan Kode Sertifikat Shredding
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={certCode}
                  onChange={(e) => setCertCode(e.target.value)}
                  placeholder="Contoh: SHRED-2026-X8F9A1B2..."
                  required
                  className="flex-1 p-3.5 rounded-xl border border-slate-300 bg-white font-mono text-sm text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-pink-600 hover:bg-pink-500 text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <span>🔍</span> Verifikasi Kriptografi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
              <span>⚠️</span> {errorMsg}
            </div>
          )}

          {/* Verification Result Display */}
          {result && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border-2 border-emerald-400 shadow-xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Sertifikat Penghancuran Terverifikasi Sah
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Status: DATA PERMANENTLY DESTROYED • 0 BYTE RETAINED
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    ED25519 VALID SIGNATURE
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block mb-1">KODE SERTIFIKAT</span>
                  <span className="font-bold text-slate-900 text-sm break-all">{result.certificateCode}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block mb-1">TIPE SUMBER DAYA</span>
                  <span className="font-bold text-cyan-700 text-sm">{result.resourceType}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block mb-1">METODE SHREDDING</span>
                  <span className="font-bold text-pink-700 text-sm">{result.shredMethod}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block mb-1">WAKTU EKSEKUSI PENGHANCURAN</span>
                  <span className="font-bold text-slate-900 text-sm">{new Date(result.shreddedAt).toLocaleString("id-ID")}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-400 block mb-1">HASH SIDIK JARI MEMORI (SHA-256) SEBELUM DIHANCURKAN</span>
                  <span className="font-bold text-slate-800 text-xs break-all">{result.fingerprintSha256}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-400 block mb-1">TANDA TANGAN OTORITAS ED25519</span>
                  <span className="font-bold text-slate-600 text-[11px] break-all">{result.caSignatureEd25519}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Diverifikasi sebanyak: {result.verificationCount} kali</span>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 font-sans font-bold text-slate-800"
                >
                  Cetak Bukti PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

