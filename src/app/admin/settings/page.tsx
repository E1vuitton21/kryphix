"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [welcomeTokens, setWelcomeTokens] = useState(6);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setConfigs(data.configs || []);
        const welcomeCfg = data.configs?.find(
          (c: any) => c.configKey === "FREE_TOKENS_ON_REGISTER"
        );
        if (welcomeCfg) {
          setWelcomeTokens(Number(welcomeCfg.configValue));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSaveWelcomeTokens = async () => {
    setSaveStatus(null);
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configKey: "FREE_TOKENS_ON_REGISTER",
          configValue: welcomeTokens,
        }),
      });

      if (res.ok) {
        setSaveStatus("Konfigurasi token registrasi berhasil disimpan!");
      }
    } catch (err: any) {
      setSaveStatus("Gagal menyimpan konfigurasi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
            MANAJEMEN PARAMETER SISTEM
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Konfigurasi Master & Parameter Operasional
          </h1>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300 font-mono">
          ℹ️ {saveStatus}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Memuat konfigurasi sistem...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Token Registrasi Baru */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-mono font-bold text-sm text-white uppercase">
              💰 Saldo Bonus Registrasi Pengguna
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tentukan jumlah saldo token KRX yang otomatis diberikan secara instan saat ada pengguna baru yang mendaftar akun.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={100}
                value={welcomeTokens}
                onChange={(e) => setWelcomeTokens(Number(e.target.value))}
                className="w-24 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono font-bold text-sm outline-none"
              />
              <span className="text-xs font-mono text-slate-400">Token KRX</span>
            </div>
            <button
              onClick={handleSaveWelcomeTokens}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-md"
            >
              Simpan Perubahan
            </button>
          </div>

          {/* Card 2: Parameter Kriptografi & DoD Shredding */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-mono font-bold text-sm text-white uppercase">
              🛡️ Protokol Penghancuran DoD 5220.22-M
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algoritma pembersihan memori digital dan penerbitan sertifikat bukti penghancuran kriptografis Ed25519.
            </p>
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Metode Standar:</span>
                <span className="text-cyan-400 font-bold">DOD_5220_22_M_RAM_ZERO</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Jumlah Passes:</span>
                <span className="text-pink-400 font-bold">3 Pass (0x00, 0xFF, Noise)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Mesin Tanda Tangan:</span>
                <span className="text-emerald-400 font-bold">Ed25519 Hardware-Isolated</span>
              </div>
            </div>
          </div>

          {/* Card 3: Master Escrow Key Status */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 lg:col-span-2">
            <h3 className="font-mono font-bold text-sm text-white uppercase">
              🔐 Kunci Master Escrow Superadmin (adminWrappedDek)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Setiap kali pengguna membuat rahasia dengan enkripsi client-side, sistem membuat lapis enkripsi kedua (adminWrappedDek) menggunakan kunci publik RSA-OAEP 4096-bit di bawah ini.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 break-all">
              Tipe Kunci: RSA-OAEP-4096 • Fingerprint CA: krx-admin-root-001 • Status: AKTIF & TERENKRIPSI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

