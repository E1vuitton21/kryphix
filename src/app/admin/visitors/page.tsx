"use client";

import { useEffect, useState } from "react";

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/visitors")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setVisitors(data.visitors || []);
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
            TELEMETRI FIRST-PARTY COOKIES
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Radar Pengunjung Masif & Entropi Hardware
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total Terekam: {visitors.length} Pengunjung
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Memuat data radar pengunjung...
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Belum ada pengunjung terdeteksi di server.
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="pb-3">Visitor UUID (_krx_vid)</th>
                <th className="pb-3">IP Terakhir</th>
                <th className="pb-3">Perangkat</th>
                <th className="pb-3">Sidik Jari Hardware</th>
                <th className="pb-3">Akun Tertaut (Stitched)</th>
                <th className="pb-3 text-right">Terakhir Aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {visitors.map((v) => (
                <tr key={v.visitorId} className="text-slate-300 hover:bg-slate-800/40">
                  <td className="py-3.5 font-bold text-cyan-400">{v.visitorId.slice(0, 18)}...</td>
                  <td className="py-3.5 text-slate-200">{v.lastIp}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {v.deviceCategory}
                    </span>
                  </td>
                  <td className="py-3.5 text-[10px] text-slate-400">
                    <div>Canvas: {v.hardwareCanvasHash?.slice(0, 10) || "N/A"}</div>
                    <div>WebGL: {v.hardwareWebglHash?.slice(0, 10) || "N/A"}</div>
                  </td>
                  <td className="py-3.5">
                    {v.linkedUser ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        {v.linkedUser.email}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">Anonim</span>
                    )}
                  </td>
                  <td className="py-3.5 text-right text-slate-400">
                    {new Date(v.lastSeenAt).toLocaleString("id-ID")}
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

