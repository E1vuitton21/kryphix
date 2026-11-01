import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InstantSecretCreator } from "@/components/home/InstantSecretCreator";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-200/30 via-pink-200/20 to-purple-200/25 blur-3xl rounded-full -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & Call to Actions */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/90 text-slate-800 border border-slate-300 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  KRYPHIX v3.0 • ZERO-KNOWLEDGE EPHEMERAL SUITE
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Kedaulatan Privasi Absolut.{" "}
                  <span className="bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Hancur Lebur
                  </span>{" "}
                  Tanpa Jejak Digital.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Kirim kata sandi, berkas rahasia, dan obrolan berdurasi waktu menggunakan enkripsi client-side AES-256-GCM.
                  Didukung protokol penghancuran memori digital standar DoD 5220.22-M dengan sertifikat audit kriptografis.
                </p>

                {/* Trust Metrics Pill */}
                <div className="grid grid-cols-3 gap-4 pt-2 pb-2 max-w-lg">
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200 shadow-sm text-center">
                    <span className="block font-black text-xl text-slate-900 font-mono">48.9K+</span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Pesan Hancur
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200 shadow-sm text-center">
                    <span className="block font-black text-xl text-cyan-600 font-mono">DoD 5220</span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Zeroization
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200 shadow-sm text-center">
                    <span className="block font-black text-xl text-pink-600 font-mono">100%</span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      RAM Ephemeral
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#instant-creator"
                    className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>⚡</span> Mulai Kirim Pesan Rahasia
                  </a>
                  <Link
                    href="/cara-kerja"
                    className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition-all"
                  >
                    Pelajari Arsitektur Kriptografi →
                  </Link>
                </div>
              </div>

              {/* Right Column: Welcome Mascot Showcase */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="relative w-72 sm:w-84 md:w-96 aspect-square">
                  {/* Decorative Glow Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/25 via-pink-400/20 to-purple-400/20 blur-2xl animate-pulse" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src="/images/kryphix-maskot-welcome-rbg.png"
                      alt="Kryphix Welcome Mascot"
                      width={420}
                      height={420}
                      priority
                      className="object-contain drop-shadow-[0_20px_35px_rgba(0,210,255,0.25)] transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  {/* Floating floating status badge */}
                  <div className="absolute -bottom-3 right-4 px-3.5 py-1.5 rounded-xl bg-white/95 border border-slate-200 shadow-lg flex items-center gap-2 text-xs font-mono font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    RAM ZERO-RETENTION READY
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSTANT SECRET CREATOR WIDGET */}
        <section className="py-12 bg-slate-50/50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <InstantSecretCreator />
          </div>
        </section>

        {/* 6 FEATURE SHOWCASE PILLARS */}
        <section id="fitur" className="py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
                EKOSISTEM PRIVASI TOTAL
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Dirancang untuk Melindungi Hal Paling Rahasia
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Setiap modul dibangun dengan prinsip zero-trust. Tidak ada kunci privat yang disimpan di disk, dan seluruh jejak komputasi terisolasi.
              </p>
            </div>

            {/* 6 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="cyber-card rounded-2xl overflow-hidden hover:border-cyan-400 transition-all group flex flex-col">
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/kryphix-ilustartion-1.jpg"
                    alt="Pesan Hancur Mandiri & Screen Shield"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                    BURN-AFTER-READING
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      Pesan Hancur Mandiri & Screen Shield
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Pesan seketika dihancurkan dari memori setelah dibaca. Proteksi anti screenshot dengan dynamic watermark identitas penerima dan mode tahan-layar.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-600 font-bold">AES-256-GCM + DoD Shred</span>
                    <a href="#instant-creator" className="text-xs font-bold text-slate-900 hover:text-cyan-600">
                      Coba Sekarang →
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="cyber-card rounded-2xl overflow-hidden hover:border-pink-400 transition-all group flex flex-col">
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/kryphix-ilustartion-2.jpg"
                    alt="Steganografi Digital Deep Invisibility"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-pink-900/80 text-white backdrop-blur-sm">
                    STEGO STUDIO
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                      Steganografi Digital Invisibility
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Sembunyikan pesan atau berkas berharga ke dalam pixel gambar PNG dengan modulasi LSB yang tidak kasat mata oleh sensor visual manusia.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-pink-600 font-bold">Bit-Level Carrier Injection</span>
                    <Link href="/stego" className="text-xs font-bold text-slate-900 hover:text-pink-600">
                      Buka Studio →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="cyber-card rounded-2xl overflow-hidden hover:border-purple-400 transition-all group flex flex-col">
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/kryphix-ilustartion-3.jpg"
                    alt="Ghost Chat P2P RAM-Only"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-purple-900/80 text-white backdrop-blur-sm">
                    GHOST PROTOCOL
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      Ghost Chat P2P RAM-Only
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Bilik obrolan rahasia kilat berdurasi waktu. Semua riwayat teks dan media tersimpan murni di RAM Redis dan terhapus permanen saat bilik ditutup.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-purple-600 font-bold">Redis Pub/Sub Socket</span>
                    <Link href="/chat" className="text-xs font-bold text-slate-900 hover:text-purple-600">
                      Buat Bilik Chat →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="cyber-card rounded-2xl overflow-hidden hover:border-cyan-400 transition-all group flex flex-col">
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/kryphix-ilustartion-4.jpg"
                    alt="Time-Lock Vault & Shamir Secret Sharing"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                    CRYPTO VAULT
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      Time-Lock Vault & Shamir Secret Sharing
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Kunci berkas hingga waktu masa depan tercapai menggunakan beacon acak drand, atau pecah kunci dekripsi menjadi M-of-N konsensus pemegang kunci.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-600 font-bold">drand Beacon + Shamir Polynomial</span>
                    <Link href="/vault" className="text-xs font-bold text-slate-900 hover:text-cyan-600">
                      Kelola Vault →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 5 */}
              <div className="cyber-card rounded-2xl overflow-hidden hover:border-pink-400 transition-all group flex flex-col">
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/kryphix-ilustartion-5.jpg"
                    alt="Canary Trap & Watermark Forensik"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-pink-900/80 text-white backdrop-blur-sm">
                    FORENSIC AUDIT
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                      Canary Trap & Watermark Forensik
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Sematkan tanda identitas zero-width tak kasat mata unik untuk setiap penerima dokumen. Lacak pelaku kebocoran secara pasti saat teks bocor ke publik.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-pink-600 font-bold">Zero-Width Unicode Tracing</span>
                    <Link href="/canary" className="text-xs font-bold text-slate-900 hover:text-pink-600">
                      Pasang Trap →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 6 */}
              <div className="cyber-card rounded-2xl overflow-hidden hover:border-amber-400 transition-all group flex flex-col">
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <Image
                    src="/images/kryphix-ilustartion-6.jpg"
                    alt="Dead Man's Switch & Blind Notary"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-900/80 text-white backdrop-blur-sm">
                    ESCROW & NOTARY
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      Dead Man's Switch & Blind Notary
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Kirim data wasiat otomatis jika Anda tidak melakukan check-in berkala. Sertifikasi integritas keberadaan dokumen dengan bukti kriptografis RFC 3161.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-600 font-bold">RFC 3161 Timestamp + DMS</span>
                    <Link href="/dms" className="text-xs font-bold text-slate-900 hover:text-amber-600">
                      Aktifkan Wasiat →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & TOKEN TOP-UP OVERVIEW */}
        <section id="harga" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-100 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
                TRANSPARANSI BIAYA TOKEN
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Bayar Sesuai Kebutuhan Anda
              </h2>
              <p className="text-sm text-slate-600">
                Pesan rahasia instan selalu gratis. Fitur tingkat lanjut didukung sistem token KRX isi ulang instan via Midtrans (QRIS & Bank).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Paket 1 */}
              <div className="cyber-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">Paket Coba</span>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">Rp 15.000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4">
                    <span className="text-lg font-bold text-cyan-600 font-mono">25 Token KRX</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>✓ 25x Steganografi Gambar</li>
                    <li>✓ 5x Ghost Chat 30 Menit</li>
                    <li>✓ Akses AI Sanitizer</li>
                  </ul>
                </div>
                <Link
                  href="/harga"
                  className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
                >
                  Pilih Paket
                </Link>
              </div>

              {/* Paket 2 (Popular) */}
              <div className="cyber-card rounded-2xl p-6 flex flex-col justify-between border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.2)] relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400 text-slate-950 uppercase tracking-widest shadow-sm">
                  PALING POPULER
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-600 uppercase">Paket Populer</span>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">Rp 49.000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-center mb-4">
                    <span className="text-lg font-bold text-cyan-700 font-mono">120 Token KRX</span>
                    <span className="block text-[10px] text-cyan-600 font-semibold">(Bonus 20 Token)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>✓ Semua fasilitas Paket Coba</li>
                    <li>✓ 20x Ghost Chat 60 Menit</li>
                    <li>✓ 10x Canary Trap Watermarking</li>
                    <li>✓ Notifikasi Webhook Telegram</li>
                  </ul>
                </div>
                <Link
                  href="/harga"
                  className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-md transition-all"
                >
                  Beli via QRIS Instan
                </Link>
              </div>

              {/* Paket 3 */}
              <div className="cyber-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">Paket Pro</span>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">Rp 149.000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4">
                    <span className="text-lg font-bold text-pink-600 font-mono">450 Token KRX</span>
                    <span className="block text-[10px] text-pink-600 font-semibold">(Bonus 100 Token)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>✓ Semua fasilitas Paket Populer</li>
                    <li>✓ Time-Lock Vault & Shamir 5-Pihak</li>
                    <li>✓ Sertifikat Blind Notary RFC 3161</li>
                    <li>✓ Kuota Berkas Hingga 100 MB</li>
                  </ul>
                </div>
                <Link
                  href="/harga"
                  className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
                >
                  Pilih Paket
                </Link>
              </div>

              {/* Paket 4 */}
              <div className="cyber-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">Paket Master</span>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">Rp 399.000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4">
                    <span className="text-lg font-bold text-purple-600 font-mono">1.350 Token KRX</span>
                    <span className="block text-[10px] text-purple-600 font-semibold">(Bonus 350 Token)</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>✓ Kebutuhan Tim & Investigasi Masif</li>
                    <li>✓ Dead Man's Switch Multichannel</li>
                    <li>✓ Akses Penuh CLI Terminal API Pipe</li>
                    <li>✓ Dukungan VIP Langsung</li>
                  </ul>
                </div>
                <Link
                  href="/harga"
                  className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
                >
                  Pilih Paket
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              MULAI SEKARANG TANPA REGISTRASI
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Kendalikan Privasi Komunikasi Anda Hari Ini
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan jurnalis, analis keamanan, pengacara, dan pengguna yang mempercayakan keamanan data mereka pada arsitektur zero-knowledge Kryphix.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href="#instant-creator"
                className="px-8 py-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                ⚡ Buat Pesan Rahasia Instan
              </a>
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              >
                Daftar Akun Pengguna (+6 Token KRX)
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

