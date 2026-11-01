import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivasiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              KEBIJAKAN TANPA KOMPROMI
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Kebijakan Privasi & Nol Retensi Data
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Berlaku per 1 November 2026. Kami memprioritaskan kedaulatan data pengguna di atas segalanya.
            </p>
          </div>

          <div className="cyber-card rounded-2xl p-6 sm:p-10 border border-slate-200 space-y-6 text-slate-700 text-sm leading-relaxed">
            <h2 className="text-lg font-bold text-slate-900">1. Prinsip Nol Pengetahuan (Zero-Knowledge)</h2>
            <p>
              Kryphix dibangun sedemikian rupa sehingga arsitektur teknis kami tidak mampu membaca konten pesan teks atau berkas rahasia yang Anda transmisikan. Enkripsi dan dekripsi terjadi secara eksklusif pada sisi klien (client-side) peramban Anda.
            </p>

            <h2 className="text-lg font-bold text-slate-900">2. Penghancuran Memori (Digital Zeroization)</h2>
            <p>
              Setelah sebuah rahasia dibuka sesuai batas tayang (view count) atau kedaluwarsa waktu (TTL), ciphertext dan data terkait akan dihapus secara fisik dan memorinya dioverwrite dengan pola multi-pass standar DoD 5220.22-M. Tidak ada cadangan offline atau arsip yang disimpan.
            </p>

            <h2 className="text-lg font-bold text-slate-900">3. Telemetri Keamanan & Deteksi Otomasi</h2>
            <p>
              Untuk mencegah serangan denial-of-service, peretasan bot, dan penyalahgunaan infrastruktur komputasi rumah tangga kami, sistem mengumpulkan entropi hardware peramban (sidik jari grafis WebGL/Canvas dan metrik sesi) melalui first-party cookies yang terenkripsi. Data ini semata-mata digunakan untuk validasi integritas sesi dan mitigasi bot penyerang.
            </p>

            <h2 className="text-lg font-bold text-slate-900">4. Transparansi Pembayaran</h2>
            <p>
              Pembayaran token KRX diproses melalui gateway pembayaran resmi berlisensi Bank Indonesia (Midtrans). Kami tidak pernah menyimpan nomor kartu kredit atau detail perbankan Anda di server kami.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

