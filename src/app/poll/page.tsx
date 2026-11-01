"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PollPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingPollId, setVotingPollId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchPolls = () => {
    fetch("/api/v1/poll")
      .then((res) => res.json())
      .then((data) => {
        setPolls(data.polls || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !option1.trim() || !option2.trim()) return;

    setIsSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/v1/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          options: [option1.trim(), option2.trim()],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat polling");

      setMsg({ text: "Polling homomorfik buta berhasil diterbitkan!", type: "success" });
      setTitle("");
      setOption1("");
      setOption2("");
      fetchPolls();
    } catch (err: any) {
      setMsg({ text: err.message || "Terjadi kesalahan saat membuat polling", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (pollId: string, option: string) => {
    setVotingPollId(pollId);
    setMsg(null);

    try {
      const res = await fetch("/api/v1/poll/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId,
          selectedOption: option,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirimkan suara");
      }

      setMsg({
        text: `✓ Suara untuk "${option}" berhasil dienkripsi Paillier homomorfik dan dicatat secara anonim!`,
        type: "success",
      });

      fetchPolls();
    } catch (err: any) {
      setMsg({ text: err.message || "Gagal memberikan suara", type: "error" });
    } finally {
      setVotingPollId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              VOTING HOMOMORFIK RAHASIA
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Blind Homomorphic Poll
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Kumpulkan suara voting tanpa siapa pun (termasuk server) dapat mengetahui pilihan masing-masing peserta. Hasil dihitung langsung di atas ciphertext terenkripsi (Paillier Cryptosystem).
            </p>
          </div>

          {msg && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono transition-all ${
                msg.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {msg.type === "success" ? "✓" : "⚠️"} {msg.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                ⚡ Buat Polling Buta Baru
              </h3>
              <form onSubmit={handleCreatePoll} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Pertanyaan / Topik Polling
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Pemilihan Ketua Komite Keamanan 2026"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Opsi A
                  </label>
                  <input
                    type="text"
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    placeholder="Opsi 1..."
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Opsi B
                  </label>
                  <input
                    type="text"
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    placeholder="Opsi 2..."
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Menerbitkan Polling..." : "⚡ Buat Polling Homomorfik"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Daftar Polling Aktif</h3>
                <span className="text-xs font-mono text-slate-400">Total: {polls.length} Polling</span>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Memuat data polling...
                </div>
              ) : polls.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Belum ada polling aktif saat ini. Buat polling pertama di samping!
                </div>
              ) : (
                <div className="space-y-4">
                  {polls.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                          {p._count?.votes || 0} Suara Terkumpul
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {Array.isArray(p.optionsJson) &&
                          p.optionsJson.map((opt: string, idx: number) => (
                            <button
                              key={idx}
                              disabled={votingPollId === p.id}
                              onClick={() => handleVote(p.id, opt)}
                              className="p-2.5 rounded-lg bg-white border border-slate-300 text-left font-bold text-xs hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex items-center justify-between group disabled:opacity-50"
                            >
                              <span>🗳️ {opt}</span>
                              <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-600">
                                Pilih →
                              </span>
                            </button>
                          ))}
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
