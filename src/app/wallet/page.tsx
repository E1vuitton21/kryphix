"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

declare global {
  interface Window {
    snap: any;
  }
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPkgId, setLoadingPkgId] = useState<number | null>(null);
  const [paymentMsg, setPaymentMsg] = useState<string | null>(null);

  const fetchWalletData = async () => {
    try {
      const meRes = await fetch("/api/v1/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setBalance(meData.user?.balanceTokens || 0);
      }

      const txRes = await fetch("/api/v1/wallet/transactions");
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const packages = [
    { id: 1, name: "Paket Coba", price: 15000, priceFmt: "Rp 15.000", tokens: 25 },
    { id: 2, name: "Paket Populer", price: 49000, priceFmt: "Rp 49.000", tokens: 120, popular: true },
    { id: 3, name: "Paket Pro", price: 149000, priceFmt: "Rp 149.000", tokens: 450 },
    { id: 4, name: "Paket Master", price: 399000, priceFmt: "Rp 399.000", tokens: 1350 },
  ];

  const handleBuy = async (pkg: (typeof packages)[0]) => {
    setLoadingPkgId(pkg.id);
    setPaymentMsg(null);

    try {
      const res = await fetch("/api/v1/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenPackageId: pkg.id,
          amountRupiah: pkg.price,
          tokensToCredit: pkg.tokens,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat transaksi");

      if (window.snap && data.snapToken) {
        window.snap.pay(data.snapToken, {
          onSuccess: () => {
            setPaymentMsg("Pembayaran berhasil! Saldo token sedang diperbarui...");
            setTimeout(fetchWalletData, 2000);
          },
          onPending: () => {
            setPaymentMsg("Menunggu pembayaran via QRIS atau VA...");
          },
          onError: () => {
            setPaymentMsg("Pembayaran dibatalkan atau gagal.");
          },
        });
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      setPaymentMsg(err.message || "Gagal memproses pembayaran");
    } finally {
      setLoadingPkgId(null);
    }
  };

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-KryphixDevKey12345";
  const snapUrl =
    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <div className="flex flex-col min-h-screen">
      <Script src={snapUrl} data-client-key={clientKey} strategy="lazyOnload" />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Top Banner with QRIS Mascot */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase">
                DOMPET KRIPTOGRAFIS
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Saldo & Manajemen Token KRX
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Gunakan token KRX untuk menjalankan fitur steganografi, bilik obrolan rahasia, brankas waktu, dan jebakan canary.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-400 block uppercase">Saldo Saat Ini</span>
                <span className="text-4xl font-black text-cyan-600 font-mono">
                  {balance} KRX
                </span>
              </div>
            </div>

            {/* Payment Mascot Image */}
            <div className="relative w-48 sm:w-60 aspect-square shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-pink-400/20 blur-xl animate-pulse" />
              <Image
                src="/images/kryphix-maskot-payment-qris-rbg.png"
                alt="Payment QRIS Mascot"
                width={220}
                height={220}
                className="object-contain relative drop-shadow-[0_10px_20px_rgba(0,210,255,0.2)]"
              />
            </div>
          </div>

          {paymentMsg && (
            <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono">
              ℹ️ {paymentMsg}
            </div>
          )}

          {/* Quick Top-Up Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Isi Ulang Saldo Token Instan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`cyber-card rounded-2xl p-6 border flex flex-col justify-between ${
                    pkg.popular ? "border-2 border-cyan-400 shadow-md" : "border-slate-200"
                  }`}
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">{pkg.name}</span>
                    <div className="my-3">
                      <span className="text-2xl font-black text-slate-900">{pkg.priceFmt}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center mb-4">
                      <span className="text-xl font-bold text-cyan-600 font-mono">{pkg.tokens} KRX</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(pkg)}
                    disabled={loadingPkgId === pkg.id}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {loadingPkgId === pkg.id ? "Memproses..." : "Bayar via QRIS"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ledger History Table */}
          <div className="cyber-card rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Riwayat Mutasi Saldo Token</h3>
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                Belum ada mutasi transaksi token tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase">
                      <th className="pb-3">Waktu</th>
                      <th className="pb-3">Tipe</th>
                      <th className="pb-3">Keterangan</th>
                      <th className="pb-3 text-right">Jumlah</th>
                      <th className="pb-3 text-right">Saldo Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="text-slate-700 hover:bg-slate-50">
                        <td className="py-3">{new Date(tx.createdAt).toLocaleString("id-ID")}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.entryType === "CREDIT"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {tx.entryType}
                          </span>
                        </td>
                        <td className="py-3 font-sans text-xs">{tx.description}</td>
                        <td
                          className={`py-3 text-right font-bold ${
                            tx.entryType === "CREDIT" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {tx.entryType === "CREDIT" ? `+${tx.amountTokens}` : `-${tx.amountTokens}`} KRX
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900">{tx.balanceAfter} KRX</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

