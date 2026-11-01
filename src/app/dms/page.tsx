"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DmsPage() {
  const [switches, setSwitches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [payloadText, setPayloadText] = useState("");
  const [frequencyDays, setFrequencyDays] = useState(30);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const fetchSwitches = () => {
    fetch("/api/v1/dms")
      .then((res) => {
        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error("Unauthorized");
        }
        setIsAuthenticated(true);
        return res.json();
      })
      .then((data) => {
        setSwitches(data.switches || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSwitches();
  }, []);

  const handleCreateDms = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    try {
      const res = await fetch("/api/v1/dms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          payloadText,
          checkInFrequencyDays: frequencyDays,
          recipientEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat wasiat darurat");

      setMsg("Wasiat darurat berhasil diaktifkan!");
      setTitle("");
      setPayloadText("");
      setRecipientEmail("");
      fetchSwitches();
    } catch (err: any) {
      setMsg(err.message || "Terjadi kesalahan");
    }
  };

  const handleCheckIn = async (switchId: string) => {
    try {
      const res = await fetch("/api/v1/dms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ switchId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Check-in berhasil! Batas waktu telah diperpanjang.");
        fetchSwitches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PROTOKOL WASIAT DARURAT OTOMATIS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dead Man's Switch (DMS)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Kirimkan data rahasia otomatis ke penerima darurat jika Anda tidak melakukan konfirmasi check-in berkala.
            </p>
          </div>

          {isAuthenticated === false && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono font-bold text-amber-700 uppercase">
                  🔒 Sesi Akun Diperlukan
                </span>
                <p className="text-xs text-slate-600">
                  Dead Man's Switch memerlukan sesi akun terautentikasi untuk melacak jadwal check-in dan mengamankan kunci wasiat darurat.
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
            {/* Form Create */}
            <div className="lg:col-span-5 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                ⚡ Buat Wasiat Darurat Baru
              </h3>
              <form onSubmit={handleCreateDms} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Judul Wasiat
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kredensial Brankas / Wasiat Waris"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Email Penerima Darurat
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="nama@keluarga.com"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Frekuensi Wajib Check-In
                  </label>
                  <select
                    value={frequencyDays}
                    onChange={(e) => setFrequencyDays(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 outline-none"
                  >
                    <option value={7}>Setiap 7 Hari (1 Minggu)</option>
                    <option value={14}>Setiap 14 Hari (2 Minggu)</option>
                    <option value={30}>Setiap 30 Hari (1 Bulan)</option>
                    <option value={90}>Setiap 90 Hari (3 Bulan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Pesan / Dokumen Rahasia
                  </label>
                  <textarea
                    rows={4}
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    placeholder="Ketik instruksi, sandi brankas, atau pesan terakhir..."
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
                >
                  ⚡ Aktifkan Sakelar Darurat
                </button>
              </form>
            </div>

            {/* List Switches */}
            <div className="lg:col-span-7 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Sakelar Darurat Anda</h3>
                <span className="text-xs font-mono text-slate-400">Total: {switches.length} Sakelar</span>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Memuat data sakelar...
                </div>
              ) : switches.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Belum ada sakelar darurat yang aktif.
                </div>
              ) : (
                <div className="space-y-4">
                  {switches.map((s) => (
                    <div
                      key={s.id}
                      className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{s.title}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {s.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono text-[11px]">
                        <div>Penerima: {s.recipientEmail}</div>
                        <div>Interval: {s.checkInFrequencyDays} Hari</div>
                        <div className="col-span-2">
                          Batas Check-in:{" "}
                          <strong className="text-slate-900">
                            {new Date(s.nextCheckInDeadline).toLocaleString("id-ID")}
                          </strong>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleCheckIn(s.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                        >
                          <span>💚</span> Konfirmasi Saya Masih Hidup (Check-In)
                        </button>
                      </div>
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
