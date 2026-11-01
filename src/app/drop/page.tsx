"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DropPage() {
  const [boxes, setBoxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [expandedBoxId, setExpandedBoxId] = useState<string | null>(null);

  const fetchBoxes = () => {
    fetch("/api/v1/drop")
      .then((res) => {
        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error("Unauthorized");
        }
        setIsAuthenticated(true);
        return res.json();
      })
      .then((data) => {
        setBoxes(data.boxes || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  const handleCreateBox = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch("/api/v1/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat kotak aduan");

      setMsg("Kotak aduan anonim berhasil dibuat!");
      setTitle("");
      setDescription("");
      fetchBoxes();
    } catch (err: any) {
      setMsg(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              KOTAK ADUAN DUA ARAH (WHISTLEBLOWER DROP)
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Secret Drop Box
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Sediakan kotak aduan aman bagi whistleblower atau klien Anda untuk mengirimkan berkas dan bukti rahasia secara anonim tanpa meninggalkan jejak.
            </p>
          </div>

          {isAuthenticated === false && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono font-bold text-amber-700 uppercase">
                  🔒 Sesi Akun Diperlukan
                </span>
                <p className="text-xs text-slate-600">
                  Untuk mengelola kotak aduan dan melihat kiriman bukti rahasia yang masuk, silakan masuk ke akun Anda terlebih dahulu.
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
              >
                Masuk ke Akun →
              </Link>
            </div>
          )}

          {msg && (
            <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono">
              ℹ️ {msg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                ⚡ Buat Kotak Aduan Baru
              </h3>
              <form onSubmit={handleCreateBox} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Judul Kotak Aduan
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kotak Bukti Fraud Internal PT XYZ"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Instruksi untuk Whistleblower (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan jenis bukti yang dicari atau instruksi keselamatan..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
                >
                  ⚡ Terbitkan Kotak Drop Box
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Kotak Drop Box Milik Anda</h3>
                <span className="text-xs font-mono text-slate-400">Total: {boxes.length} Kotak</span>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Memuat data kotak drop...
                </div>
              ) : boxes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Belum ada kotak aduan yang dibuat.
                </div>
              ) : (
                <div className="space-y-4">
                  {boxes.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{b.title}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {b.isActive ? "AKTIF" : "NONAKTIF"}
                        </span>
                      </div>

                      <p className="text-slate-500 text-xs">{b.description || "Tanpa deskripsi"}</p>

                      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200 text-[11px] font-mono">
                        <button
                          onClick={() => setExpandedBoxId(expandedBoxId === b.id ? null : b.id)}
                          className="text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1"
                        >
                          <span>📂</span> Laporan Masuk:{" "}
                          <strong className="text-cyan-600">{b.messages?.length || 0} Bukti</strong>
                          <span>{expandedBoxId === b.id ? "▲ Tutup" : "▼ Lihat"}</span>
                        </button>
                        <Link
                          href={`/drop/${b.boxSlug}`}
                          target="_blank"
                          className="text-cyan-600 hover:underline font-bold"
                        >
                          Tautan Whistleblower Publik →
                        </Link>
                      </div>

                      {expandedBoxId === b.id && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 font-mono text-[11px]">
                          {b.messages?.length === 0 ? (
                            <div className="text-slate-400 py-2">Belum ada laporan masuk pada kotak ini.</div>
                          ) : (
                            b.messages.map((m: any, mIdx: number) => (
                              <div
                                key={m.id || mIdx}
                                className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2"
                              >
                                <div>
                                  <span className="text-slate-700 font-bold block">
                                    Laporan #{mIdx + 1}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    Diterima: {new Date(m.createdAt).toLocaleString("id-ID")}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold">
                                  {m.ciphertextBlob || "TERENKRIPSI"}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
