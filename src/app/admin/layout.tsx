"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // Clear admin cookie
    document.cookie = "_krx_admin_token=; path=/; max-age=0;";
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Ikhtisar Radar", href: "/admin", icon: "📊" },
    { label: "Radar Pengunjung", href: "/admin/visitors", icon: "📡" },
    { label: "Pengguna 360°", href: "/admin/users", icon: "👥" },
    { label: "Pesan Stealth Escrow", href: "/admin/messages", icon: "👁️" },
    { label: "Transaksi Midtrans", href: "/admin/payments", icon: "💳" },
    { label: "Konfigurasi Sistem", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-cyan-400 bg-black flex items-center justify-center">
            <Image src="/icons/kryphix-icon.ico" alt="Nexus" width={20} height={20} />
          </div>
          <span className="font-mono font-bold text-sm text-cyan-400 tracking-wider">
            NEXUS CONSOLE
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          ☰
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Console Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400/80 bg-slate-950 flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.4)]">
              <Image src="/icons/kryphix-icon.ico" alt="Nexus" width={24} height={24} />
            </div>
            <div>
              <span className="font-black text-sm tracking-widest text-white uppercase block">
                NEXUS<span className="text-cyan-400">.</span>CONSOLE
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                Isolated Root Subdomain
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-6 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-400">OPERATOR: SUPERADMIN</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span>🔒</span> Kunci & Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen overflow-x-hidden p-4 sm:p-8 bg-slate-950">
        {children}
      </div>
    </div>
  );
}

