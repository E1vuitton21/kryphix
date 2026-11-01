"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function VaultPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [secretContent, setSecretContent] = useState("");
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [unlockAt, setUnlockAt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchItems = () => {
    fetch("/api/v1/vault/list")
      .then((res) => {
        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error("Unauthorized");
        }
        setIsAuthenticated(true);
        return res.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateVaultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !secretContent.trim()) return;

    setIsUploading(true);
    setStatusMsg(null);

    try {
      // Local client-side AES-GCM encryption
      const key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(secretContent);
      const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
      );

      const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));

      const res = await fetch("/api/v1/vault/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          ciphertextBase64,
          isTimeLocked,
          unlockAt: isTimeLocked && unlockAt ? unlockAt : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan berkas");

      setStatusMsg("Dokumen berhasil dienkripsi dan disimpan ke brankas MinIO!");
      setTitle("");
      setSecretContent("");
      setIsTimeLocked(false);
      setUnlockAt("");
      fetchItems();
    } catch (err: any) {
      setStatusMsg(err.message || "Terjadi kesalahan");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              STORAGE NIR-JEJAK TERISOLASI
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Time-Lock Crypto Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Simpan dokumen rahasia terenkripsi client-side di kontainer MinIO terisolasi. Kunci dokumen agar tidak dapat dibuka sebelum tanggal tertentu.
            </p>
          </div>

          {isAuthenticated === false && (
            <div className="cyber-card rounded-2xl p-6 sm:p-8 border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono font-bold text-amber-700 uppercase">
                  🔒 Sesi Akun Diperlukan
                </span>
                <p className="text-xs text-slate-600">
                  Untuk mengamankan brankas dan mengelola kunci akses berkas terisolasi, silakan masuk ke akun Anda terlebih dahulu.
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
              >
                Masuk ke Akun →
              </Link>
            </div>
          )}

          {statusMsg && (
            <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono">
              ℹ️ {statusMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Upload */}
            <div className="lg:col-span-5 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                🔒 Kunci Dokumen Baru ke Vault
              </h3>
              <form onSubmit={handleCreateVaultItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Judul Dokumen
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kunci Cadangan Wallet / Wasiat Finansial"
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
                    Konten Rahasia yang Dienkripsi
                  </label>
                  <textarea
                    rows={5}
                    value={secretContent}
                    onChange={(e) => setSecretContent(e.target.value)}
                    placeholder="Ketik teks, daftar sandi, seed phrase, atau catatan rahasia..."
                    required
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Aktifkan Fitur Time-Lock
                    </span>
                    <input
                      type="checkbox"
                      checked={isTimeLocked}
                      onChange={(e) => setIsTimeLocked(e.target.checked)}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                  </div>

                  {isTimeLocked && (
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1">
                        Buka Kunci Pada Tanggal & Waktu:
                      </label>
                      <input
                        type="datetime-local"
                        value={unlockAt}
                        onChange={(e) => setUnlockAt(e.target.value)}
                        required={isTimeLocked}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 outline-none"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUploading || !title.trim() || !secretContent.trim()}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all disabled:opacity-50"
                >
                  {isUploading ? "Mengenkripsi & Mengunggah..." : "⚡ Enkripsi & Simpan ke Brankas"}
                </button>
              </form>
            </div>

            {/* List Items */}
            <div className="lg:col-span-7 cyber-card rounded-2xl p-6 border border-slate-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-base text-slate-900">Arsip Brankas Tersimpan</h3>
                <span className="text-xs font-mono text-slate-400">Total: {items.length} Berkas</span>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Memuat arsip brankas...
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  Brankas kosong. Anda belum menyimpan dokumen apa pun.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{item.title}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Ukuran: {item.fileSizeBytes} Bytes • Dibuat: {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="text-right">
                        {item.isTimeLocked ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 block">
                            ⏳ LOCKED HINGGA {new Date(item.unlockAt).toLocaleDateString("id-ID")}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 block">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
