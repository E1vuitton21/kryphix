"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Email atau kata sandi tidak valid");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid">
      <div className="w-full max-w-md cyber-card rounded-2xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 blur-2xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400 bg-slate-950 flex items-center justify-center">
              <Image
                src="/icons/kryphix-icon.ico"
                alt="Kryphix"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
              KRYPHIX<span className="text-cyan-500">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke Portal Privasi</h1>
          <p className="text-xs text-slate-500">
            Akses brankas waktu, steganografi studio, dan kelola saldo token KRX Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@domain.com"
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono font-bold uppercase text-slate-700">
                Kata Sandi
              </label>
              <Link href="/forgot" className="text-[11px] text-cyan-600 hover:underline">
                Lupa sandi?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full p-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengotentikasi...
              </>
            ) : (
              "Masuk ke Akun"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-bold text-cyan-600 hover:underline">
              Daftar Sekarang (+6 Token Gratis)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

