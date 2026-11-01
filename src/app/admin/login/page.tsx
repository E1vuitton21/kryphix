"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Otorisasi operator ditolak");
      }

      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Neon Glow accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 blur-3xl pointer-events-none" />

        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-cyan-400 bg-black flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,210,255,0.3)] mb-4">
            <Image src="/icons/kryphix-icon.ico" alt="Nexus Console" width={32} height={32} />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/80 px-2.5 py-1 rounded-full">
            SUBDOMAIN TERISOLASI
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white pt-1">
            Nexus Superadmin Operator
          </h1>
          <p className="text-xs text-slate-400">
            Akses pemantauan telemetri, inspeksi escrow stealth, dan konfigurasi master server.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
              Username Operator / Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kryphix_admin"
              required
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">
              Password Master Operator
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Mengotentikasi Operator...
              </>
            ) : (
              "🔓 Akses Konsol Nexus"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <span className="text-[10px] font-mono text-slate-500">
            Akses diaudit dan dicatat dalam tabel admin_audit_logs dengan stempel IP.
          </span>
        </div>
      </div>
    </div>
  );
}

