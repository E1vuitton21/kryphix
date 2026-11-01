"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotaryPage() {
  const [activeTab, setActiveTab] = useState<"certify" | "verify">("certify");

  // Certify states
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Verify states
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setIsHashing(true);
    setCertificate(null);
    setErrorMsg(null);

    try {
      const buffer = await selected.arrayBuffer();
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setHash(hashHex);
    } catch (err: any) {
      setErrorMsg("Gagal menghitung hash dokumen");
    } finally {
      setIsHashing(false);
    }
  };

  const handleCertify = async () => {
    if (!hash) return;
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/notary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentHashSha256: hash }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menerbitkan sertifikat");

      setCertificate(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan sertifikasi");
    }
  };

  const handleVerifyQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const isHex = /^[0-9a-fA-F]{64}$/.test(searchQuery.trim());
      const param = isHex
        ? `hash=${encodeURIComponent(searchQuery.trim())}`
        : `code=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(`/api/v1/notary?${param}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sertifikat tidak ditemukan.");
      }

      setVerifyResult(data);
    } catch (err: any) {
      setVerifyError(err.message || "Gagal memverifikasi sertifikat");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PEMBUKTIAN KEBERADAAN RFC 3161
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Blind Notary & Digital Timestamping
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Buktikan bahwa dokumen rahasia Anda sudah ada pada waktu tertentu tanpa pernah mengunggah isi dokumen ke internet. Komputasi hash murni di peramban Anda.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center border-b border-slate-200">
            <button
              onClick={() => setActiveTab("certify")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "certify"
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              📜 Terbitkan Sertifikat
            </button>
            <button
              onClick={() => setActiveTab("verify")}
              className={`px-8 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "verify"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              🔍 Verifikasi Keabsahan
            </button>
          </div>

          {activeTab === "certify" ? (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                  Pilih Berkas yang Hendak Disertifikasi (PDF, Docx, Kode, dll)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>

              {isHashing && (
                <div className="text-xs font-mono text-cyan-600 animate-pulse">
                  ⏳ Menghitung sidik jari SHA-256 lokal di browser...
                </div>
              )}

              {hash && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                  <span className="text-slate-400 block text-[11px] uppercase">
                    Sidik Jari Kriptografis SHA-256 (Dihitung di Klien):
                  </span>
                  <span className="font-bold text-slate-900 break-all">{hash}</span>
                  <p className="text-[11px] text-slate-500 font-sans">
                    🔒 Dokumen fisik Anda tidak pernah dikirim ke server. Hanya string 64-karakter hash ini yang akan disertifikasi.
                  </p>
                  <button
                    onClick={handleCertify}
                    className="mt-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
                  >
                    ⚡ Terbitkan Sertifikat Stempel Waktu RFC 3161
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  ⚠️ {errorMsg}
                </div>
              )}

              {certificate && (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <span>✓</span> Sertifikat Blind Notary Resmi Diterbitkan!
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                      <span className="text-slate-400 block text-[10px]">KODE VERIFIKASI</span>
                      <span className="font-bold text-slate-900">{certificate.verificationCode}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                      <span className="text-slate-400 block text-[10px]">WAKTU STEMPEL RESMI</span>
                      <span className="font-bold text-slate-900">
                        {new Date(certificate.certifiedAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">HASH DOKUMEN</span>
                      <span className="font-bold text-slate-900 break-all">
                        {certificate.documentHashSha256}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Cetak Sertifikat Bukti Keberadaan
                    </button>
                    <span className="text-emerald-700 font-mono text-[11px]">
                      Standar Integritas RFC 3161
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <form onSubmit={handleVerifyQuery} className="space-y-4">
                <label className="block text-xs font-mono font-bold uppercase text-slate-700">
                  Masukkan Kode Sertifikat (NOTARY-...) atau SHA-256 Hash Dokumen
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: NOTARY-2026-X8A9... atau 64 hex SHA-256"
                    required
                    className="flex-1 p-3.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md disabled:opacity-50"
                  >
                    {isVerifying ? "Memverifikasi..." : "Verifikasi Stempel"}
                  </button>
                </div>
              </form>

              {verifyError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                  ⚠️ {verifyError}
                </div>
              )}

              {verifyResult && (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <span>✓</span> Stempel Waktu Kriptografis Sah & Terdaftar!
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                      <span className="text-slate-400 block text-[10px]">KODE VERIFIKASI</span>
                      <span className="font-bold text-slate-900">{verifyResult.verificationCode}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                      <span className="text-slate-400 block text-[10px]">TERDAFTAR SEJAK</span>
                      <span className="font-bold text-slate-900">
                        {new Date(verifyResult.certifiedAt).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">HASH SHA-256 RESMI</span>
                      <span className="font-bold text-slate-900 break-all">{verifyResult.documentHashSha256}</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-emerald-200 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">STATUS INTEGRITAS</span>
                      <span className="font-bold text-emerald-700">{verifyResult.rfc3161Status}</span>
                    </div>
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
