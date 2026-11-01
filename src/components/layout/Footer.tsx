import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-400 bg-slate-950 flex items-center justify-center">
                <Image
                  src="/icons/kryphix-icon.ico"
                  alt="Kryphix"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                KRYPHIX<span className="text-cyan-500">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Platform privasi dan komunikasi efemeral nirkrompromi. Dirancang dengan zero-knowledge encryption client-side, penghancuran memori digital standar DoD 5220.22-M, dan zero server logs.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2.5 py-1 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              STATUS SISTEM: 100% OPERASIONAL
            </div>
          </div>

          {/* Kolom Fitur */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-4">
              Layanan Privasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#instant-creator" className="hover:text-cyan-600 transition-colors">
                  Pesan Hancur Mandiri
                </Link>
              </li>
              <li>
                <Link href="/stego" className="hover:text-cyan-600 transition-colors">
                  Steganografi Digital
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-cyan-600 transition-colors">
                  Ghost Chat RAM-Only
                </Link>
              </li>
              <li>
                <Link href="/vault" className="hover:text-cyan-600 transition-colors">
                  Time-Lock Crypto Vault
                </Link>
              </li>
              <li>
                <Link href="/canary" className="hover:text-cyan-600 transition-colors">
                  Canary Trap & Watermark
                </Link>
              </li>
              <li>
                <Link href="/sanitizer" className="hover:text-cyan-600 transition-colors">
                  AI Text Sanitizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Keamanan & Audit */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-4">
              Kriptografi & Audit
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cara-kerja" className="hover:text-cyan-600 transition-colors">
                  Arsitektur Zero-Knowledge
                </Link>
              </li>
              <li>
                <Link href="/verify-shred" className="hover:text-pink-600 transition-colors">
                  Verifikasi DoD 5220.22-M Shred
                </Link>
              </li>
              <li>
                <Link href="/notary" className="hover:text-cyan-600 transition-colors">
                  Blind Notary RFC 3161
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="hover:text-cyan-600 transition-colors">
                  Kebijakan Tanpa Jejak
                </Link>
              </li>
              <li>
                <Link href="/syarat" className="hover:text-cyan-600 transition-colors">
                  Ketentuan Layanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom Akun & Dompet */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-4">
              Akun & Monetisasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-cyan-600 transition-colors">
                  Daftar Akun Baru (+6 KRX)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-600 transition-colors">
                  Masuk Portal Pengguna
                </Link>
              </li>
              <li>
                <Link href="/harga" className="hover:text-cyan-600 transition-colors">
                  Beli Token KRX (Midtrans QRIS)
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="hover:text-cyan-600 transition-colors">
                  Dompet & Riwayat Transaksi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Kryphix Privacy Engine. Seluruh data dilindungi enkripsi client-side.</p>
          <div className="flex items-center gap-6">
            <span>Standar Kriptografi: AES-256-GCM / Ed25519</span>
            <span>Host: Home Server Containerized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

