# MODUL 03: ALUR OPERASIONAL PENGGUNA & SIKLUS HIDUP PESAN
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** Alur Interaksi Pengirim, Penerima (Hold-to-Reveal), Steganografi, Ghost Chat, Time-Lock, Canary Trap, CLI Pipe, dan Mesin Status Siklus Hidup Pesan

---

## 3. Gambaran Pengalaman Pengguna dan Alur Operasional Terpadu (v3.0)

### 3.1 Alur Pengirim Pesan Rahasia (Kryphix Secrets)
1. Pengguna membuka `https://kryphix.my.id/secrets/new` di ponsel pintar (*Mobile*) atau komputer (*Desktop*).
2. Memilih tipe payload: Pesan Teks Murni atau Unggah Dokumen (PDF, Foto, Dokumen).
3. Mengatur masa aktif (TTL) dan batas pembukaan (*Max Views*).
4. Mengaktifkan opsi proteksi spionase:
   - *Anti-Forensic Screen Shield* (Watermark IP + Jam penerima dan mode sentuh *Hold-to-Reveal*).
   - *Decoy Link Masquerade* (Tautan menyamar sebagai blog resep kue).
   - *Duress Passphrase* (Sandi paksaan jika di bawah intimidasi).
5. Sistem menghitung kuota token yang dibutuhkan via API `/api/pricing/quote`.
6. Browser menghasilkan Data Encryption Key (DEK) acak 256-bit dan mengenkripsi payload dengan AES-256-GCM.
7. Kunci DEK dienkripsi ganda (*Dual-Envelope*): satu salinan dibungkus dengan Kunci Publik Admin (`adminWrappedDek`), sedangkan salinan plaintext DEK disematkan hanya di URL fragment (`#<DEK>`).
8. Ciphertext dikirim ke backend dan disimpan di PostgreSQL / MinIO lokal. Pengguna mendapatkan tautan rahasia yang siap disalin ke WhatsApp, Telegram, atau email.

### 3.2 Alur Penerima Pesan Rahasia & Proteksi Layar
1. Penerima membuka tautan `https://kryphix.my.id/n/<capabilitySlug>#<DEK>`. Bagian hash (`#<DEK>`) tidak pernah terkirim ke server (standar HTTP W3C).
2. Browser merender cangkang putih bersih anti-bot (*Interstitial Confirmation Shell*). Kuota tayang pesan belum terpotong.
3. Penerima menekan tombol *"BUKA RAHASIA SEKARANG"*:
   - Browser mengirimkan permintaan `POST /api/box/<capabilitySlug>/open`.
   - Backend memverifikasi batas tayang secara atomik (`views_remaining = views_remaining - 1`).
   - Ciphertext dirilis ke browser penerima.
4. Mesin Web Crypto di browser penerima mendekripsi ciphertext menggunakan DEK dari fragment URL.
5. Jika opsi *Screen Shield* aktif:
   - Layar dilindungi kanvas watermark transparan yang memuat IP penerima dan jam mikrodetik.
   - Konten teks hanya terbaca saat layar ditekan/disentuh (*Hold-to-Reveal*); jika jari diangkat atau mouse digeser keluar, teks langsung kembali buram (*Auto-Blur*).
6. Begitu kuota habis atau tab ditutup, data seketika musnah secara permanen dari server (*DoD 5220.22-M memory zeroing*), dan sertifikat pemusnahan diterbitkan.

### 3.3 Alur Steganografi Digital (Image & Audio Camouflage)
1. Pengguna membuka Steganografi Studio di peramban web.
2. Memilih gambar pembawa (Carrier PNG) atau file audio (Carrier WAV).
3. Mengetik pesan rahasia atau melampirkan berkas dokumen rahasia.
4. Browser mengenkripsi dokumen dengan AES-256-GCM, lalu menyisipkan bit-bit ciphertext ke dalam bit terendah (*Least Significant Bit / LSB*) piksel warna canvas atau sampel audio.
5. Pengguna mengunduh berkas steganografi bertampilan normal yang siap dibagikan ke media sosial publik tanpa memicu kecurigaan sensor.
6. Penerima membuka menu *Stego Decoder*, mengunggah gambar/audio, memasukkan kata sandi, dan mengekstrak dokumen rahasia langsung di memori browser.

### 3.4 Alur Bilik Obrolan Rahasia Real-Time (Kryphix Ghost Chat)
1. Tuan rumah (*Host*) menentukan durasi bilik obrolan (15 menit, 30 menit, 1 jam, atau 24 jam) dan membayar token.
2. Backend membuat sesi di PostgreSQL dan channel Redis Pub/Sub, lalu menghasilkan tautan ber-kunci: `https://kryphix.my.id/chat/<roomId>#<RoomKey>`.
3. Tamu bergabung melalui tautan tanpa perlu registrasi akun.
4. Kunci ruangan dinegosiasikan di klien; pesan teks, foto, dan memo suara dienkripsi E2EE sebelum dikirim melalui relay WebSocket Caddy/Redis.
5. Fitur Spionase Aktif:
   - *Panic Button:* Satu ketukan oleh salah satu pihak menghancurkan seluruh riwayat di kedua layar secara seketika.
   - *Anti-Peeping:* Layar buram otomatis saat tab kehilangan fokus (*window blur*).
   - *Auto-Reap:* Ruangan hangus otomatis jika tidak ada aktivitas selama 3 menit berturut-turut.

### 3.5 Alur Holographic Time-Lock Vault & Shamir's Multi-Sign
1. Pengguna memilih berkas rahasia dan menentukan waktu pembukaan masa depan atau membagi kunci ke $N$ rekan terpercaya.
2. *Time-Lock:* Browser mengenkripsi berkas menggunakan kunci publik putaran waktu terdistribusi Drand League of Entropy. Berkas tidak dapat dibuka siapa pun sebelum waktu target tercapai secara matematis.
3. *Shamir's Multi-Sign:* Browser memecah kunci master menjadi $N$ pecahan ($k$-of-$n$ threshold). Saat rekonsiliasi, minimal $K$ pemegang kunci memasukkan pecahannya ke browser untuk merekonstruksi berkas secara lokal.

### 3.6 Alur Canary Leak-Trap (Pelacak Pembocor Dokumen)
1. Pengguna menyalin draft rahasia ke editor Canary Trap dan memasukkan daftar calon penerima.
2. Browser menyisipkan kombinasi biner karakter tak terlihat Unicode Zero-Width (`\u200B` dkk.) unik untuk masing-masing penerima.
3. Teks dibagikan; karakter tak terlihat ikut tersalin secara permanen ke clipboard saat teks di-copy-paste ke WhatsApp/Word.
4. Jika terjadi kebocoran, pemilik menyalin teks bocoran ke menu *Canary Leak Detector*; sistem membaca biner tersembunyi dan membongkar identitas pembocor dengan akurasi 100%.

### 3.7 Alur Developer CLI Secret Pipe
1. Developer di terminal menjalankan perintah cURL native:
   `cat .env | curl -s -X POST https://kryphix.my.id/api/v1/pipe -F "ttl=10m" -F "burn=1"`
2. Server merespons langsung di konsol terminal dengan kotak ASCII Art dan QR Code ANSI terminal.
3. Rekan kerja memindai QR atau membuka URL di browser; kredensial terbaca dan seketika musnah (*Burn-After-Read*).

### 3.8 Alur Pembelian Token & Checkout Midtrans
1. Pengguna membuka menu Dompet (`/wallet`) di ponsel atau desktop.
2. Memilih paket Top-Up Token atau paket Langganan VIP Bulanan.
3. Backend memanggil Midtrans Snap API dan menampilkan modal pembayaran di layar.
4. Pengguna memindai QRIS menggunakan aplikasi e-wallet (GoPay/ShopeePay) atau mobile banking (BCA/Mandiri/BRI).
5. Webhook Midtrans masuk ke server rumah via terowongan Cloudflare Tunnel secara instan (<1 detik).
6. Backend memvalidasi signature SHA-512 Midtrans, mengkreditkan saldo token di tabel `wallets`, dan mencatat mutasi di `token_ledgers` secara atomik.

### 3.9 Alur Pelacakan Pengunjung & Jahitan Identitas (Visitor Telemetry)
1. Saat pengunjung pertama kali mendarat di landing page, middleware menyematkan first-party cookie `_krx_vid`.
2. Script `security-entropy.js` mengekstrak sidik jari perangkat keras (`_krx_fp`), resolusi layar, dan konteks WebGL/AudioContext.
3. Backend menyelesaikan IP Geolocation (Kota, Negara) dan ISP/ASN menggunakan database MaxMind GeoLite2 lokal di kontainer Docker (<1 ms).
4. Saat pengunjung anonim mendaftar akun atau login, backend secara atomik mengaitkan `VisitorTrack.linked_user_id = User.id` (*Identity Stitching*).
5. Seluruh linimasa sejak pengunjung anonim mendarat hingga menjadi pengguna aktif tersinkronisasi di database dan siap dimonitor di panel admin.

### 3.10 Alur Operasional Superadmin (Isolated Console Experience)
1. Superadmin mengakses portal terisolasi `https://nexus-console.kryphix.my.id`.
2. Sistem memverifikasi kecocokan IP terhadap *IP Whitelist*, kredensial `admin_users`, dan kode 2FA TOTP wajib.
3. Superadmin memantau **Live Surveillance Radar** (arus pengunjung aktif, bilik chat yang sedang berjalan, pesan aktif, dan arus pendapatan).
4. Superadmin dapat membuka **User 360° Inspector** untuk meninjau linimasa microsecond seorang pengguna dari detik pertama mendarat di landing page.
5. Superadmin dapat membuka **Stealth Message/Chat Inspector** untuk memeriksa isi konten pesan rahasia via Master Escrow Key demi pencegahan kejahatan siber berat.
6. Superadmin dapat mengedit tampilan landing page secara no-code melalui **Dynamic CMS Desk**, atau mengubah tarif token dan paket langganan VIP via **Service Configurator**.

---

---

## 10. Status dan Siklus Hidup Pesan

Status yang disarankan:
- `ACTIVE`: pesan masih dapat dibuka.
- `EXHAUSTED`: kuota pembukaan habis.
- `EXPIRED`: waktu kedaluwarsa tercapai.
- `REVOKED`: dicabut pengirim atau sistem.
- `PENDING_CLEANUP`: tidak dapat diakses dan menunggu penghapusan data.
- `DELETED`: data yang ditetapkan untuk dihapus telah diproses sesuai kebijakan.

Alur:
```text
CREATED
   |
   v
 ACTIVE ---------------------> REVOKED
   |                             
   +---- kuota habis ----------> EXHAUSTED
   |
   +---- waktu habis ----------> EXPIRED
                                  |
                                  v
                            PENDING_CLEANUP
                                  |
                                  v
                               DELETED
```

Status final tidak boleh kembali menjadi `ACTIVE`. Jika penghapusan gagal, pesan tetap tidak dapat diakses dan worker harus mencoba ulang secara aman.

---

---

---
