import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CaraKerjaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full uppercase tracking-wider">
              DOKUMENTASI PROTOKOL
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Cara Kerja Kriptografi Zero-Knowledge
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Penjelasan matematis bagaimana Kryphix menjamin kerahasiaan data Anda tanpa pernah memiliki akses ke kunci dekripsi di level server.
            </p>
          </div>

          {/* Step-by-Step Flow Cards */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 font-mono font-bold flex items-center justify-center">
                  01
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Enkripsi Klien Lokal (Client-Side Encryption)
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Saat Anda mengetik pesan atau mengunggah berkas rahasia, browser mengeksekusi antarmuka{" "}
                <code className="text-xs font-mono bg-slate-100 text-cyan-700 px-1.5 py-0.5 rounded">
                  window.crypto.subtle
                </code>{" "}
                untuk membuat kunci simetris AES-256-GCM (Data Encryption Key / DEK) secara acak. Teks dan berkas dienkripsi di perangkat Anda sebelum ada bit data yang dikirim melalui jaringan.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                <pre>{`// Eksekusi Lokal di Browser Pengguna:
const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"]);
const iv = crypto.getRandomValues(new Uint8Array(12));
const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedData);`}</pre>
              </div>
            </div>

            {/* Step 2 */}
            <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-pink-400 text-white font-mono font-bold flex items-center justify-center">
                  02
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Fragmentasi URL Zero-Knowledge (Hash Anchoring)
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kunci dekripsi 256-bit dimasukkan ke dalam fragmen hash URL (setelah karakter tanda pagar{" "}
                <code className="text-xs font-mono bg-slate-100 text-pink-700 px-1.5 py-0.5 rounded">#</code>). Sesuai spesifikasi protokol HTTP standar (RFC 3986), apa pun yang berada di belakang tanda pagar tidak pernah dikirimkan ke server web dalam HTTP request.
              </p>
              <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 text-xs text-pink-900 font-mono">
                https://kryphix.my.id/n/e3f19a0b-9c21#<span className="font-bold underline">a8f93e01bc8945de21f...</span> (Kunci tidak pernah menyentuh server)
              </div>
            </div>

            {/* Step 3 */}
            <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-400 text-white font-mono font-bold flex items-center justify-center">
                  03
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Protokol Penghancuran DoD 5220.22-M Zeroization
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ketika penerima membuka tautan rahasia, server mengirimkan ciphertext terenkripsi. Begitu pesan selesai didekripsi di browser penerima atau batas kedaluwarsa habis, server mengeksekusi multi-pass overwriting terhadap pointer database dan objek storage MinIO, serta menerbitkan Sertifikat Penghancuran Terverifikasi (Proof-of-Shredding).
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>Pass 1: Zeroize 0x00</span>
                <span>→</span>
                <span>Pass 2: Oneize 0xFF</span>
                <span>→</span>
                <span>Pass 3: Random Pseudo-Noise</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-4">
            <h3 className="text-2xl font-black">Siap Menguji Keamanan Kryphix?</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Kirimkan kredensial atau pesan uji coba pertama Anda dan saksikan bagaimana data terbakar seketika.
            </p>
            <div className="pt-2">
              <Link
                href="/#instant-creator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-lg"
              >
                ⚡ Buat Pesan Rahasia Sekarang
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

