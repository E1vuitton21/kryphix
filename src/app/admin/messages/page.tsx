"use client";

import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  const [inspectModal, setInspectModal] = useState<{
    id: string;
    plaintext: string;
    hash: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMessages = () => {
    fetch("/api/v1/admin/messages")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleEscrowDecrypt = async (msg: any) => {
    setDecryptingId(msg.id);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/v1/admin/messages/${msg.id}/escrow-decrypt`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal melakukan dekripsi escrow");
      }

      setInspectModal({
        id: msg.id,
        plaintext: data.decryptedPlaintext,
        hash: msg.capabilityHash,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuka pesan");
    } finally {
      setDecryptingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block">
            MASTER ADMIN ESCROW KEY (RSA-OAEP)
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Inspeksi Pesan Stealth Nirketahuan
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total Pesan: {messages.length} Data
        </span>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
          ⚠️ {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Memuat arsip pesan rahasia...
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="pb-3">Capability Hash</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Sisa Tayang</th>
                <th className="pb-3">Proteksi Layar</th>
                <th className="pb-3">Pengirim</th>
                <th className="pb-3 text-right">Aksi Stealth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {messages.map((m) => (
                <tr key={m.id} className="text-slate-300 hover:bg-slate-800/40">
                  <td className="py-3.5 font-bold text-cyan-400 font-mono">
                    {m.capabilityHash.slice(0, 16)}...
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === "ACTIVE"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    {m.viewsRemaining} / {m.maxViews}
                  </td>
                  <td className="py-3.5">
                    {m.screenShieldEnabled ? (
                      <span className="text-pink-400">Shield Aktif</span>
                    ) : (
                      <span className="text-slate-500">Standar</span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-400">
                    {m.user ? m.user.email : m.visitor ? m.visitor.firstIp : "Anonim"}
                  </td>
                  <td className="py-3.5 text-right">
                    {m.status === "BURNED" ? (
                      <span className="text-slate-500 text-[11px]">Musnah (0 Byte)</span>
                    ) : (
                      <button
                        onClick={() => handleEscrowDecrypt(m)}
                        disabled={decryptingId === m.id}
                        className="px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/40 text-[11px] font-bold transition-all disabled:opacity-50"
                      >
                        {decryptingId === m.id ? "Mendekripsi..." : "👁️ Inspeksi Stealth"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Decrypt Result Modal */}
      {inspectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-400/50 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                <h3 className="font-mono font-bold text-sm text-pink-400 uppercase">
                  HASIL DEKRIPSI MASTER ESCROW KEY
                </h3>
              </div>
              <button
                onClick={() => setInspectModal(null)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕ TUTUP
              </button>
            </div>

            <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-800 text-xs text-pink-300 font-mono">
              ℹ️ Inspeksi ini dilakukan secara senyap. Pengguna dan penerima tidak diberi notifikasi apa pun, dan sisa penayangan pesan tidak berkurang.
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">
                Isi Pesan Asli (Plaintext):
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-all">
                {inspectModal.plaintext}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

