"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-cyan-400/50 shadow-[0_0_12px_rgba(0,210,255,0.3)] bg-slate-950 flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/icons/kryphix-icon.ico"
              alt="Kryphix"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
              KRYPHIX<span className="text-cyan-500">.</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
              Zero-Knowledge Suite
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/#fitur" className="hover:text-cyan-600 transition-colors">
            Fitur
          </Link>
          <Link href="/cara-kerja" className="hover:text-cyan-600 transition-colors">
            Cara Kerja
          </Link>
          <Link href="/harga" className="hover:text-cyan-600 transition-colors">
            Harga & Token
          </Link>
          <Link href="/verify-shred" className="hover:text-pink-600 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
            Audit Shred
          </Link>
          <Link href="/faq" className="hover:text-cyan-600 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 hover:text-cyan-600 px-3.5 py-2 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-4 py-2 transition-all shadow-sm"
          >
            Daftar Gratis (+6 KRX)
          </Link>
          <Link
            href="/#instant-creator"
            className="text-sm font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded-lg px-4 py-2 shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            ⚡ Buat Pesan
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Fitur
          </Link>
          <Link
            href="/cara-kerja"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Cara Kerja
          </Link>
          <Link
            href="/harga"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Harga & Token
          </Link>
          <Link
            href="/verify-shred"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-pink-600 hover:bg-pink-50 rounded-lg"
          >
            Audit Proof-of-Shred
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            FAQ
          </Link>
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center w-full py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Masuk Akun
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center w-full py-2.5 text-sm font-semibold text-slate-900 bg-cyan-400 rounded-lg shadow-sm"
            >
              Daftar Akun Baru (+6 Token Gratis)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

