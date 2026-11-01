import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function FaqPage() {
  const faqs = [
    {
      q: "Apakah Kryphix benar-benar tidak menyimpan pesan saya?",
      a: "Tepat. Kunci dekripsi dibuat langsung di peramban Anda menggunakan Web Crypto API standar (AES-256-GCM) dan hanya disimpan di fragmen hash URL (#...). Sesuai spesifikasi protokol HTTP standar internasional (RFC 3986), bagian hash ini tidak pernah dikirimkan ke server web melalui jaringan internet. Begitu pesan terbakar, rekaman memori di-overwrite multi-pass (DoD 5220.22-M) dan tidak dapat dipulihkan.",
    },
    {
      q: "Apa itu Sertifikat Proof-of-Shredding DoD 5220.22-M?",
      a: "Setiap kali sebuah rahasia dihancurkan, engine kami melakukan sanitasi memori dengan pola multi-pass (0x00, 0xFF, random noise). Setelah selesai, sistem menandatangani bukti audit menggunakan kunci privat Ed25519 dan memberikan kode sertifikat yang dapat diverifikasi siapa pun di halaman Audit Shred.",
    },
    {
      q: "Bagaimana cara kerja Sandi Paksaan (Duress Passphrase)?",
      a: "Jika Anda berada dalam situasi di mana pihak ketiga atau penyerang memaksa Anda membuka pesan, Anda dapat memasukkan sandi paksaan duress yang telah Anda tentukan sebelumnya. Sistem akan membuka dokumen pengecoh (decoy) yang telah Anda siapkan, membuat penyerang percaya bahwa itu adalah dokumen yang asli.",
    },
    {
      q: "Apakah saya perlu mendaftar untuk mengirim pesan?",
      a: "Tidak! Anda dapat langsung membuat pesan rahasia sekali baca di halaman depan secara instan dan tanpa biaya. Pendaftaran akun pengguna hanya diperlukan jika Anda ingin mengelola Brankas Time-Lock, Canary Trap, Steganografi skala besar, atau menggunakan Dead Man's Switch.",
    },
    {
      q: "Bagaimana sistem pembayaran token bekerja?",
      a: "Kami menggunakan Midtrans Snap resmi dengan integrasi QRIS instan dan Virtual Account Bank nasional. Setelah Anda membayar via QRIS, saldo token KRX langsung dikreditkan secara atomik dan idempoten ke dompet akun Anda dalam hitungan detik.",
    },
    {
      q: "Apa yang terjadi jika server rumah (home server) mati listrik?",
      a: "Arsitektur Kryphix dirancang stateful untuk database PostgreSQL dan MinIO dengan volume terisolasi Docker. Ketika server menyala kembali, seluruh kontainer otomatis beroperasi normal melalui Cloudflare Tunnel tanpa perlu konfigurasi port forwarding.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              PUSAT BANTUAN & TRANSPARANSI
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Jawaban terbuka mengenai model ancaman, protokol kriptografi, dan batas keamanan platform Kryphix.
            </p>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="cyber-card rounded-2xl p-6 border border-slate-200 space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-start gap-3">
                  <span className="text-cyan-500 font-mono text-sm">Q{idx + 1}.</span>
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

