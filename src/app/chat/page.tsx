"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ChatCreatorPage() {
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [hostAlias, setHostAlias] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdRoomUrl, setCreatedRoomUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes,
          maxParticipants,
          hostAlias: hostAlias || "Host",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat bilik obrolan");
      }

      const fullUrl = `${window.location.origin}/chat/${data.roomId}#${data.secretRoomKey}`;
      setCreatedRoomUrl(fullUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PROTOKOL OBROLAN RAM-ONLY
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ghost Chat Nir-Jejak
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Bilik obrolan rahasia kilat berdurasi waktu. Semua riwayat teks dan media tersimpan murni di RAM Redis dan terhapus permanen saat bilik ditutup.
            </p>
          </div>

          <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                ⚠️ {errorMsg}
              </div>
            )}

            {createdRoomUrl ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-5 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                    <span>✓</span> Bilik Ghost Chat Berhasil Dibuat!
                  </div>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    Bagikan tautan rahasia ini ke lawan bicara Anda. Kunci bilik terpasang pada fragmen hash URL sehingga server tidak memiliki kunci dekripsi.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdRoomUrl}
                      className="w-full font-mono text-xs p-3 rounded-lg bg-white border border-purple-300 text-slate-800"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdRoomUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }}
                      className="shrink-0 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      {copied ? "Tersalin!" : "Salin Tautan"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCreatedRoomUrl(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-purple-600"
                  >
                    ← Buat bilik lain
                  </button>
                  <a
                    href={createdRoomUrl}
                    className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                  >
                    Masuk ke Bilik Sekarang →
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Nama Samaran Anda (Alias)
                  </label>
                  <input
                    type="text"
                    value={hostAlias}
                    onChange={(e) => setHostAlias(e.target.value)}
                    placeholder="Contoh: Agen-X"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                      Durasi Waktu Aktif Bilik
                    </label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 outline-none focus:border-purple-500"
                    >
                      <option value={15}>15 Menit</option>
                      <option value={30}>30 Menit (Standar)</option>
                      <option value={60}>60 Menit</option>
                      <option value={120}>2 Jam (Maksimal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                      Batas Partisipan
                    </label>
                    <select
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 outline-none focus:border-purple-500"
                    >
                      <option value={2}>2 Orang (1-on-1)</option>
                      <option value={3}>3 Orang</option>
                      <option value={5}>5 Orang (Grup Kecil)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(121,40,202,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? "Menginisialisasi RAM Redis..." : "⚡ Buat Bilik Ghost Chat"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

