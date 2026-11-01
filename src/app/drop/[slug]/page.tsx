"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DropSubmitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [box, setBox] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState("");
  const [receiptToken, setReceiptToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/drop/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kotak aduan tidak ditemukan");
        return res.json();
      })
      .then((data) => {
        setBox(data.box);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setIsLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/v1/drop/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedPayload: submissionText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirimkan laporan");

      setReceiptToken(data.receiptToken);
      setSubmissionText("");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan pengiriman");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PORTAL WHISTLEBLOWER 100% ANONIM
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {box?.title || "Kotak Aduan Anonim"}
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {box?.description || "Kirimkan bukti atau informasi sensitif Anda secara anonim."}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              Menghubungkan ke kotak drop box terenkripsi...
            </div>
          ) : errorMsg && !box ? (
            <div className="cyber-card rounded-2xl p-8 border border-red-200 bg-red-50 text-center text-red-800 text-xs">
              ⚠️ {errorMsg}
            </div>
          ) : receiptToken ? (
            <div className="cyber-card rounded-2xl p-8 border-2 border-emerald-400 bg-emerald-50/50 space-y-4 text-center animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Laporan Rahasia Anda Berhasil Dikirimkan!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Simpan Token Tanda Terima (Receipt Token) di bawah ini. Anda dapat menggunakannya nanti untuk memeriksa tanggapan dari pemilik kotak tanpa membuka identitas Anda.
              </p>
              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 font-mono text-xs font-bold text-slate-900 break-all select-all">
                {receiptToken}
              </div>
            </div>
          ) : (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Laporan / Bukti Dokumen Rahasia
                  </label>
                  <textarea
                    rows={8}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Tuliskan kronologi, nama pihak terkait, tautan berkas, atau bukti rahasia di sini..."
                    required
                    className="w-full p-4 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500 font-mono leading-relaxed"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono">
                  🔒 Identitas Anda terlindungi. Alamat IP dan metadata browser tidak diteruskan kepada pemilik kotak aduan.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !submissionText.trim()}
                  className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Mengenkripsi & Mengirim..." : "⚡ Kirim Laporan Rahasia Secara Anonim"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

