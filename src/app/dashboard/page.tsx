"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setIsLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white cyber-grid">
        <div className="flex items-center gap-3 font-mono text-sm text-slate-600">
          <span className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          Memuat Portal Kriptografis Kryphix...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Welcome User Banner */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 blur-3xl pointer-events-none" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full uppercase">
                  OPERATOR TEROTENTIKASI
                </span>
                {user?.vipTier !== "NONE" && (
                  <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full uppercase">
                    VIP TIER: {user?.vipTier}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Halo, {user?.displayName || "Pengguna Kryphix"}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                ID Pengguna: {user?.id} • Akun Terdaftar: {new Date(user?.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>

            {/* Wallet Quick Widget */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-6 shrink-0 w-full md:w-auto justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 block uppercase">
                  Saldo Dompet KRX
                </span>
                <span className="text-2xl font-black text-cyan-600 font-mono">
                  {user?.balanceTokens || 0} KRX
                </span>
              </div>
              <Link
                href="/wallet"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>💳</span> Top Up Token
              </Link>
            </div>
          </div>

          {/* Privacy Suite Tools Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Koleksi Alat & Layanan Privasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tool 1 */}
              <Link
                href="/#instant-creator"
                className="cyber-card rounded-2xl p-6 border border-slate-200 hover:border-cyan-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-cyan-600 transition-colors">
                    Pesan Hancur Mandiri
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kirim kredensial dan pesan rahasia sekali baca dengan proteksi sandi paksaan duress dan screen shield.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-cyan-600 font-bold">Gratis Tak Terbatas</span>
                  <span className="text-slate-400 group-hover:text-slate-900">Buka →</span>
                </div>
              </Link>

              {/* Tool 2 */}
              <Link
                href="/stego"
                className="cyber-card rounded-2xl p-6 border border-slate-200 hover:border-pink-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl">
                    🖼️
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-pink-600 transition-colors">
                    Steganografi Gambar
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sembunyikan pesan atau berkas rahasia ke dalam pixel foto PNG tanpa perubahan visual yang terlihat.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-pink-600 font-bold">1 Token / Gambar</span>
                  <span className="text-slate-400 group-hover:text-slate-900">Buka →</span>
                </div>
              </Link>

              {/* Tool 3 */}
              <Link
                href="/chat"
                className="cyber-card rounded-2xl p-6 border border-slate-200 hover:border-purple-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                    💬
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                    Ghost Chat RAM-Only
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bilik percakapan real-time berdurasi waktu. Semua histori tersimpan di Redis RAM dan terhapus saat selesai.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-purple-600 font-bold">2 Token / Bilik</span>
                  <span className="text-slate-400 group-hover:text-slate-900">Buka →</span>
                </div>
              </Link>

              {/* Tool 4 */}
              <Link
                href="/vault"
                className="cyber-card rounded-2xl p-6 border border-slate-200 hover:border-cyan-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl">
                    ⏳
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-cyan-600 transition-colors">
                    Time-Lock Crypto Vault
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kunci dokumen berharga hingga waktu masa depan tertentu menggunakan random beacon terverifikasi.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-cyan-600 font-bold">3 Token / Dokumen</span>
                  <span className="text-slate-400 group-hover:text-slate-900">Buka →</span>
                </div>
              </Link>

              {/* Tool 5 */}
              <Link
                href="/canary"
                className="cyber-card rounded-2xl p-6 border border-slate-200 hover:border-pink-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl">
                    🐤
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-pink-600 transition-colors">
                    Canary Trap & Watermark
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Lacak sumber kebocoran internal dengan menyisipkan karakter zero-width tak kasat mata unik untuk setiap penerima.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-pink-600 font-bold">5 Token / Jebakan</span>
                  <span className="text-slate-400 group-hover:text-slate-900">Buka →</span>
                </div>
              </Link>

              {/* Tool 6 */}
              <Link
                href="/sanitizer"
                className="cyber-card rounded-2xl p-6 border border-slate-200 hover:border-amber-400 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                    🧹
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                    AI Text & PII Sanitizer
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bersihkan otomatis data sensitif (NIK, email, nomor HP, kunci API, token rahasia) sebelum dikirim ke AI eksternal.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                  <span className="font-mono text-amber-600 font-bold">Gratis / Unlimited</span>
                  <span className="text-slate-400 group-hover:text-slate-900">Buka →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

