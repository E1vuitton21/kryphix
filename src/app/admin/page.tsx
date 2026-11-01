"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        window.location.href = "/admin/login";
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-xs text-slate-400">
        <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-3" />
        Menghubungkan ke Nexus Telemetry Core...
      </div>
    );
  }

  const metrics = stats?.metrics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
              NEXUS TELEMETRY RADAR • LIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Konsol Pengawasan Master
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-pink-500/20 text-pink-400 border border-pink-500/40 hover:bg-pink-500/30 transition-all flex items-center gap-1.5"
          >
            <span>👁️</span> Stealth Escrow
          </Link>
          <Link
            href="/admin/visitors"
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all flex items-center gap-1.5"
          >
            <span>📡</span> Radar Pengunjung
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Total Pengunjung Terlacak
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-white">
              {metrics?.totalVisitors || 0}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80">
              5-Tier Cookies
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Sidik jari canvas & WebGL terekam</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Pengguna Terdaftar
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-white">
              {metrics?.totalUsers || 0}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
              Identity Stitched
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Terkoneksi ID pengunjung</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Pesan Dihancurkan (Shredded)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-pink-400">
              {metrics?.shreddedMessages || 0}{" "}
              <span className="text-xs text-slate-500 font-normal">/ {metrics?.totalMessages || 0}</span>
            </span>
            <span className="text-[10px] font-mono text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800/80">
              DoD 5220.22-M
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Sertifikat audit Ed25519 terbit</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Pendapatan Midtrans
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {formatRupiah(metrics?.totalRevenueRupiah || 0)}
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
              {metrics?.totalOrdersCount || 0} Order
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Top-up QRIS & VA settlement</p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Activity Feed */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              📡 Arus Aktivitas Pengunjung Terbaru
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Auto-Refreshed</span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {stats?.recentEvents?.map((evt: any) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{evt.eventName}</span>
                    <span className="text-slate-500 text-[10px]">
                      {evt.visitor?.deviceCategory || "DEVICE"}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] block truncate max-w-[280px]">
                    {evt.pageUrl}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-300 text-[11px] block">{evt.ipAddress}</span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(evt.createdAt).toLocaleTimeString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              📜 Audit Log Operasional Admin
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Tabel Tidak Dapat Diubah</span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {stats?.recentAuditLogs?.map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-pink-400 font-bold">{log.action}</span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(log.createdAt).toLocaleTimeString("id-ID")}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">{log.reason}</p>
                <span className="text-[10px] text-slate-500 block">IP Operator: {log.ipAddress}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

