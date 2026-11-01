"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
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
            DATA PENGGUNA TERINTEGRASI
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Pengguna 360° & Dompet Token
          </h1>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total Pengguna: {users.length} Akun
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Memuat data pengguna...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Belum ada pengguna terdaftar.
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="pb-3">Email & Alias</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Saldo Dompet</th>
                <th className="pb-3">Aktivitas Fitur</th>
                <th className="pb-3">IP Registrasi</th>
                <th className="pb-3 text-right">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="text-slate-300 hover:bg-slate-800/40">
                  <td className="py-3.5">
                    <span className="font-bold text-white block">{u.displayName || "Tanpa Nama"}</span>
                    <span className="text-cyan-400 text-[11px]">{u.email}</span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-red-950 text-red-400 border border-red-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-cyan-400 text-sm">
                      {u.wallet?.balanceTokens ?? 0} KRX
                    </span>
                  </td>
                  <td className="py-3.5 text-[10px] text-slate-400 space-y-0.5">
                    <div>Pesan: {u._count?.messages || 0}</div>
                    <div>Stego: {u._count?.stegoItems || 0}</div>
                    <div>Canary: {u._count?.canaryTraps || 0}</div>
                  </td>
                  <td className="py-3.5 text-slate-400">{u.registeredIp}</td>
                  <td className="py-3.5 text-right text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("id-ID")}
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

