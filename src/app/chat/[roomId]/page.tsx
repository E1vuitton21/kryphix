"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);
  const roomId = resolvedParams.roomId;

  const [alias, setAlias] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [roomMeta, setRoomMeta] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("00:00");
  const [isClosed, setIsClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Poll room messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/v1/chat/${roomId}`);
      if (res.status === 410) {
        setIsClosed(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setRoomMeta(data.room);
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  // Countdown timer calculation
  useEffect(() => {
    if (!roomMeta?.expiresAt) return;

    const timer = setInterval(() => {
      const remainingMs = new Date(roomMeta.expiresAt).getTime() - Date.now();
      if (remainingMs <= 0) {
        setTimeLeft("00:00");
        setIsClosed(true);
        clearInterval(timer);
      } else {
        const m = Math.floor(remainingMs / 60000);
        const s = Math.floor((remainingMs % 60000) / 1000);
        setTimeLeft(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [roomMeta]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !alias.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/chat/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderAlias: alias,
          encryptedContent: inputText, // Encrypted or payload
        }),
      });

      if (res.ok) {
        setInputText("");
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestroyRoom = async () => {
    if (!confirm("Hancurkan bilik obrolan ini sekarang? Semua riwayat di RAM akan dimusnahkan seketika!")) {
      return;
    }
    try {
      await fetch(`/api/v1/chat/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CLOSE_ROOM" }),
      });
      setIsClosed(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Top Bar with Countdown Timer */}
          <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <div>
                <span className="text-xs font-mono font-bold text-slate-800 uppercase block">
                  Bilik Ghost Chat • {roomId.slice(0, 8)}...
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Maks. {roomMeta?.maxParticipants || 2} Partisipan • Redis RAM Storage
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Sisa Waktu Aktif</span>
                <span className="text-lg font-black font-mono text-purple-600">{timeLeft}</span>
              </div>
              <button
                onClick={handleDestroyRoom}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-mono text-xs font-bold"
              >
                🔥 Hancurkan
              </button>
            </div>
          </div>

          {/* Closed State */}
          {isClosed ? (
            <div className="cyber-card rounded-2xl p-10 border border-slate-200 shadow-lg text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto text-2xl">
                💨
              </div>
              <h3 className="text-xl font-bold text-slate-900">Bilik Obrolan Telah Lebur Tanpa Jejak</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Durasi obrolan telah kedaluwarsa atau tuan rumah telah menghancurkan bilik. Seluruh memori RAM di-zeroize permanen.
              </p>
              <div className="pt-2">
                <Link
                  href="/chat"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Buat Bilik Baru
                </Link>
              </div>
            </div>
          ) : !hasJoined ? (
            /* Join Gate: Enter alias */
            <div className="cyber-card rounded-2xl p-8 border border-slate-200 shadow-xl space-y-6 text-center max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">Masukkan Nama Samaran Anda</h3>
              <p className="text-xs text-slate-500">
                Nama ini hanya terlihat oleh lawan bicara di dalam bilik ini.
              </p>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Contoh: Tamu-09"
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-900 outline-none focus:border-purple-500"
              />
              <button
                onClick={() => {
                  if (alias.trim()) setHasJoined(true);
                }}
                disabled={!alias.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-md disabled:opacity-50"
              >
                Gabung ke Obrolan
              </button>
            </div>
          ) : (
            /* Chat Interface */
            <div className="cyber-card rounded-2xl border border-slate-200 shadow-xl flex flex-col h-[520px] overflow-hidden">
              {/* Message List */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                    Bilik siap. Mulailah mengetik pesan rahasia...
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === alias;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] font-mono text-slate-400 mb-1 px-1">
                          {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString("id-ID")}
                        </span>
                        <div
                          className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-mono leading-relaxed ${
                            isMe
                              ? "bg-purple-600 text-white rounded-br-none shadow-sm"
                              : "bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white shadow-md disabled:opacity-50"
                >
                  Kirim
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

