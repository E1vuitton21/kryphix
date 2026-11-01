"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/payments")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
            REKONSILIASI MIDTRANS PAYMENT GATEWAY
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Transaksi & Pembayaran Token QRIS/VA
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total Transaksi: {orders.length}
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Memuat data transaksi pembayaran...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Belum ada transaksi pembayaran tercatat.
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Pengguna</th>
                <th className="pb-3">Nominal IDR</th>
                <th className="pb-3">Kredit Token</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Metode Bayar</th>
                <th className="pb-3 text-right">Waktu Penyelesaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o.id} className="text-slate-300 hover:bg-slate-800/40">
                  <td className="py-3.5 font-bold text-cyan-400">{o.orderId}</td>
                  <td className="py-3.5">
                    <span className="text-white block font-sans text-xs">
                      {o.user?.displayName || "Pengguna"}
                    </span>
                    <span className="text-slate-500 text-[10px]">{o.user?.email}</span>
                  </td>
                  <td className="py-3.5 font-bold text-emerald-400">
                    {formatRupiah(o.amountRupiah)}
                  </td>
                  <td className="py-3.5 text-slate-200">+{o.tokensToCredit} KRX</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === "SETTLED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : o.status === "PENDING"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400 uppercase text-[10px]">
                    {o.paymentType || "QRIS / VA"}
                  </td>
                  <td className="py-3.5 text-right text-slate-400">
                    {o.settlementTime
                      ? new Date(o.settlementTime).toLocaleString("id-ID")
                      : new Date(o.createdAt).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

