"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

declare global {
  interface Window {
    snap: any;
  }
}

export default function HargaPage() {
  const [loadingPkgId, setLoadingPkgId] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tokenPackages = [
    {
      id: 1,
      name: "Paket Coba",
      price: 15000,
      priceFormatted: "Rp 15.000",
      tokens: 25,
      bonus: 0,
      popular: false,
      desc: "Ideal untuk pengujian fitur enkripsi dan steganografi kasual.",
      features: ["25 Token KRX Instan", "25x Stego Image Injection", "5x Ghost Chat 30 Menit", "Masa Aktif Selamanya"],
    },
    {
      id: 2,
      name: "Paket Populer",
      price: 49000,
      priceFormatted: "Rp 49.000",
      tokens: 120,
      bonus: 20,
      popular: true,
      desc: "Paling banyak dipilih untuk profesional yang butuh privasi rutin.",
      features: [
        "100 + 20 Bonus Token (Total 120)",
        "20x Ghost Chat 60 Menit",
        "10x Canary Trap Watermark",
        "AI Sanitizer Dokumen Unlimited",
        "Notifikasi Telegram Real-time",
      ],
    },
    {
      id: 3,
      name: "Paket Pro",
      price: 149000,
      priceFormatted: "Rp 149.000",
      tokens: 450,
      bonus: 100,
      popular: false,
      desc: "Untuk advokat, auditor forensik, jurnalis investigasi independen.",
      features: [
        "350 + 100 Bonus Token (Total 450)",
        "Time-Lock Vault & Shamir 5-Pihak",
        "Blind Notary RFC 3161 Sertifikat",
        "Prioritas Bandwidth MinIO S3",
        "Dead Man's Switch Multichannel",
      ],
    },
    {
      id: 4,
      name: "Paket Master",
      price: 399000,
      priceFormatted: "Rp 399.000",
      tokens: 1350,
      bonus: 350,
      popular: false,
      desc: "Solusi volume besar untuk kantor hukum dan tim riset keamanan.",
      features: [
        "1.000 + 350 Bonus Token (Total 1.350)",
        "Akses Terminal CLI Pipe API",
        "Kustomisasi Decoy Domain",
        "Audit Log Forensik Lengkap",
        "Dukungan Langsung VIP",
      ],
    },
  ];

  const handlePurchase = async (pkg: (typeof tokenPackages)[0]) => {
    setLoadingPkgId(pkg.id);
    setErrorMessage(null);
    setPaymentStatus(null);

    try {
      // 1. Create order on backend
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
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat pesanan pembayaran");
      }

      // 2. Open Midtrans Snap popup
      if (window.snap && data.snapToken) {
        window.snap.pay(data.snapToken, {
          onSuccess: function (result: any) {
            setPaymentStatus("Pembayaran berhasil! Token telah ditambahkan ke dompet Anda.");
          },
          onPending: function (result: any) {
            setPaymentStatus("Menunggu penyelesaian pembayaran. Silakan selesaikan via QRIS atau VA.");
          },
          onError: function (result: any) {
            setErrorMessage("Pembayaran gagal atau dibatalkan oleh sistem.");
          },
          onClose: function () {
            // User closed popup
          },
        });
      } else {
        // Fallback redirect if snap js not loaded
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          throw new Error("Midtrans Snap belum siap. Silakan muat ulang halaman.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses transaksi.");
    } finally {
      setLoadingPkgId(null);
    }
  };

  const isProductionMidtrans = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  const snapScriptUrl = isProductionMidtrans
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-KryphixDevKey12345";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Midtrans Snap JS Integration */}
      <Script src={snapScriptUrl} data-client-key={clientKey} strategy="lazyOnload" />

      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              TOP-UP TOKEN KRX
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Kedaulatan Privasi yang Terjangkau
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Pesan rahasia instan selalu gratis. Beli saldo token KRX kapan saja untuk membuka fitur kriptografi tingkat tinggi dengan metode pembayaran instan QRIS dan Bank Transfer.
            </p>
          </div>

          {/* Alerts */}
          {paymentStatus && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-2 max-w-2xl mx-auto">
              <span>✅</span> {paymentStatus}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm flex items-center gap-2 max-w-2xl mx-auto">
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tokenPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`cyber-card rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? "border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.25)] relative -translate-y-2"
                    : "border border-slate-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400 text-slate-950 uppercase tracking-widest shadow-sm">
                    PILIHAN TERFAVORIT
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">{pkg.name}</span>
                    {pkg.bonus > 0 && (
                      <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                        +{pkg.bonus} BONUS
                      </span>
                    )}
                  </div>

                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">{pkg.priceFormatted}</span>
                    <span className="text-xs text-slate-400 ml-1">/ one-time</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center mb-5">
                    <span className="text-2xl font-black text-cyan-600 font-mono">{pkg.tokens} KRX</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Saldo Token Siap Pakai</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{pkg.desc}</p>

                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-500 font-bold shrink-0">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loadingPkgId === pkg.id}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {loadingPkgId === pkg.id ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Membuka QRIS...
                    </>
                  ) : (
                    <>
                      <span>💳</span> Beli Sekarang
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Payment Methods Banner */}
          <div className="cyber-card rounded-2xl p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">Didukung Integrasi Resmi Midtrans Snap</h3>
              <p className="text-xs text-slate-500 max-w-xl">
                Pembayaran otomatis terverifikasi secara instan menggunakan tanda tangan HMAC SHA-512. Saldo token langsung masuk ke akun tanpa konfirmasi manual.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-bold text-slate-600">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">QRIS Real-Time</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">GoPay / ShopeePay</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">BCA / Mandiri / BNI VA</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

