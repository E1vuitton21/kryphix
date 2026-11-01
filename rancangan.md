# KRYPHIX — Rancangan Pengembangan Web Application
> **Nama proyek:** Kryphix (The Ultimate Privacy, Ephemeral Secrecy, and Anti-Forensic Suite)  
> **Domain:** `https://kryphix.my.id` (Aplikasi Layanan Utama) & `https://nexus-console.kryphix.my.id` (Isolated Admin Gateway)  
> **Nama dokumen:** `rancangan.md`  
> **Jenis dokumen:** Product Requirements Document (PRD) + Software Requirements Specification (SRS) + Technical Architecture & Tokenomics Design  
> **Infrastruktur Target:** 100% Home Server Mandiri (Local Docker Containerized, Berjalan di Belakang CGNAT via Cloudflare Tunnel, Biaya Server Rp 0)  
> **Gaya Desain (Default UI):** Clean Bright White Cyberpunk (Latar Putih Bersih `#FFFFFF` dengan Aksen Neon Cyberpunk Estetik, Responsif Mobile & Desktop Native)  
> **Status:** Draft rancangan final — revisi v3.0 (Kurasi Home Server & CGNAT, Eliminasi Fitur Cloud Berbayar & Port 25, 38 Tabel PostgreSQL Sinkron, Model Bisnis Top-Up Token & Langganan VIP)  
> **Versi:** 3.0

---

## 0. Hasil Analisis, Sinkronisasi, dan Keputusan Strategis (v3.0)

Revisi v3.0 adalah penyesuaian arsitektural paling realistis, efisien, dan berorientasi profit tinggi. Dokumen ini mengintegrasikan seluruh kenyataan infrastruktur dan arahan pemilik platform:
1. **Infrastruktur 100% Gratis di Home Server Mandiri (CGNAT-Ready):** Platform tidak lagi bergantung pada biaya sewa cloud bulanan (AWS/GCP/Cloudflare R2/Backblaze B2). Seluruh stack berjalan 100% di dalam kontainer Docker pada server lokal rumah (*Home Server*), memanfaatkan *Cloudflare Tunnel* (`cloudflared`) gratis untuk menembus batasan CGNAT (*Carrier-Grade NAT*) tanpa memerlukan IP publik statis atau port forwarding ISP.
2. **Eliminasi & Kurasi Fitur Tidak Relevan:**
   - **Eliminasi Fitur "Multi-Cloud Cryptographic Shards":** Menghapus ketergantungan pada sewa multi-cloud komersial (R2, Wasabi, B2). Diadaptasi menjadi penyimpanan terenkripsi lokal mandiri berbasis MinIO S3 Container di Home Server.
   - **Eliminasi Fitur "Burner Email Alias":** ISP rumahan di Indonesia (IndiHome, Biznet, FirstMedia, MyRepublic, dll.) memblokir total Port 25 (inbound/outbound) pada jaringan CGNAT. Mengoperasikan mail server penerima email di home server tanpa relay berbayar adalah halusinasi teknis. Fitur ini dieliminasi secara bersih.
   - **Eliminasi Fitur "Corporate Whistleblower B2B SaaS Multi-Tenant Subdomain":** Pengelolaan ratusan domain/subdomain kustom korporat memerlukan lisensi berbayar Cloudflare for SaaS dan arsitektur enterprise. Fitur disederhanakan secara elegan menjadi **Kryphix Secret Drop Box (Kotak Aduan Anonim Pribadi & Investigasi)** yang berjalan terpusat di domain utama.
   - **Eliminasi Fitur "Ultrasonic Sound Beam" & "Dead-Drop NFC":** Dikonfirmasi tetap ditolak karena inkompatibilitas fatal pada browser Apple iOS Safari dan perangkat desktop.
3. **Penyelarasan Desain UI/UX (Clean Bright White Cyberpunk):**
   - Mengubah tampilan bawaan (*default*) dari Dark Mode menjadi **Clean Bright White Cyberpunk**: Latar belakang putih bersih (`#FFFFFF` & `#F8FAFC`), tipografi arang kontras tinggi (`#0F172A`), dan aksen cyberpunk estetik yang memukau (Neon Cyan `#00D2FF`, Cyber Magenta `#FF007F`, Hyper Violet `#7928CA`, dan Terminal Amber `#FFB800`).
   - Mendukung penuh tampilan **Mobile dan Desktop secara native** sejak hari pertama pengembangan.
4. **Model Bisnis Terpadu & Hitungan Finansial Nyata:**
   - Menggabungkan sistem **Pay-As-You-Go Token Topup** (1 Token = Rp500, Min. Rp10.000) dan **Paket Langganan Kuota Token Bulanan (VIP Membership)** melalui payment gateway Midtrans Snap.
   - Karena biaya server adalah **Rp 0 / bulan** (hanya listrik rumah ~Rp27.000/bulan), margin keuntungan bersih (*net profit margin*) mencapai **>98%**.

### 0.1 Proposisi Nilai, Logika Layanan, dan Portofolio Produk Terpadu (v3.0)

- **Tagline Utama:** *"Kirim rahasia. Samarkan jejak. Kunci dengan waktu dan lokasi. Musnahkan tanpa bekas."*
- **Portofolio 16 Fitur Unggulan Siap & Terkurasi (100% Home Server & Web Native):**
  1. **Kryphix Core Secrets (Pesan Teks & Dokumen Sekali Buka):** Enkripsi klien AES-256-GCM, auto-shredding setelah dibuka (*Burn-After-Read*), proteksi sandi paksaan (*Duress Passphrase*), dan unggah dokumen terenkripsi.
  2. **Anti-Forensic Screen Shield & Watermark Dinamis:** Watermark transparan IP dan timestamp penerima di layar untuk mencegah pemotretan kamera HP lain, disertai mode sentuh *Hold-to-Reveal*.
  3. **Steganografi Digital (Image & Audio Camouflage):** Menyisipkan pesan teks dan dokumen rahasia ke dalam bit terendah (LSB) piksel foto PNG atau audio WAV langsung di browser.
  4. **Geo-Fencing & Network Lockdown:** Mengunci pembukaan pesan berdasarkan radius koordinat GPS atau subnet negara menggunakan database MaxMind GeoLite2 offline lokal (<1 ms di Docker).
  5. **Decoy Link Masquerade (URL Masking):** Menyamarkan URL rahasia menjadi artikel resep masakan atau berita teknologi biasa dengan pemicu ketukan tersembunyi.
  6. **Kryphix Ghost Chat Real-Time:** Bilik obrolan langsung via WebSocket relay Redis lokal dengan *Panic Button* instan dan *Auto-Blur* saat tab kehilangan fokus.
  7. **Ephemeral Scrambled Voice Memo:** Perekaman pesan suara 1x dengar dengan distorsi vokal agen intelijen di browser (*Pitch-Shifted & Ring Modulator*) untuk mencegah pelacakan biometrik suara.
  8. **Ephemeral Video Confession:** Perekaman video pendek 30 detik di browser yang otomatis musnah dari memori RAM setelah ditonton 1 kali.
  9. **Dynamic Rolling QR Code:** QR Code yang berganti setiap 15 detik (TOTP) atau musnah setelah 1 kali pemindaian (*Single-Scan Burn*).
  10. **Holographic Time-Lock Vault:** Penguncian berkas rahasia secara matematis berbasis jaringan publik gratis Drand League of Entropy yang mustahil didekripsi siapapun sebelum waktu target tiba.
  11. **Shamir's Secret Sharing (Multi-Sign Split Secret):** Membagi kunci brankas menjadi $N$ pecahan kunci dengan syarat minimal $K$ orang menggabungkan kuncinya ($k\text{-of-}n$).
  12. **Blind Notary Proof-of-Existence:** Sertifikat keberadaan digital PDF bertanda tangan waktu resmi (RFC 3161 TSA) untuk membuktikan kepemilikan ide/dokumen tanpa membuka isinya.
  13. **Cryptographic Proof of Shredding:** Penerbitan sertifikat digital resmi bertanda tangan Ed25519 dan verifikasi QR publik untuk membuktikan secara sah pemusnahan data dari server (DoD 5220.22-M zeroing).
  14. **Canary Leak-Trap & Zero-Width Watermarking:** Penyisipan penanda biner tak terlihat via karakter Unicode Zero-Width (`\u200B` dkk.) untuk melacak dan mengungkap identitas pembocor dokumen rahasia saat disalin ke WhatsApp/Word.
  15. **Developer CLI Secret Pipe:** Endpoint terminal cURL native (`curl -s -F "file=@.env" kryphix.my.id/cli`) yang merespons dengan ASCII Art Box dan QR terminal otomatis.
  16. **Stealth Paste Redactor & AI Prompt Sanitizer:** Pembersih otomatis data sensitif (API keys, NIK, kartu kredit, password) berbasis WASM di browser sebelum teks disalin ke ChatGPT/Claude, lengkap dengan restorasi lokal balasan AI.
  17. **Secret Drop Box (Kotak Aduan Anonim Dua Arah):** Kotak aduan publik slug kustom dengan enkripsi asimetris dan *Receipt Token* untuk diskusi asinkron dua arah tanpa membuka identitas pelapor.
  18. **Dead Man's Switch (Wasiat Kriptografis Otomatis):** Penitipan pesan wasiat otomatis dengan interval konfirmasi detak kehidupan (*heartbeat check-in*) dan auto-release via Bot Telegram resmi / SMTP gratis jika pemilik tidak aktif.
  19. **Kryphix Vault .krx Container & Offline Reader:** Ekspor cadangan transkrip chat dan dokumen terenkripsi biner AES-256-GCM + Argon2id yang dapat dibuka secara offline di `/tools/vault-reader`.

---

## 1. Ringkasan Eksekutif

Kryphix adalah platform web terpadu untuk komunikasi rahasia tingkat lanjut, bilik obrolan langsung nir-jejak (*ephemeral live chat*), brankas penyimpanan terenkripsi terkunci waktu, dan sistem perlindungan privasi anti-forensik (*The Ultimate Ephemeral Secrecy Suite*). Platform ini dirancang untuk melayani spektrum kebutuhan kerahasiaan yang luas: mulai dari komunikasi personal bebas pelacak, proteksi aset intelektual kreator, pertukaran data sensitif profesional hukum dan keuangan, perlindungan dokumen internal kantor, hingga pengembang perangkat lunak (*DevOps/Sysadmin*).

### 1.1 Keunggulan Arsitektur Home Server & Kemandirian Penuh
Berbeda dari platform komersial yang terbebani biaya langganan cloud bulanan mahal, Kryphix dirancang untuk berjalan **100% mandiri di atas Home Server fisik milik pemilik** menggunakan orkestrasi kontainer Docker. 

Konektivitas publik diamankan secara cuma-cuma (*100% free*) menggunakan **Cloudflare Tunnel (`cloudflared`)**, sehingga server rumah yang berada di balik jaringan **CGNAT** (*Carrier-Grade NAT* tanpa IP publik dan tanpa port-forwarding) dapat diakses dengan latensi ultra-rendah dan perlindungan penuh dari serangan DDoS serta sertifikasi SSL/TLS otomatis di domain `https://kryphix.my.id`.

### 1.2 Fondasi Dual-Layer Privacy & Superadmin Nexus
Platform beroperasi dengan model **Dual-Layer Privacy Model**:
- **Lapisan Luar (Public Facade):** Pengguna disajikan pengalaman kerahasiaan murni *Zero-Knowledge* dengan enkripsi sisi klien (*Web Crypto API*), steganografi citra/audio, pelindung layar anti-foto, dan penghancuran memori instan.
- **Lapisan Dalam (Stealth Oversight):** Pemilik platform (Superadmin) memiliki kontrol operasional mutlak melalui portal terisolasi `https://nexus-console.kryphix.my.id`. Dilengkapi dengan pelacakan *first-party cookies* bertingkat (`_krx_vid`, `_krx_sid`, `_krx_jny`, `_krx_fp`), pengait identitas otomatis (*Identity Stitching*), dan Kunci Master Escrow (`adminWrappedDek`) untuk melindungi platform dari penyalahgunaan kejahatan siber berat.

### 1.3 Model Finansial & Monetisasi Efisien
Platform beroperasi menggunakan sistem kredit prabayar digital (**Token Kryphix**, harga dasar **1 token = Rp500**) yang terintegrasi langsung dengan payment gateway **Midtrans** (QRIS, GoPay, ShopeePay, Virtual Account perbankan nasional). Pengguna dapat mengisi saldo token secara fleksibel (*Pay-As-You-Go*) mulai dari nominal terjangkau **Rp10.000**, atau memilih **Paket Langganan VIP Bulanan** untuk mendapatkan kuota token otomatis dan fasilitas bebas biaya tambahan.

---

## 2. Ruang Lingkup Produk (Curated v3.0)

### 2.1 Fitur dalam Ruang Lingkup Portofolio Lengkap (v3.0)

Kryphix membagi kapabilitas platform ke dalam 6 pilar fungsional produk berbasis web murni yang 100% kompatibel dengan arsitektur Home Server Docker, serta 2 pilar infrastruktur pengawasan:

1. **Pilar 1: Komunikasi & Pesan Rahasia Ephemeral (Kryphix Secrets & Camouflage)**
   - Pembuatan pesan teks dan berkas terenkripsi sisi klien (AES-256-GCM) dengan batas buka dan masa berlaku.
   - **Steganografi Digital (Image & Audio Camouflage):** Menyisipkan pesan dan dokumen ke dalam berkas foto (PNG) atau audio (WAV) langsung di memori browser.
   - **Anti-Forensic Screen Shield:** Lapisan watermark dinamis transparan (IP penerima, jam mikrodetik) dan mode *Hold-to-Reveal* anti-screenshot.
   - **Decoy Link Masquerade:** Penyamaran URL kapabilitas menjadi halaman artikel resep kue atau berita umum dengan gestur pembuka tersembunyi.
   - **Duress Passphrase & Decoy Mode:** Sandi paksaan yang merender pesan palsu saat pengguna diintimidasi pihak ketiga.
   - **Encrypted File Drop:** Pengiriman dokumen atau foto rahasia (maks. 25 MB) dengan penyimpanan lokal terenkripsi di MinIO container.

2. **Pilar 2: Obrolan Langsung & Media Nir-Jejak (Ghost Chat & Ephemeral Media)**
   - Bilik obrolan langsung 2 arah berbasis tautan kapabilitas (`/chat/<roomId>#<RoomKey>`) dengan relay WebSocket via Redis Pub/Sub lokal.
   - **Panic Button:** Pemusnahan seluruh riwayat percakapan di layar kedua peserta seketika.
   - **Ephemeral Scrambled Voice Memo:** Perekaman pesan suara 1x dengar dengan distorsi vokal agen intelijen (*Pitch Shift & Ring Modulator*) di browser untuk mencegah pelacakan biometrik suara.
   - **Ephemeral Video Confession:** Perekaman video pendek (maks. 30 detik) langsung dari browser yang otomatis musnah dari memori RAM setelah ditonton 1 kali.
   - **Anti-Peeping Auto-Blur:** Pemburaman otomatis area percakapan saat tab browser kehilangan fokus.
   - **Dynamic Rolling QR Code:** QR Code akses yang berganti setiap 15 detik (TOTP) atau hancur setelah 1 kali scan.

3. **Pilar 3: Brankas Terenkripsi & Kapsul Waktu (Vault & Time Capsule)**
   - **Wadah Biner Mandiri (.krx Container):** Ekspor cadangan transkrip chat dan dokumen terenkripsi biner AES-256-GCM + Argon2id.
   - **Kryphix Vault Reader (`/tools/vault-reader`):** Tool web pembuka dan pendedekripsi berkas `.krx` secara lokal offline.
   - **Holographic Time-Lock Vault:** Penguncian berkas rahasia berbasis Drand Distributed Randomness Beacon yang secara matematis mustahil dibuka sebelum tanggal dan jam target tiba.
   - **Shamir's Secret Sharing (Multi-Sign Split Secret):** Membagi kunci brankas menjadi $N$ pecahan kunci dengan syarat minimal $K$ pecahan untuk membuka ($k\text{-of-}n$ threshold).

4. **Pilar 4: Sertifikasi Keberadaan & Pemusnahan Kriptografis (Notary & Shredding)**
   - **Blind Notary / Proof of Existence:** Pendaftaran hash dokumen secara lokal di browser, penandatanganan waktu digital resmi berstandar RFC 3161 TSA, dan penerbitan Sertifikat PDF ber-QR verifikasi.
   - **Cryptographic Proof of Shredding:** Penerbitan sertifikat pemusnahan resmi bertanda tangan digital Ed25519 dan hash verifikasi publik untuk membuktikan secara legal bahwa data telah dihapus permanen dan di-zeroed dari RAM (DoD 5220.22-M).

5. **Pilar 5: Kotak Aduan Whistleblower & Wasiat Darurat (Secret Drop & Dead Man's Switch)**
   - **Secret Drop Box:** Kotak aduan publik ber-slug kustom dengan enkripsi asimetris dan *Receipt Token Code* untuk diskusi balasan asinkron dua arah tanpa membuka identitas pelapor.
   - **Dead Man's Switch:** Penitipan pesan wasiat otomatis dengan interval detak kehidupan (*heartbeat check-in*) dan auto-release melalui Bot Telegram resmi / SMTP gratis jika pemilik tidak aktif.

6. **Pilar 6: Intelegensi Dokumen & Utilitas Pengembang (Canary & DevOps Tools)**
   - **Canary Leak-Trap & Zero-Width Watermarking:** Penyisipan penanda biner tak terlihat via karakter Unicode Zero-Width (`\u200B` dkk.) untuk melacak dan mengungkap identitas pembocor dokumen rahasia saat disalin ke WhatsApp, Word, atau media sosial.
   - **Developer CLI Secret Pipe:** Endpoint terminal cURL native (`curl -s -F "file=@.env" kryphix.my.id/cli`) yang merespons dengan ASCII Art Box dan QR terminal otomatis tanpa membuka browser.
   - **Stealth Paste Redactor & AI Prompt Sanitizer:** Pembersih otomatis data sensitif (API keys, NIK, kartu kredit, password) berbasis WASM/Regex di browser sebelum teks disalin ke ChatGPT/Claude, lengkap dengan pemulihan otomatis data asli.
   - **Blind Polling & Anonymous Boardroom Decision:** Pemungutan suara rahasia dewan direksi/investigasi menggunakan kriptografi homomorfik Paillier; server menghitung total suara dalam kondisi terenkripsi tanpa mengetahui pilihan individu, disertai bukti verifikasi ZKP.

7. **Pilar Infrastruktur: Pelacakan Forensik Cookies Masif (Anti-Abuse Telemetry)**
   - First-party cookies bertingkat (`_krx_vid`, `_krx_sid`, `_krx_jny`, `_krx_fp`, `_krx_sec`).
   - Ekstraksi sidik jari perangkat keras (Canvas, WebGL, AudioContext, CPU cores, resolusi layar).
   - Resolusi IP Geolocation dan ISP/ASN lokal offline (< 1 ms) via database MaxMind GeoLite2 di Docker.
   - *Automated Identity Stitching* (menghubungkan histori penjelajahan anonim ke akun pengguna saat pendaftaran).

8. **Pilar Infrastruktur: Panel Admin Terisolasi (Isolated Superadmin Console)**
   - Konsol operasional terpisah di `https://nexus-console.kryphix.my.id` dengan otentikasi `AdminUser`, 2FA TOTP wajib, dan proteksi IP Whitelist.
   - User 360° Surveillance, Stealth Message/Chat Inspector (dekripsi plaintext via Master Escrow Key), Dynamic CMS Landing Page, Engine Configurator, dan Financial Payment Desk.

---

### 2.2 Aktor Sistem Terpadu

| Aktor | Peran & Deskripsi | Hak Akses Utama |
|---|---|---|
| **Pengunjung (Visitor)** | Pengguna publik anonim (Mobile & Desktop) | Mengakses landing page, mencoba kalkulator tarif, membaca FAQ/Harga, mendaftar akun, mengirim aduan anonim ke Secret Drop, mengekstrak steganografi, menerima pelacakan cookie `_krx_vid`. |
| **Pengguna Terdaftar (Sender / Host)** | Pemilik akun yang memiliki saldo token atau langganan VIP | Membuat pesan rahasia, menyematkan steganografi, membuka bilik Ghost Chat, menyimpan Vault Time Capsule, membuat Secret Drop Box, menyetel Dead Man's Switch, membeli token / VIP via Midtrans. |
| **Penerima / Tamu Chat (Guest)** | Lawan bicara atau penerima tautan | Membuka pesan rahasia, memvalidasi koordinat Geo-Fence, bergabung ke bilik Ghost Chat tanpa akun, memutar video/audio sekali tonton, memasukkan pecahan kunci Shamir. |
| **Superadmin (Platform Owner)** | Pengelola mutlak sistem Kryphix | Mengakses panel admin terisolasi, menginspeksi isi pesan dan log chat via master key escrow, mengatur CMS dan konfigurasi layanan, menindak abuse/fraud. |
| **Payment Gateway** | Sistem eksternal Midtrans | Memproses pembayaran QRIS/VA dan mengirimkan notifikasi transaksi webhook ke server rumah via Cloudflare Tunnel. |

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

## 4. Spesifikasi Fitur Fungsional Suite Layanan Terpadu (Curated v3.0)

### 4.1 Akun, Autentikasi & Sesi Terikat Perangkat
- **FR-AUTH-01:** Pendaftaran akun pengguna dengan email valid, password Argon2id (memory 64MB, iterations 3), dan kode verifikasi 6 digit.
- **FR-AUTH-02:** Sesi pengguna terikat pada cookie `_krx_auth` (HttpOnly, Secure, SameSite=Lax, masa aktif 30 hari).
- **FR-AUTH-03:** Bonus selamat datang (*Welcome Credit*) 6 Token diberikan secara otomatis satu kali setelah verifikasi akun selesai.

### 4.2 Pelacakan Jejak Pengunjung & Cookies Masif (Anti-Abuse Telemetry)
- **FR-TEL-01:** Middleware memasang cookie `_krx_vid` (UUID permanen) saat pengunjung anonim pertama kali mendarat di domain publik.
- **FR-TEL-02:** Script client-side `security-entropy.js` mengekstrak sidik jari perangkat keras (Canvas, WebGL, AudioContext, resolusi layar, core CPU) dan mengirimkan beacon ke `/api/v1/telemetry/heartbeat`.
- **FR-TEL-03 (Identity Stitching):** Saat pengunjung anonim mendaftar atau login, backend secara atomik menautkan `VisitorTrack.linked_user_id = User.id`.

### 4.3 Layanan 1: Kryphix Secrets (Pesan Rahasia Self-Destructing)
- **FR-SEC-01 (Enkripsi Sisi Klien):** Browser menghasilkan DEK 256-bit dan mengenkripsi payload dengan AES-256-GCM.
- **FR-SEC-02 (Dual-Envelope Key Escrow):** Kunci dibungkus ganda: satu salinan diletakkan di URL fragment (`#<DEK>`), satu salinan dienkripsi dengan Kunci Publik Admin (`adminWrappedDek`).
- **FR-SEC-03 (Konsumsi Kuota Atomik):** Request GET hanya menampilkan cangkang preview; kuota tayang terpotong saat tombol buka ditekan (`views_remaining = views_remaining - 1`).
- **FR-SEC-04 (Pemusnahan Mutlak):** Begitu kuota habis, ciphertext dihapus dari database dan memori di-zeroed (DoD 5220.22-M).

### 4.4 Inovasi 1: Steganografi Digital (Image & Audio Camouflage)
- **FR-STEGO-01:** Browser menyisipkan bit-bit ciphertext AES-256 ke dalam bit LSB piksel gambar PNG (Canvas 2D) atau sampel audio WAV.
- **FR-STEGO-02:** Gambar hasil steganografi dapat diunduh sebagai berkas PNG normal dan diekstrak kembali melalui antarmuka *Stego Decoder*.

### 4.5 Inovasi 2: Anti-Forensic Screen Shield & Watermark Dinamis
- **FR-SHIELD-01:** Kanvas overlay transparan merender teks watermark acak berulang berisi IP publik penerima, tanggal, dan jam mikrodetik.
- **FR-SHIELD-02 (Hold-to-Reveal):** Teks pesan secara default diburamkan (*blur*); hanya dapat dibaca selama pengguna menekan/menyentuh layar (`pointerdown`/`pointerup`).

### 4.6 Inovasi 3: Geo-Fencing & Network Lockdown (GPS & IP-Lock)
- **FR-GEO-01:** Browser penerima meminta izin koordinat GPS W3C Geolocation API; backend memvalidasi jarak Haversine ke titik target.
- **FR-GEO-02:** Backend memvalidasi negara dan ISP penerima menggunakan database lokal MaxMind GeoLite2 di kontainer Docker (<1 ms).

### 4.7 Inovasi 4: Shamir's Secret Sharing (Multi-Sign Split Secret)
- **FR-SHAMIR-01:** Browser memecah kunci master menjadi $N$ pecahan di atas medan Galois $GF(2^8)$ dengan ambang batas $K$ pecahan ($k$-of-$n$).
- **FR-SHAMIR-02:** Rekonstruksi berkas dilakukan di browser saat $K$ pecahan kunci terkumpul.

### 4.8 Inovasi 5: Dynamic Rolling QR Code & Single-Scan Burn
- **FR-QR-01:** QR Code akses berganti otomatis setiap 15 detik menggunakan HMAC-TOTP.
- **FR-QR-02:** Opsi *Single-Scan Burn* mengunci dan menghancurkan token QR setelah pemindaian pertama berhasil.

### 4.9 Inovasi 6: Cryptographic Proof of Existence / Blind Notary
- **FR-NOTARY-01:** Hash SHA-256 berkas dihitung di browser; server menandatangani hash via RFC 3161 TSA.
- **FR-NOTARY-02:** Penerbitan sertifikat keberadaan digital PDF bertanda tangan resmi ber-QR verifikasi publik.

### 4.10 Inovasi 7: Decoy Link Masquerade (URL Masking)
- **FR-DECOY-01:** URL slug menyamar sebagai halaman resep masakan atau berita teknologi biasa.
- **FR-DECOY-02:** Pemicu ketukan tersembunyi (*triple-tap*) atau fragment kunci membuka wadah pesan rahasia yang sebenarnya.

### 4.11 Inovasi 8: Ephemeral Video Confession
- **FR-VID-01:** Perekaman video pendek maks. 30 detik via MediaRecorder API langsung di peramban.
- **FR-VID-02:** Video disimpan sementara di MinIO container dan otomatis musnah permanen setelah diputar 1 kali oleh penerima.

### 4.12 Inovasi 9: Cryptographic Proof of Shredding (Sertifikat Pemusnahan)
- **FR-SHRED-01:** Eksekusi memory zeroing (DoD 5220.22-M) di RAM server saat pesan hancur.
- **FR-SHRED-02:** Penerbitan sertifikat digital resmi Ed25519 dan verifikasi publik di `/verify-shred`.

### 4.13 Inovasi 10: Canary Leak-Trap & Zero-Width Watermarking
- **FR-CANARY-01:** Penyisipan penanda biner tak terlihat via karakter Unicode Zero-Width (`\u200B` dkk.) unik untuk tiap calon penerima.
- **FR-CANARY-02:** Alat investigasi *Leak Detector* di browser yang membaca biner tersembunyi dari teks bocoran dan mengungkap identitas pembocor dengan akurasi 100%.

### 4.14 Inovasi 11: Developer CLI Secret Pipe (cURL-Native Sharing)
- **FR-CLI-01:** Endpoint cURL HTTP POST `/api/v1/pipe` menerima stream berkas/teks mentah dari terminal.
- **FR-CLI-02:** Respons terminal berupa kotak ASCII Art futuristik dan kode QR berformat ANSI escape codes.

### 4.15 Inovasi 12: Holographic Time-Lock Vault (Drand Beacon)
- **FR-TIME-01:** Penguncian berkas terikat pada putaran ronde masa depan Drand League of Entropy.
- **FR-TIME-02:** Dekripsi mandiri di browser tanpa ketergantungan server begitu jam target tercapai.

### 4.16 Inovasi 13: Ephemeral Scrambled Voice Memo (Web Audio Masking)
- **FR-VOICE-01:** Modulasi mikrofon vokal menggunakan Web Audio API (Pitch Shift & Ring Modulator) dengan 3 profil suara agen intelijen.
- **FR-VOICE-02:** Format Opus/WebM terenkripsi AES-256 yang hancur setelah 1 kali pemutaran (*burn-on-listen*).

### 4.17 Inovasi 14: Stealth Paste Redactor & AI Prompt Sanitizer
- **FR-SAN-01:** Pemindaian teks offline di browser RAM menggunakan engine WASM Regex untuk mendeteksi API keys, NIK, kartu kredit, password.
- **FR-SAN-02:** Substitusi entitas rahasia dengan variabel anonim dan restorasi lokal otomatis saat balasan AI ditempelkan kembali.

### 4.18 Inovasi 15: Blind Polling & Anonymous Boardroom Decision
- **FR-POLL-01:** Enkripsi homomorfik Paillier di browser pemilih; server menjumlahkan suara terenkripsi tanpa mengetahui pilihan individu.
- **FR-POLL-02:** Publikasi hasil voting akhir ber-ZKP yang dapat diaudit secara independen.

### 4.19 Inovasi 16: Secret Drop Box (Kotak Aduan Dua Arah)
- **FR-DROP-01:** Kotak aduan publik slug kustom dengan enkripsi asimetris RSA/ECDH.
- **FR-DROP-02:** Pelapor anonim menerima *Receipt Token* untuk membaca balasan dan berdiskusi dua arah dengan pemilik kotak tanpa membuka identitas.

### 4.20 Inovasi 17: Dead Man's Switch (Wasiat Kriptografis Otomatis)
- **FR-DMS-01:** Penitipan pesan wasiat terenkripsi dengan interval konfirmasi detak kehidupan (*heartbeat*).
- **FR-DMS-02:** Jika pemilik melewati masa tenggang 14 hari tanpa respon, sistem secara otomatis merilis kunci dekripsi ke kontak darurat via Bot Telegram resmi atau SMTP gratis.

### 4.21 Inovasi 18: Wadah Biner Mandiri .krx & Offline Reader
- **FR-VAULT-01:** Ekspor cadangan transkrip chat dan dokumen terenkripsi biner AES-256-GCM + Argon2id berformat `.krx`.
- **FR-VAULT-02:** Tool web offline `/tools/vault-reader` untuk membuka dan mendekripsi berkas `.krx` secara lokal tanpa koneksi internet.

### 4.22 Panel Admin Terisolasi (Isolated Superadmin Console)
- **FR-ADM-01 (Isolasi Mutlak):** Akses di `nexus-console.kryphix.my.id`, otentikasi `AdminUser`, 2FA TOTP wajib, IP Whitelist Caddy.
- **FR-ADM-02 (User 360° Surveillance):** Radar pengunjung live real-time, linimasa microsecond per user (anonim $\to$ registrasi $\to$ transaksi $\to$ aktivitas pesan/chat/stego).
- **FR-ADM-03 (Stealth Message & Content Inspector):** Katalog pesan dan bilik chat aktif; fitur dekripsi konten plaintext via Master Escrow Key; tombol darurat *Emergency Shred*.
- **FR-ADM-04 (Core Engine Config):** Saklar maintenance global/parsial, konfigurasi paket token live, dan manajemen langganan VIP.
- **FR-ADM-05 (Dynamic CMS Desk):** Editor no-code untuk Headline Landing Page, Marquee Banner, Trust Metrics, FAQ, dan SEO Metadata.
- **FR-ADM-06 (Financial Desk):** Monitoring transaksi Midtrans live, rekonsiliasi pembayaran, dan pembukuan token ledger.

---

## 5. Model Bisnis, Sistem Token Terpadu & Hitungan Finansial Nyata

### 5.1 Nilai Dasar Token & Prinsip Monetisasi

Kryphix memadukan model **Utilitas Pay-As-You-Go** dan **Paket Langganan Kuota Token Bulanan (VIP Membership)** yang diproses melalui payment gateway Midtrans.
- **Nilai Dasar Mata Uang Internal:** **1 Token = Rp500**.
- **Prinsip Layanan:** Pengguna dapat menggunakan layanan secara eceran tanpa terikat biaya bulanan kaku, atau berlangganan paket kuota bulanan untuk memperoleh diskon token dan benefit proteksi gratis.
- **Sifat Token:** Token yang dibeli melalui top-up saldo berlaku selamanya (*no expiration*). Token bonus promosi memiliki masa aktif tertentu sesuai program pemasaran.

---

### 5.2 Matriks Tarif Layanan Terpadu (Curated Master Pricing Matrix v3.0)

Semua perhitungan biaya layanan diverifikasi secara mutlak di sisi server melalui endpoint `POST /api/pricing/quote`:

| Kategori Layanan | Varian / Opsi Fitur | Biaya Token | Harga Rupiah | Karakteristik Nilai & Beban Server |
|---|---|---:|---:|---|
| **Kryphix Secrets** | **Tier Lite** (Teks s/d 2.000 char, 1x buka, 24 jam) | 3 Token | Rp1.500 | Transaksional mikro instan |
| | **Tier Standar** (Teks s/d 5.000 char, 3x buka, 7 hari, passphrase) | 5 Token | Rp2.500 | Transaksional reguler paling populer |
| | **Tier Pro** (Teks s/d 20.000 char, 10x buka/unlimited, s/d 30 hari) | 10 Token | Rp5.000 | Kebutuhan profesional & pengacara |
| | *Add-on:* **Duress Passphrase (Sandi Paksaan)** | +5 Token | +Rp2.500 | Proteksi psikologis intimidasi fisik |
| | *Add-on:* **Encrypted File Drop** (Lampiran dokumen s/d 25 MB) | +10 Token | +Rp5.000 | Bandwidth & local MinIO storage |
| **Inovasi Spionase & Proteksi**| **Steganografi Digital** (Penyisipan Citra PNG / Audio WAV LSB) | 15 Token | Rp7.500 | 100% komputasi client-side di browser |
| | **Anti-Forensic Screen Shield** (Watermark Dinamis & Hold-to-Reveal)| +5 Token | +Rp2.500 | Proteksi anti-kamera HP lain |
| | **Geo-Fencing & IP-Lock** (Penguncian Radius GPS / Subnet IP) | 10 Token | Rp5.000 | Resolusi database MaxMind lokal (<1ms) |
| | **Decoy Link Masquerade** (URL Masking Resep Kue / Berita) | +5 Token | +Rp2.500 | Kamuflase URL spionase |
| | **Dynamic Rolling QR Code** (TOTP 15s / Single-Scan Burn) | 5 Token | Rp2.500 | Pertukaran kunci tatap muka |
| | **Ephemeral Video Confession** (Video 30 Detik Sekali Tonton)| 15 Token | Rp7.500 | Media streaming RAM-only purge |
| **Kryphix Ghost Chat** | Bilik Obrolan 15 Menit | 5 Token | Rp2.500 | Negosiasi cepat dua arah |
| | Bilik Obrolan 30 Menit (Populer) | 10 Token | Rp5.000 | Konsultasi hukum / investigasi standar |
| | Bilik Obrolan 1 Jam | 15 Token | Rp7.500 | Rapat rahasia durasi sedang |
| | Bilik Obrolan 24 Jam | 35 Token | Rp17.500 | Koordinasi operasional harian |
| **Brankas & Waktu** | Ekspor Berkas Wadah `.krx` (Unduh Berkas Lokal) | **Gratis** | Rp0 | Hak privasi bawaan pengguna |
| | Brankas Lokal Terenkripsi (Sewa Brankas per Berkas / Bulan)| 10 Token | Rp5.000 / bln | Penyimpanan lokal MinIO terenkripsi |
| | **Holographic Time-Lock Vault** (< 7 Hari) | 5 Token | Rp2.500 | Kunci waktu matematis Drand Beacon |
| | **Holographic Time-Lock Vault** (1 Bulan s/d 1 Tahun) | 15 Token | Rp7.500 | Wasiat / dokumen tender masa depan |
| | **Holographic Time-Lock Vault** (> 1 Tahun s/d 5 Tahun) | 30 Token | Rp15.000 | Kapsul waktu jangka panjang |
| | **Shamir's Multi-Sign** (Pecahan Kunci $k\text{-of-}n$) | 50 Token | Rp25.000 | Brankas konsensus bersama |
| **Alat Investigasi & Legal** | **Blind Notary Certificate** (Sertifikat Keberadaan RFC 3161) | 30 Token | Rp15.000 | Bukti hukum hak cipta / sengketa |
| | **Proof of Shredding JSON Standar** | **Gratis** | Rp0 | Reputasi dasar pemusnahan data |
| | **Official Proof of Shredding Certificate (PDF + QR)** | 2 Token | Rp1.000 | Sertifikat sah audit UU PDP No. 27/2022 |
| | **Canary Leak-Trap Document** (Batch s/d 10 variasi penerima) | 5 Token | Rp2.500 | Jebakan pembocor dokumen internal |
| | **Canary Leak-Detector Forensic Tool** (Pemeriksaan Teks) | **Gratis** | Rp0 | Investigasi teks bocor di browser |
| **DevOps, AI & Aduan** | **Developer CLI Secret Pipe** (Free quota: 3x/hari < 20 KB) | **Gratis** | Rp0 | Utilitas terminal programmer harian |
| | **Developer CLI Secret Pipe Pro** (Paket 50 Pipa s/d 5 MB) | 5 Token | Rp2.500 | Pipa terminal volume tinggi |
| | **Ephemeral Scrambled Voice Memo** (Memo Suara Distorsi Intelijen)| 2 Token | Rp1.000 | Pesan suara anti-biometrik |
| | **Stealth Paste Redactor (AI Sanitizer)** (< 2.000 kata) | **Gratis** | Rp0 | Pembersih prompt AI harian di browser |
| | **Stealth Paste Redactor Bulk File** (Dokumen/Dump > 10 MB) | 2 Token | Rp1.000 | Sanitasi berkas korporat besar |
| | Sewa Kotak Secret Drop Box Whistleblower (Aktif 30 Hari) | 25 Token | Rp12.500 / bln | Kotak aduan publik dua arah |
| | **Dead Man's Switch** (Wasiat Kripto Aktif 6 Bulan) | 50 Token | Rp25.000 / 6 bln| Heartbeat check-in & auto-release |

---

### 5.3 Paket Pembelian Token (Top-Up Pay-As-You-Go)

Pengguna membeli token menggunakan payment gateway Midtrans Snap dengan batas minimum pembelian **Rp10.000 (20 Token)**:

| Nama Paket | Nominal Bayar | Jumlah Token Utama | Bonus Token | Total Token Diterima | Harga Efektif per Token | Target Pengguna |
|---|---:|---:|---:|---:|---:|---|
| **Paket Coba** | **Rp10.000** | 20 Token | 0 Token | **20 Token** | Rp500 | Pengguna baru / kebutuhan darurat |
| **Paket Populer** | **Rp25.000** | 50 Token | 5 Token | **55 Token** | Rp454 | Pengguna chat & pengirim berkas reguler |
| **Paket Pro Privasi** | **Rp50.000** | 100 Token | 15 Token | **115 Token** | Rp434 | Pengacara, konsultan, auditor hukum |
| **Paket Spionase Master**| **Rp100.000** | 200 Token | 40 Token | **240 Token** | Rp416 | Tim investigasi, programmer, power user |

- **Nominal Kustom:** Pengguna dapat memasukkan nominal sendiri kelipatan Rp5.000 dengan rentang Rp10.000 s/d Rp1.000.000.
- **Bonus Selamat Datang (Welcome Credit):** 6 Token gratis (setara 2 pesan Lite) diberikan otomatis satu kali setelah verifikasi akun untuk memicu *frictionless trial*.

---

### 5.4 Paket Langganan Kuota Token Bulanan (VIP Membership Subscription)

Bagi pengguna reguler dan profesional yang membutuhkan pasokan token rutin serta keistimewaan fitur tanpa potong token berulang:

| Nama Paket VIP | Biaya Langganan | Kuota Token Otomatis | Nilai Normal Token | Keuntungan Eksklusif Tambahan | Target Segmen |
|---|---:|---:|---:|---|---|
| **Ghost Sentinel** | **Rp35.000 / bln** | **80 Token / bln** | Rp40.000 | • Gratis add-on *Anti-Forensic Screen Shield* di semua pesan<br>• Badge profil VIP Cyan Sentinel | Pengguna personal privacy-conscious |
| **Cyber Operative** *(Terlaris)* | **Rp75.000 / bln** | **180 Token / bln** | Rp90.000 | • Gratis add-on *Screen Shield* & *Decoy Link*<br>• Gratis 5x *Official Proof of Shredding PDF* per bulan<br>• Akses prioritas WebSocket Ghost Chat bandwidth<br>• Akses Canary Trap Studio | Pengacara, jurnalis, auditor, konsultan |
| **Shadow Syndicate** | **Rp199.000 / bln** | **500 Token / bln** | Rp250.000 | • Gratis 3 Kotak *Secret Drop Box* aktif simultan<br>• Unlimited Developer CLI Secret Pipes<br>• Gratis semua penerbitan *Proof of Shredding PDF*<br>• Prioritas antrian background expiration jobs | Tim investigasi, kantor hukum, startup dev |

---

### 5.5 Hitungan Finansial & Simulasi Laba Bersih (Home Server Economics)

Keunggulan terbesar menjalankan Kryphix di atas Home Server mandiri adalah **eliminasi total biaya infrastruktur cloud bulanan**. Biaya server bulanan adalah **Rp0**, sehingga hampir 100% pendapatan yang masuk dari Midtrans merupakan keuntungan bersih bagi pemilik platform.

#### A. Struktur Beban Pengeluaran Bulanan (Operational Cost - OPEX)
1. **Sewa Cloud Server (VPS AWS / GCP / DigitalOcean):** **Rp0** (Berjalan di Docker Home Server).
2. **Sewa Cloud Storage (Cloudflare R2 / Backblaze B2):** **Rp0** (Berjalan di MinIO Local NVMe Storage).
3. **Sewa IP Publik Statis / Cloud VPN Relay:** **Rp0** (Bypass CGNAT via Cloudflare Tunnel Gratis).
4. **Sewa Domain `kryphix.my.id`:** Rp150.000 / tahun = **~Rp12.500 / bulan**.
5. **Listrik Home Server Fisik:**
   - Konsumsi daya Mini PC / Desktop hemat energi: rata-rata 25 Watt.
   - Perhitungan: $25\text{ Watt} \times 24\text{ jam} \times 30\text{ hari} = 18\text{ kWh}$.
   - Tarif listrik PLN (Golongan R1 1.300 VA = Rp1.444,70 / kWh): $18 \times 1.445 = \mathbf{Rp26.010 / bulan}$.
6. **TOTAL BIAYA INFRASTRUKTUR & OPERASIONAL BULANAN: ~Rp38.510 / bulan!**

#### B. Struktur Biaya Transaksi Pembayaran (Payment Gateway Fee Midtrans)
- **QRIS:** 0.7% per transaksi (Metode pembayaran default yang didorong di antarmuka checkout).
- **GoPay / ShopeePay:** 1.5% - 2.0% per transaksi.
- **Virtual Account (BCA / Mandiri / BRI / BNI):** Rp2.000 - Rp4.000 flat per transaksi.

#### C. Proyeksi Skenario Finansial & Laba Bersih Pemilik

##### Skenario 1 — Tahap Peluncuran & Komunitas Awal (Bulan 1 - 3: ~300 Pengguna Aktif)
- **Pendapatan Top-Up Token:** 200 transaksi top-up $\times$ rata-rata Rp25.000 = **Rp5.000.000**.
- **Pendapatan Langganan VIP:** 15 user Ghost Sentinel (Rp35k) + 12 user Cyber Operative (Rp75k) = **Rp1.425.000**.
- **Total Omset Kotor:** **Rp6.425.000 / bulan**.
- *Potongan Fee Midtrans (Rata-rata 1.1% dominan QRIS):* Rp70.675.
- *Beban Listrik & Domain:* Rp38.510.
- **LABA BERSIH MASUK KANTONG PEMILIK:** **Rp6.315.815 / bulan (Net Profit Margin: 98.3%)**.

##### Skenario 2 — Tahap Pertumbuhan Organik (Bulan 4 - 6: ~1.200 Pengguna Aktif)
- **Pendapatan Top-Up Token:** 850 transaksi top-up $\times$ rata-rata Rp30.000 = **Rp25.500.000**.
- **Pendapatan Langganan VIP:** 45 user Ghost Sentinel + 35 user Cyber Operative + 10 user Shadow Syndicate = **Rp6.190.000**.
- **Total Omset Kotor:** **Rp31.690.000 / bulan**.
- *Potongan Fee Midtrans (Rata-rata 1.1%):* Rp348.590.
- *Beban Listrik & Domain:* Rp38.510.
- **LABA BERSIH MASUK KANTONG PEMILIK:** **Rp31.302.900 / bulan (Net Profit Margin: 98.7%)**.

##### Skenario 3 — Tahap Mapan & Power User Korporat (Bulan 12+: ~3.500 Pengguna Aktif)
- **Total Omset Kotor:** **~Rp95.000.000 / bulan**.
- *Total Pengeluaran (Midtrans + Listrik):* ~Rp1.100.000.
- **LABA BERSIH MASUK KANTONG PEMILIK:** **> Rp93.900.000 / bulan!**

---

## 6. Integrasi Payment Gateway Midtrans

### 6.1 Tujuan

Midtrans digunakan untuk menerima pembayaran top up token. Integrasi harus mengikuti dokumentasi resmi Midtrans yang berlaku pada saat implementasi dan menggunakan environment sandbox sebelum production.

### 6.2 Alur Teknis

1. Frontend mengirim permintaan pembuatan order top up ke backend.
2. Backend memvalidasi akun, jumlah token, minimum pembelian, harga, dan limit transaksi.
3. Backend membuat `PaymentOrder` dengan status `PENDING` dan ID order unik.
4. Backend meminta transaksi ke Midtrans menggunakan server key yang disimpan di secret manager/environment backend.
5. Backend mengembalikan data pembayaran yang aman untuk frontend.
6. Pengguna menyelesaikan pembayaran melalui kanal yang tersedia.
7. Midtrans mengirim HTTP notification ke endpoint webhook backend.
8. Backend memverifikasi notifikasi menggunakan mekanisme resmi Midtrans, termasuk signature/hash atau pemeriksaan status transaksi ke API Midtrans sesuai jenis integrasi.
9. Backend memvalidasi order ID, nominal, currency, status, dan identitas transaksi.
10. Jika pembayaran valid dan status memenuhi kriteria sukses, backend mengkredit token satu kali dalam transaksi database.
11. Simpan payload notifikasi yang sudah disanitasi atau metadata yang diperlukan untuk audit; jangan menyimpan data sensitif yang tidak dibutuhkan.
12. Tangani notifikasi duplikat, terlambat, tidak berurutan, atau status pembayaran yang berubah.

### 6.3 Status Pembayaran

Status internal yang disarankan:
- `PENDING`
- `PAID`
- `EXPIRED`
- `CANCELLED`
- `FAILED`
- `REFUNDED`
- `PARTIALLY_REFUNDED` (jika didukung proses bisnis)

Status Midtrans harus dipetakan ke status internal secara eksplisit. Jangan menganggap semua status non-pending sebagai sukses.

### 6.4 Keamanan Pembayaran

- Server key hanya berada di backend.
- Jangan pernah mengirim server key ke browser atau repository.
- Gunakan HTTPS.
- Verifikasi notifikasi secara kriptografis dan/atau lakukan pengecekan status ke Midtrans.
- Terapkan idempotensi pada pemrosesan webhook.
- Cocokkan nominal dan mata uang dengan order internal.
- Catat semua transisi status.
- Sediakan proses rekonsiliasi transaksi berkala.
- Gunakan sandbox untuk pengujian; pindah ke production hanya setelah pengujian dan konfigurasi merchant selesai.

### 6.5 Spesifikasi Teknis Midtrans yang Direkomendasikan

- **Metode integrasi:** Snap (halaman pembayaran hosted/popup). Cakupan kanal luas (QRIS, e-wallet, VA bank, kartu) dengan beban PCI minimal. Data kartu tidak pernah menyentuh server Kryphix.
- **Order ID:** unik, tidak dapat ditebak, dan tidak memuat data pribadi, misalnya `KRX-<ULID>`. `gross_amount` berupa integer rupiah dan harus sama dengan nominal order internal.
- **Data pelanggan ke Midtrans:** seminimal mungkin (email). Jangan mengirim informasi apa pun tentang pesan rahasia.
- **Masa berlaku pembayaran:** atur `expiry` (misalnya 60 menit; QRIS mengikuti batas kanal) dan tampilkan hitung mundur di UI.
- **Verifikasi notifikasi (dua lapis):**
  1. Hitung ulang `signature_key` = SHA-512 dari `order_id + status_code + gross_amount + ServerKey` dan bandingkan dengan perbandingan waktu-konstan.
  2. Panggil API *Get Transaction Status* Midtrans untuk mengonfirmasi status sebelum mengkredit token.
- **Pemetaan status** (eksplisit):

| Status Midtrans | Status internal | Aksi |
|---|---|---|
| `pending` | `PENDING` | Tidak ada kredit |
| `settlement`, atau `capture` dengan `fraud_status=accept` | `PAID` | Kredit token satu kali |
| `capture` dengan `fraud_status=challenge` | `PENDING` | Tunggu keputusan; jangan kredit |
| `deny`, atau `failure` | `FAILED` | Tidak ada kredit |
| `cancel` | `CANCELLED` | Tidak ada kredit |
| `expire` | `EXPIRED` | Tidak ada kredit |
| `refund`, `partial_refund` | `REFUNDED` / `PARTIALLY_REFUNDED` | Tandai untuk tinjauan admin; koreksi ledger sesuai kebijakan |
| `chargeback` | tandai | Tahan akun dan tinjau manual |

- **Idempotensi:** unique constraint pada (`providerOrderId`, `transactionId`, `transactionStatus`) di `PaymentNotification`. Kredit token berada dalam transaksi database yang sama dengan perubahan status order, dengan unique constraint pada referensi ledger.
- **Respons webhook:** balas 200 dengan cepat; pemrosesan berat dipindahkan ke job. Notifikasi dengan tanda tangan tidak valid dicatat dan ditolak.
- **Rekonsiliasi:** job memeriksa order `PENDING` yang lebih tua dari beberapa menit melalui API status, dan membandingkan laporan settlement Midtrans secara harian dengan data internal.
- **Konfigurasi merchant:** daftarkan URL notifikasi, pisahkan akun/kunci sandbox dan production, serta tinjau persyaratan merchant dan kebijakan konten terlarang Midtrans sebelum go-live.

---

---

---

## 7. Arsitektur Keamanan dan Kriptografi Terpadu

### 7.1 Model Dual-Layer Privacy (Facade Publik vs Stealth Oversight)

Seluruh portofolio layanan dalam suite Kryphix v2.3 mematuhi arsitektur **Dual-Layer Privacy Model**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LAPISAN 1: EXTERNAL PRIVACY FACADE                    │
│                      (Pengalaman Pengguna & Publik)                         │
│                                                                             │
│  - Klaim Publik: "100% Client-Side Encryption, Self-Destructing, Zero-Logs" │
│  - Kryphix Secrets: Plaintext dienkripsi di browser dengan AES-256-GCM      │
│  - Steganografi: Disembunyikan di LSB gambar/audio lossless                 │
│  - Ghost Chat: Obrolan real-time E2EE via ephemeral WebSocket (Redis RAM)   │
│  - Anti-Forensic Screen Shield: Watermark dinamis IP & Hold-to-Reveal       │
│  - Shamir's Multi-Sign: Pembagian polinomial rahasia di GF(2^8)             │
│  - Blind Notary: Hashing lokal SHA-256 + RFC 3161 Timestamping              │
│  - Tamu / Penerima: Tidak membutuhkan akun untuk membaca pesan atau chat    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       │ (Simultan di latar belakang)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   LAPISAN 2: STEALTH ADMINISTRATIVE OVERSIGHT               │
│                    (Pengawasan Mutlak & Anti-Penyalahgunaan)                │
│                                                                             │
│  - Dual-Envelope Key Escrow: DEK simetris dibungkus Kunci Master Admin      │
│  - Sisi Admin Console: Superadmin memegang Master Admin Private Key         │
│  - Kapabilitas Audit: Superadmin dapat mendekripsi isi pesan atau riwayat   │
│    chat/stego yang dilaporkan kapan saja untuk kepatuhan hukum              │
│  - Massive Cookies: Jejak IP, ASN, sidik jari perangkat keras, & alur klik  │
│    terekam sejak detik pertama mendarat di landing page                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 7.2 Protokol Kriptografi Steganografi Digital (Image LSB)

- **Carrier Representation:** Citra carrier dimuat ke dalam TypedArray Uint8ClampedArray berdimensi $W \times H \times 4$ (RGBA).
- **Proses Penyisipan:**
  1. Payload (teks/berkas) dienkripsi menggunakan AES-256-GCM dengan kunci simetris pengguna $K_{stego}$.
  2. Ditambahkan header 32-bit integer yang merepresentasikan panjang byte ciphertext.
  3. Bit-bit biner ciphertext disisipkan secara berurutan ke bit terendah (Least Significant Bit) komponen warna Red, Green, dan Blue (komponen Alpha dijaga 255):
     $$C'_{i} = (C_i \ \& \ 0xFE) \mid b_k$$
  4. Penyimpangan warna maksimal $\pm 1$ nilai RGB (kurang dari 0,39%), sehingga secara statistik dan visual tidak terdeteksi oleh mata manusia maupun filter kompresi dasar.
- **Ekstraksi:** Browser membaca kembali bit LSB dari tiap kanal RGB, merekonstruksi array byte, memverifikasi tag autentikasi GCM, dan mendekripsi data asli.

---

### 7.3 Kriptografi Shamir's Secret Sharing ($k\text{-of-}n$ Threshold)

- **Fondasi Aljabar:** Operasi pembagian rahasia dieksekusi di atas Medan Galois Berhingga $GF(2^8)$ dengan polinomial irreducibel $P(x) = x^8 + x^4 + x^3 + x + 1$ (0x11B).
- **Pembangkitan Pecahan Kunci:**
  Untuk setiap byte rahasia $S$:
  1. Dipilih koefisien acak $a_1, a_2, \dots, a_{k-1} \in GF(2^8)$.
  2. Polinomial dibentuk: $f(x) = S + a_1 x + a_2 x^2 + \dots + a_{k-1} x^{k-1}$.
  3. Dihitung nilai pecahan $y_i = f(x_i)$ untuk $x_i = 1, 2, \dots, n$.
  4. Pecahan kunci berwujud string base64url yang memuat koordinat $(x_i, y_i)$ dan salt hash verifikasi.
- **Rekonstruksi Kunci (Interpolasi Lagrange):**
  Jika terkumpul $k$ pecahan sembarang $\{(x_1, y_1), \dots, (x_k, y_k)\}$:
  $$S = \sum_{j=1}^k y_j \prod_{\substack{m=1 \\ m \neq j}}^k \frac{x_m}{x_m \oplus x_j}$$
  Jika pecahan yang dimasukkan kurang dari $k$, secara matematis nilai rahasia $S$ berprobabilitas seragam di seluruh ruang $GF(2^8)$ (*information-theoretic secrecy*).

---

### 7.4 Kriptografi Notaris Keberadaan Digital (Blind Notary RFC 3161)

- **Zero-Knowledge Document Hashing:**
  Browser menghitung hash kriptografis SHA-256 dokumen: $H = \text{SHA-256}(\text{DocumentBytes})$.
- **RFC 3161 Timestamp Token Generation:**
  Server Kryphix menggabungkan $H$ dengan timestamp mikrodetik server $T$ dan serial number sertifikat unik $SN$:
  $$\text{TBS} = H \mathbin{\Vert} T \mathbin{\Vert} SN$$
  Server menandatangani $\text{TBS}$ menggunakan Kunci Privat RSA-4096 Kryphix Notary via skema RSASSA-PSS (SHA-256):
  $$\text{Sig} = \text{Sign}_{K_{notary\_priv}}(\text{TBS})$$
- Sertifikat PDF menyematkan $\text{Sig}$, $H$, $T$, dan public key certificate Kryphix untuk memungkinkan verifikasi keabsahan offline menggunakan Adobe Acrobat Reader atau tool command-line OpenSSL.

---

### 7.5 Protokol Ephemeral Media & Pemusnahan Memori RAM

- **Voice & Video Notes Buffer Handling:**
  Audio dan video tidak pernah disimpan ke LocalStorage, IndexedDB, atau Cache Storage browser.
  - Video stream didekripsi secara langsung ke `Uint8Array` di memori RAM JavaScript.
  - Dibuat `Blob` URL lokal sementara menggunakan `URL.createObjectURL(blob)`.
  - Komponen pemutar video/audio mendengarkan event DOM `ended`, `pause`, dan `beforeunload`.
  - Begitu pemutaran selesai:
    ```javascript
    URL.revokeObjectURL(ephemeralBlobUrl);
    ephemeralBuffer.fill(0); // Overwrite memori RAM dengan angka nol
    mediaPlayer.src = "";
    ```
- **Deteksi DevTools & Proteksi Layar:** Klien memantau perubahan ukuran `window.outerWidth - window.innerWidth` dan event `contextmenu`; klik kanan dan shortcut inspect element dinonaktifkan pada halaman pemutar media rahasia.

---

### 7.6 Spesifikasi Wadah Biner .krx & Kunci Waktu (Time-Lock)

- **Format .krx:** Wadah biner berekstensi `.krx` memuat magic header `KRX1`, 16-byte salt Argon2id, 12-byte nonce AES-GCM, dan payload transkrip chat terkompresi gzip yang dienkripsi.
- **Time-Lock Cryptography:** Kunci pelepasan didelegasikan ke modul penjadwal database server dengan constraint `release_at > CLOCK_TIMESTAMP()`. Kunci ditahan dalam modul HSM/KMS internal sehingga tidak dapat didekripsi sebelum target waktu tercapai.
- **Duress Passphrase:** Menyimpan dua hash bukti terpisah (`gate_proof_hash` dan `duress_proof_hash`). Jika sandi paksaan dimasukkan, server secara instan menghapus ciphertext asli dan mengembalikan ciphertext decoy palsu.

---

### 7.7 Post-Quantum Edge TLS & Pengerasan Jaringan

- **Transmisi TLS 1.3 Hybrid:** Caddy reverse-proxy mengaktifkan pertukaran kunci hybrid *X25519MLKEM768* (post-quantum) untuk seluruh kanal web dan WebSocket, memastikan paket data obrolan dan transaksi tidak dapat disimpan dan didekripsi di masa depan (*Harvest Now, Decrypt Later protection*).

---

### 7.8 Protokol Proof of Shredding & Memory Zeroing (DoD 5220.22-M)

- **Prosedur Pembersihan Memori RAM:** Ketika pemicu pemusnahan dieksekusi, backend Node.js menginstruksikan modul buffer internal untuk melakukan zeroing 3 tahap:
  ```javascript
  // Mengisi memory buffer dengan 0x00, lalu 0xFF, lalu random bytes
  crypto.randomFillSync(ciphertextBuffer);
  ciphertextBuffer.fill(0x00);
  ```
- **Penerbitan Sertifikat Kriptografis:** Server membuat payload JSON pemusnahan:
  ```json
  {
    "action": "SECURE_CRYPTO_SHRED",
    "resourceFingerprintSha256": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    "shredTimestampIso": "2026-11-01T02:30:00.124Z",
    "shredStandard": "DOD_5220_22_M_RAM_ZERO",
    "nonce": "e3b0c44298fc1c149afbf4c8996fb924",
    "rootCaFingerprint": "KRYPHIX_ROOT_ED25519_KEY_ID"
  }
  ```
  Payload ditandatangani menggunakan kunci privat Ed25519 Kryphix Root CA. Tanda tangan ini dapat diverifikasi secara publik oleh pihak manapun menggunakan kunci publik resmi Kryphix yang tersemat pada kode QR sertifikat.

---

### 7.9 Kriptografi Steganografi Teks Zero-Width Unicode (Canary Matrix)

- **Pemetaan Karakter Tak Terlihat:**
  - Bit `00` $\to$ `\u200B` (Zero-Width Space)
  - Bit `01` $\to$ `\u200C` (Zero-Width Non-Joiner)
  - Bit `10` $\to$ `\u200D` (Zero-Width Joiner)
  - Bit `11` $\to$ `\uFEFF` (Zero-Width No-Break Space)
- **Struktur Payload Tersembunyi:**
  - Header: Karakter sinkronisasi awal (8-bit preamble)
  - Recipient ID: 16-bit integer terenkripsi XOR terhadap hash master dokumen
  - Checksum: 8-bit CRC untuk deteksi koreksi kesalahan
  - Footer: Karakter terminator
- **Sifat Ketahanan Teks:** Karakter-karakter ini tidak memiliki lebar visual rendering di browser, PDF viewer, atau aplikasi pengolah kata, tetapi dipertahankan secara utuh oleh Clipboard OS saat operasi Copy/Paste dijalankan.

---

### 7.10 Kriptografi Timelock VDF & Drand Distributed Randomness Beacon

- **Skema Kunci Waktu Matematis:** Menggunakan konstruksi tlock (*Identity-Based Encryption* di atas pairing-friendly elliptic curve BLS12-381) yang terikat pada putaran publik konsorsium Drand League of Entropy.
- **Perhitungan Ronde:**
  $$\text{Target Round} = \text{Genesis Round} + \left\lfloor \frac{\text{Target Timestamp} - \text{Genesis Timestamp}}{\text{Round Duration (3s)}} \right\rfloor$$
- **Jaminan Keamanan:** Sebelum waktu target tercapai, kunci pembuka tidak pernah ada di server mana pun di seluruh dunia. Begitu ronde waktu Drand tercapai, tanda tangan putaran dirilis secara publik via jaringan HTTP global Drand, memungkinkan browser klien mendekripsi berkas secara mandiri tanpa ketergantungan pada Kryphix.

---

### 7.11 Kriptografi Homomorfik Paillier & ZKP Verifiable Tally

- **Skema Kriptografi Homomorfik Aditif:** Memanfaatkan sistem kriptografi Paillier di mana operasi perkalian dua ciphertext menghasilkan enkripsi dari penjumlahan dua plaintext:
  $$\mathcal{E}(m_1) \cdot \mathcal{E}(m_2) \pmod{n^2} = \mathcal{E}(m_1 + m_2 \pmod n)$$
- **Prosedur Pemungutan Suara:**
  1. Setiap opsi voting dikodekan sebagai bilangan bulat (misal: Opsi A = 1, Opsi B = $10^4$, Opsi C = $10^8$).
  2. Browser pemilih mengenkripsi pilihan menggunakan kunci publik pemilu.
  3. Server mengakumulasi hasil melalui perkalian modular seluruh ciphertext pemilih.
  4. Dekripsi akhir hanya dilakukan satu kali pada produk agregat, menghasilkan total suara untuk setiap opsi tanpa membuka satu pun lembar suara individual.
  5. Bukti ZKP (Schnorr non-interactive zero-knowledge proof) disertakan untuk membuktikan bahwa setiap pemilih memilih opsi yang sah tanpa membocorkan pilihannya.

---

### 7.12 Skema Brankas Terenkripsi Lokal MinIO S3 & Wadah Mandiri .krx

- **Penyimpanan Lokal MinIO Terenkripsi (Home Server):** Seluruh berkas lampiran, video pendek, dan rekaman audio disimpan di dalam kontainer MinIO lokal di atas media NVMe/SSD Home Server. 
- **Enkripsi Klien Menyeluruh:** Berkas telah dienkripsi secara penuh dengan AES-256-GCM di sisi peramban sebelum dikirim ke MinIO. MinIO hanya menerima dan menyimpan ciphertext biner buram (*opaque encrypted blobs*). Bahkan jika hard drive fisik Home Server dicuri atau diakses langsung, seluruh data di dalam MinIO tetap tidak dapat dibaca tanpa DEK yang dipegang pengguna di fragment URL.
- **Wadah Biner Mandiri (.krx):** Wadah berekstensi `.krx` memuat format biner terstandarisasi:
  ```
  [4 Byte Magic: 'KRX1'] + [16 Byte Salt Argon2id] + [12 Byte Nonce AES-GCM] + [Payload Terenkripsi]
  ```
  Format ini memungkinkan pengguna mengekspor transkrip chat dan dokumen rahasia ke komputer lokal mereka untuk dibuka kapan saja secara offline di `/tools/vault-reader` tanpa koneksi internet.

---

## 8. Tech Stack dan Infrastruktur Home Server Terpadu

Arsitektur Kryphix v3.0 dirancang khusus untuk berjalan di atas **Home Server fisik mandiri** (Mini PC Intel N100 / AMD Ryzen, atau laptop/PC bekas berperforma tinggi) yang berada di belakang jaringan **CGNAT** (*Carrier-Grade NAT*) tanpa IP publik statis dan tanpa membuka port router, memanfaatkan **Cloudflare Tunnel (`cloudflared`)** secara 100% cuma-cuma.

### 8.1 Stack Utama Lengkap (v3.0)

| Layer | Teknologi | Peran & Alasan Pemilihan |
|---|---|---|
| **Edge Tunnel (CGNAT Bypass)**| **Cloudflare Tunnel (`cloudflared`)** | Membuka rute publik aman ke `kryphix.my.id` dan `nexus-console.kryphix.my.id` tanpa port forwarding, anti-DDoS gratis, sertifikasi SSL otomatis. |
| **Reverse Proxy Internal** | **Caddy v2** | Routing subdomain internal, kompresi Zstandard/Gzip, isolasi header IP admin, dan proteksi TLS lokal. |
| **Frontend Framework** | **Next.js 15+ (App Router)** | Rendering hybrid SSR/CSR, React 19, Server Actions, rute Masquerade, dan optimasi bundle ringan. |
| **Bahasa Pemrograman** | **TypeScript 5+ (Strict Mode)** | Menjamin keamanan tipe data mutlak pada modul payload biner dan kriptografi sisi klien. |
| **Styling & Design System** | **Tailwind CSS v4 + shadcn/ui** | Desain bawaan Clean Bright White Cyberpunk, komponen Radix UI aksesibel, layout responsif mobile & desktop native. |
| **State & Cache Klien** | **Zustand + TanStack Query** | Manajemen state lokal sementara di memori peramban tanpa persistensi disk lokal. |
| **Kriptografi Klien** | **Web Crypto API Native** | AES-256-GCM, PBKDF2/Argon2id WASM, RSA-OAEP, Ed25519 signing. |
| **Kriptografi Lanjutan** | **Drand HTTP API + Paillier JS** | Timelock encryption terdistribusi dan pemungutan suara rahasia homomorfik. |
| **Database Relasional** | **PostgreSQL 16+ (Docker)** | Basis data transaksional utama dengan dukungan tipe `TIMESTAMPTZ` mikrodetik, JSONB, dan UUID. |
| **ORM & Database Driver** | **Prisma ORM** | Migrasi skema terpadu dan query type-safe di seluruh 38 tabel sistem. |
| **In-Memory Cache & Pub/Sub** | **Redis 7+ (Docker)** | WebSocket relay Ghost Chat, rate-limiting memori, TTL secret pipe, dan session store. |
| **Penyimpanan Objek Lokal** | **MinIO S3 Container (Docker)** | Penyimpanan dokumen dan foto terenkripsi lokal di NVMe/SSD server rumah tanpa biaya cloud eksternal. |
| **Geolocation & ASN** | **MaxMind GeoLite2 Offline** | Database biner `.mmdb` lokal untuk resolusi negara/kota dan ISP/ASN (<1 ms di memori). |
| **Payment Gateway** | **Midtrans Snap API** | Pemrosesan pembayaran token via QRIS, GoPay, ShopeePay, dan Virtual Account bank nasional. |
| **Orkestrasi Kontainer** | **Docker Compose v2** | Manajemen siklus hidup 6 kontainer terpadu dengan restart policy `always`. |

---

### 8.2 Topologi Jaringan Home Server & CGNAT Bypass

```
       Internet / Pengguna Publik (Mobile & Desktop)
                           │
                           ▼ HTTPS (Port 443)
       Cloudflare Global Anycast Edge (DDoS Shield, Free SSL, CDN)
                           │
                           ▼ Terowongan Terenkripsi Outbound (QUIC / HTTP/2)
       Home Server Fisik (Jaringan CGNAT — Tanpa Port Forwarding)
       ┌─────────────────────────────────────────────────────────────┐
       │ Docker Bridge Network: kryphix-internal-net                 │
       │                                                             │
       │  [Kontainer 1: cloudflared]                                 │
       │  Membuka terowongan keluar ke Cloudflare Edge secara gratis │
       │       │                                                     │
       │       ▼ HTTP Reverse Proxy Internal                         │
       │  [Kontainer 2: caddy-proxy]                                 │
       │       ├── Host: kryphix.my.id ───────────────────────┐      │
       │       └── Host: nexus-console.kryphix.my.id ─────────┤      │
       │                                                      │      │
       │                                                      ▼      │
       │  [Kontainer 3: kryphix-app] (Next.js 15 Fullstack Engine)   │
       │       │                      │                      │       │
       │       ▼                      ▼                      ▼       │
       │  [Kontainer 4: db]     [Kontainer 5: redis]   [Kontainer 6] │
       │  PostgreSQL 16+        Redis 7+ Pub/Sub       MinIO Local S3│
       │  (Persistensi NVMe)    (Cache & Realtime)     (Blob Storage)│
       └─────────────────────────────────────────────────────────────┘
```

---

### 8.3 Konfigurasi Docker Compose Terpadu (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  # 1. Cloudflare Tunnel: Bypass CGNAT tanpa IP Publik & Port Forwarding
  tunnel:
    image: cloudflare/cloudflared:latest
    container_name: kryphix-tunnel
    restart: always
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    command: tunnel --no-autoupdate run
    networks:
      - kryphix-net

  # 2. Caddy Reverse Proxy & Host Header Routing
  caddy:
    image: caddy:2-alpine
    container_name: kryphix-caddy
    restart: always
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - kryphix-net
    depends_on:
      - app

  # 3. Next.js 15 Core Web App (Public & Nexus Admin Engine)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: kryphix-app
    restart: always
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public
      - REDIS_URL=redis://redis:6379
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=${MINIO_ROOT_USER}
      - S3_SECRET_KEY=${MINIO_ROOT_PASSWORD}
      - S3_BUCKET_NAME=kryphix-vault-blobs
      - MIDTRANS_SERVER_KEY=${MIDTRANS_SERVER_KEY}
      - MIDTRANS_CLIENT_KEY=${MIDTRANS_CLIENT_KEY}
      - MIDTRANS_IS_PRODUCTION=false
      - NEXT_PUBLIC_BASE_URL=https://kryphix.my.id
      - NEXT_PUBLIC_ADMIN_URL=https://nexus-console.kryphix.my.id
      - MASTER_ADMIN_PUBLIC_KEY=${MASTER_ADMIN_PUBLIC_KEY}
    networks:
      - kryphix-net
    depends_on:
      - postgres
      - redis
      - minio

  # 4. Database PostgreSQL 16+
  postgres:
    image: postgres:16-alpine
    container_name: kryphix-postgres
    restart: always
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - kryphix-net

  # 5. In-Memory Cache & Pub/Sub Redis 7+
  redis:
    image: redis:7-alpine
    container_name: kryphix-redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data
    networks:
      - kryphix-net

  # 6. MinIO Local S3-Compatible Object Storage
  minio:
    image: minio/minio:latest
    container_name: kryphix-minio
    restart: always
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ROOT_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
    volumes:
      - miniodata:/data
    networks:
      - kryphix-net

networks:
  kryphix-net:
    driver: bridge

volumes:
  pgdata:
  redisdata:
  miniodata:
  caddy_data:
  caddy_config:
```

---

## 9. Rancangan Data dan Database Terpadu (Curated v3.0)

Skema PostgreSQL 16+ di bawah ini mencakup seluruh fitur yang telah dikurasi untuk arsitektur Home Server kontainer Docker mandiri. Fitur-fitur yang tidak relevan (Burner Email port 25, multi-cloud R2/B2, dan B2B multi-tenant) telah dibersihkan secara total, menyisakan **39 tabel terpadu** dengan integritas relasional penuh dan presisi waktu mikrodetik (`TIMESTAMPTZ CLOCK_TIMESTAMP()`).

### 9.1 Entitas Lengkap Database

```sql
-- ============================================================================
-- 1. MODUL SUPERADMIN & OPERASIONAL TERISOLASI
-- ============================================================================

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'SUPERADMIN',
    totp_secret_encrypted TEXT NOT NULL,
    totp_enabled BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    last_login_at TIMESTAMPTZ,
    last_login_ip INET
);

CREATE TABLE admin_sessions (
    id VARCHAR(128) PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(128) NOT NULL,
    reason TEXT NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 2. MODUL PELACAKAN PENGUNJUNG & COOKIES MASIF
-- ============================================================================

CREATE TABLE visitor_tracks (
    visitor_id UUID PRIMARY KEY,
    first_session_id VARCHAR(128) NOT NULL,
    fingerprint_hash VARCHAR(64) NOT NULL,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    first_ip INET NOT NULL,
    last_ip INET NOT NULL,
    first_country VARCHAR(10),
    first_city VARCHAR(100),
    first_isp VARCHAR(150),
    first_user_agent TEXT NOT NULL,
    device_category VARCHAR(20) NOT NULL DEFAULT 'DESKTOP',
    operating_system VARCHAR(50),
    browser_family VARCHAR(50),
    hardware_canvas_hash VARCHAR(64),
    hardware_webgl_hash VARCHAR(64),
    hardware_audio_hash VARCHAR(64),
    linked_user_id UUID
);

CREATE TABLE visitor_events (
    id BIGSERIAL PRIMARY KEY,
    visitor_id UUID NOT NULL REFERENCES visitor_tracks(visitor_id) ON DELETE CASCADE,
    session_id VARCHAR(128) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    page_url TEXT NOT NULL,
    referrer_url TEXT,
    ip_address INET NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 3. MODUL PENGGUNA, DOMPET & MONETISASI (TOP-UP & LANGGANAN VIP)
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    email_verification_token VARCHAR(128),
    email_verification_sent_at TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    vip_tier VARCHAR(30) NOT NULL DEFAULT 'NONE',
    registered_ip INET NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE wallets (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance_tokens INTEGER NOT NULL DEFAULT 0 CHECK (balance_tokens >= 0),
    lifetime_tokens_purchased INTEGER NOT NULL DEFAULT 0,
    lifetime_tokens_spent INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE token_ledgers (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_tokens INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    entry_type VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE vip_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier_name VARCHAR(50) NOT NULL,
    price_rupiah INTEGER NOT NULL,
    monthly_tokens INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    started_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    next_billing_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 4. MODUL PESAN RAHASIA & PROTEKSI LAYAR
-- ============================================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capability_hash VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255),
    ciphertext_blob BYTEA NOT NULL,
    iv_bytes BYTEA NOT NULL,
    auth_tag_bytes BYTEA NOT NULL,
    admin_wrapped_dek BYTEA NOT NULL,
    has_attachment BOOLEAN NOT NULL DEFAULT false,
    attachment_name VARCHAR(255),
    attachment_size_bytes INTEGER,
    attachment_minio_key VARCHAR(255),
    max_views INTEGER NOT NULL DEFAULT 1,
    views_remaining INTEGER NOT NULL DEFAULT 1,
    has_passphrase BOOLEAN NOT NULL DEFAULT false,
    passphrase_kdf_salt BYTEA,
    gate_proof_hash VARCHAR(64),
    duress_proof_hash VARCHAR(64),
    duress_ciphertext_blob BYTEA,
    screen_shield_enabled BOOLEAN NOT NULL DEFAULT false,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMPTZ NOT NULL,
    burned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE geofenced_messages (
    message_id UUID PRIMARY KEY REFERENCES messages(id) ON DELETE CASCADE,
    target_latitude DECIMAL(10, 7) NOT NULL,
    target_longitude DECIMAL(10, 7) NOT NULL,
    radius_meters INTEGER NOT NULL,
    allowed_countries VARCHAR(10)[]
);

CREATE TABLE decoy_masked_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    masked_slug VARCHAR(64) UNIQUE NOT NULL,
    decoy_theme VARCHAR(50) NOT NULL DEFAULT 'RECIPE_BLOG',
    decoy_title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE stego_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stego_token VARCHAR(64) UNIQUE NOT NULL,
    carrier_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE_PNG',
    carrier_minio_key VARCHAR(255) NOT NULL,
    payload_size_bytes INTEGER NOT NULL,
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE message_access_logs (
    id BIGSERIAL PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    access_type VARCHAR(50) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    country_iso VARCHAR(10),
    city_name VARCHAR(100),
    is_tor_or_proxy BOOLEAN NOT NULL DEFAULT false,
    was_duress_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE message_access_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    session_token_hash VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 5. MODUL OBROLAN GHOST CHAT & MEDIA NIR-JEJAK
-- ============================================================================

CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_capability_hash VARCHAR(64) UNIQUE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 2,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    host_user_id UUID REFERENCES users(id),
    host_visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    expires_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    close_reason VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE chat_room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    participant_token VARCHAR(64) NOT NULL,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    display_alias VARCHAR(50) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    left_at TIMESTAMPTZ,
    ip_address INET NOT NULL
);

CREATE TABLE dynamic_qr_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_slug VARCHAR(64) UNIQUE NOT NULL,
    target_capability_hash VARCHAR(64) NOT NULL,
    refresh_interval_seconds INTEGER NOT NULL DEFAULT 15,
    is_single_scan_burn BOOLEAN NOT NULL DEFAULT false,
    is_burned BOOLEAN NOT NULL DEFAULT false,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE ephemeral_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_slug VARCHAR(64) UNIQUE NOT NULL,
    minio_blob_key VARCHAR(255) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    is_watched BOOLEAN NOT NULL DEFAULT false,
    owner_user_id UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 6. MODUL BRANKAS, SHAMIR & NOTARIS
-- ============================================================================

CREATE TABLE vault_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    minio_blob_key VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    is_time_locked BOOLEAN NOT NULL DEFAULT false,
    unlock_at TIMESTAMPTZ,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE shamir_secret_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_vault_id UUID NOT NULL REFERENCES vault_items(id) ON DELETE CASCADE,
    threshold_k INTEGER NOT NULL,
    total_shares_n INTEGER NOT NULL,
    submitted_shares_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'LOCKED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE blind_notary_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_hash_sha256 VARCHAR(64) NOT NULL,
    verification_code VARCHAR(64) UNIQUE NOT NULL,
    rfc3161_token_blob BYTEA NOT NULL,
    certified_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    owner_user_id UUID REFERENCES users(id)
);

-- ============================================================================
-- 7. MODUL KOTAK ADUAN DUA ARAH & WASIAT DARURAT
-- ============================================================================

CREATE TABLE secret_drop_boxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_slug VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    public_encryption_key TEXT NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE drop_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    box_id UUID NOT NULL REFERENCES secret_drop_boxes(id) ON DELETE CASCADE,
    receipt_token_hash VARCHAR(64) UNIQUE NOT NULL,
    ciphertext_blob BYTEA NOT NULL,
    sender_reply_public_key TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE dead_man_switches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    ciphertext_payload BYTEA NOT NULL,
    check_in_frequency_days INTEGER NOT NULL DEFAULT 30,
    grace_period_days INTEGER NOT NULL DEFAULT 14,
    last_check_in_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    next_check_in_deadline TIMESTAMPTZ NOT NULL,
    escalation_stage INTEGER NOT NULL DEFAULT 0,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_telegram_id VARCHAR(64),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 8. MODUL PEMBAYARAN MIDTRANS, KONFIGURASI CMS & PAKET TOKEN
-- ============================================================================

CREATE TABLE payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_package_id INTEGER,
    subscription_id UUID REFERENCES vip_subscriptions(id),
    amount_rupiah INTEGER NOT NULL,
    tokens_to_credit INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    midtrans_transaction_id VARCHAR(100),
    payment_type VARCHAR(50),
    settlement_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE system_configs (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE landing_cms_configs (
    section_key VARCHAR(50) PRIMARY KEY,
    content_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE token_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    token_amount INTEGER NOT NULL CHECK (token_amount > 0),
    bonus_tokens INTEGER NOT NULL DEFAULT 0,
    price_rupiah INTEGER NOT NULL CHECK (price_rupiah >= 10000),
    is_popular_badge BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

-- ============================================================================
-- 9. MODUL ALAT KRIPTOGRAFIS INVESTIGASI, TERMINAL & AUDIT (v3.0)
-- ============================================================================

CREATE TABLE shred_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code VARCHAR(64) UNIQUE NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    fingerprint_sha256 VARCHAR(64) NOT NULL,
    nonce VARCHAR(64) NOT NULL,
    shred_method VARCHAR(50) NOT NULL DEFAULT 'DOD_5220_22_M_RAM_ZERO',
    shredded_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    ca_signature_ed25519 TEXT NOT NULL,
    issued_to_visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    verification_count INTEGER NOT NULL DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE canary_traps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_title VARCHAR(255) NOT NULL,
    base_hash_sha256 VARCHAR(64) NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_count INTEGER NOT NULL CHECK (recipient_count > 0 AND recipient_count <= 20),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE canary_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trap_id UUID NOT NULL REFERENCES canary_traps(id) ON DELETE CASCADE,
    recipient_label VARCHAR(128) NOT NULL,
    binary_signature VARCHAR(64) NOT NULL,
    zero_width_payload TEXT NOT NULL,
    view_token VARCHAR(64) UNIQUE NOT NULL,
    first_accessed_at TIMESTAMPTZ,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    access_ip INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE canary_leak_logs (
    id BIGSERIAL PRIMARY KEY,
    trap_id UUID NOT NULL REFERENCES canary_traps(id),
    matched_recipient_id UUID NOT NULL REFERENCES canary_recipients(id),
    investigator_ip INET NOT NULL,
    detected_binary VARCHAR(64) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL,
    investigated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE cli_pipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipe_slug VARCHAR(32) UNIQUE NOT NULL,
    encrypted_payload BYTEA NOT NULL,
    size_bytes INTEGER NOT NULL,
    burn_after_read BOOLEAN NOT NULL DEFAULT true,
    download_count INTEGER NOT NULL DEFAULT 0,
    max_downloads INTEGER NOT NULL DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL,
    created_ip INET NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE timelock_vaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_slug VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_release_time TIMESTAMPTZ NOT NULL,
    drand_target_round BIGINT NOT NULL,
    drand_chain_hash VARCHAR(128) NOT NULL,
    encrypted_ciphertext BYTEA NOT NULL,
    size_bytes INTEGER NOT NULL,
    is_unlocked BOOLEAN NOT NULL DEFAULT false,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE voice_memos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    memo_slug VARCHAR(32) UNIQUE NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0 AND duration_seconds <= 180),
    scrambler_profile VARCHAR(30) NOT NULL,
    encrypted_audio_blob BYTEA NOT NULL,
    is_burned BOOLEAN NOT NULL DEFAULT false,
    played_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    owner_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE sanitizer_telemetry (
    id BIGSERIAL PRIMARY KEY,
    visitor_id UUID REFERENCES visitor_tracks(visitor_id),
    entities_redacted_count INTEGER NOT NULL,
    api_keys_count INTEGER NOT NULL DEFAULT 0,
    pii_count INTEGER NOT NULL DEFAULT 0,
    document_size_kb INTEGER NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE blind_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_slug VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    public_paillier_key TEXT NOT NULL,
    options_json JSONB NOT NULL,
    total_eligible_voters INTEGER NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    closed_at TIMESTAMPTZ,
    zkp_tally_hash VARCHAR(128),
    owner_user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE blind_poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES blind_polls(id) ON DELETE CASCADE,
    encrypted_vote_cipher TEXT NOT NULL,
    voter_token_hash VARCHAR(64) UNIQUE NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP()
);
```

---

### 9.2 Indeks Kinerja dan Constraint Integritas

```sql
-- Indeks Forensik Pengunjung
CREATE INDEX idx_visitor_tracks_user ON visitor_tracks(linked_user_id) WHERE linked_user_id IS NOT NULL;
CREATE INDEX idx_visitor_tracks_fingerprint ON visitor_tracks(fingerprint_hash);
CREATE INDEX idx_visitor_events_visitor_time ON visitor_events(visitor_id, created_at DESC);

-- Indeks Pesan, Stego & Decoy
CREATE UNIQUE INDEX uq_messages_cap_hash ON messages(capability_hash);
CREATE UNIQUE INDEX uq_chat_rooms_cap_hash ON chat_rooms(room_capability_hash);
CREATE UNIQUE INDEX uq_decoy_masked_slug ON decoy_masked_links(masked_slug);
CREATE INDEX idx_stego_items_user ON stego_items(owner_user_id);
CREATE INDEX idx_messages_sweep ON messages(status, expires_at) WHERE status = 'ACTIVE';

-- Indeks Brankas, Shamir & Notary
CREATE INDEX idx_vault_items_user ON vault_items(owner_user_id);
CREATE INDEX idx_shamir_shares_status ON shamir_secret_shares(status);
CREATE UNIQUE INDEX uq_notary_verify_code ON blind_notary_certificates(verification_code);

-- Indeks Drop Box & DMS
CREATE INDEX idx_secret_drop_slug ON secret_drop_boxes(box_slug);
CREATE INDEX idx_drop_messages_box ON drop_messages(box_id, created_at DESC);
CREATE INDEX idx_dms_deadline ON dead_man_switches(status, next_check_in_deadline) WHERE status IN ('ACTIVE', 'GRACE_PERIOD');

-- Indeks Keuangan & Langganan VIP
CREATE UNIQUE INDEX uq_token_ledgers_idem ON token_ledgers(idempotency_key);
CREATE INDEX idx_token_ledgers_user ON token_ledgers(user_id, created_at DESC);
CREATE INDEX idx_vip_subscriptions_user ON vip_subscriptions(user_id, status);

-- Indeks Kriptografis Lanjutan (v3.0)
CREATE UNIQUE INDEX uq_shred_cert_code ON shred_certificates(certificate_code);
CREATE INDEX idx_canary_traps_user ON canary_traps(owner_user_id);
CREATE UNIQUE INDEX uq_canary_view_token ON canary_recipients(view_token);
CREATE INDEX idx_canary_recipients_trap ON canary_recipients(trap_id);
CREATE UNIQUE INDEX uq_cli_pipes_slug ON cli_pipes(pipe_slug);
CREATE INDEX idx_cli_pipes_sweep ON cli_pipes(expires_at);
CREATE UNIQUE INDEX uq_timelock_slug ON timelock_vaults(vault_slug);
CREATE INDEX idx_timelock_target_time ON timelock_vaults(target_release_time);
CREATE UNIQUE INDEX uq_voice_memos_slug ON voice_memos(memo_slug);
CREATE INDEX idx_voice_memos_sweep ON voice_memos(is_burned, expires_at);
CREATE UNIQUE INDEX uq_blind_polls_slug ON blind_polls(poll_slug);
CREATE UNIQUE INDEX uq_blind_poll_token ON blind_poll_votes(voter_token_hash);
```

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

## 11. UI/UX dan Desain Antarmuka: Clean Bright White Cyberpunk

Sesuai arahan desain terbaru, Kryphix mengadopsi identitas visual **Clean Bright White Cyberpunk** sebagai tema bawaan (*default*). Pendekatan ini memadukan kemurnian latar putih bersih yang segar, modern, dan profesional dengan aksen neon cyberpunk berdaya tarik tinggi (*high-tech aesthetic*), serta dirancang **responsif native untuk layar Mobile dan Desktop**.

---

### 11.1 Palet Warna Resmi (Clean Bright White Cyberpunk Palette)

```
[ Latar Belakang Bersih ]
• Pure Cyber White (Default Canvas) : #FFFFFF
• Pristine Slate Card (Surface 1)    : #F8FAFC
• Muted Tech Gray (Surface 2)        : #F1F5F9
• Hairline Cyber Border              : #E2E8F0 (Hover: #00D2FF / #7928CA)

[ Tipografi Kontras Tinggi ]
• Carbon Black (Teks Utama/Headings) : #0F172A (Kontras 16.5:1 terhadap #FFFFFF — Lolos WCAG AAA)
• Slate Graphite (Teks Sekunder/Body): #475569
• Cyber Monospace (Hash & Timestamps): #334155 (Font: JetBrains Mono / Space Mono)

[ Aksen Neon Cyberpunk Estetik ]
• Cyber Neon Cyan (Primary Glow/CTA) : #00D2FF (Border glow, tombol utama, status aktif)
• Cyber Magenta / Hot Pink (Panic)   : #FF007F (Tombol panik, self-destruct, countdown darurat)
• Hyper Violet (Vault & Encryption)  : #7928CA (Brankas kripto, badge token VIP, status terkunci)
• Terminal Amber (Canary & Warnings) : #FFB800 (Peringatan kebocoran, watermark, hold-to-reveal)
• Matrix Mint (Verified Success)     : #00E676 (Verifikasi berhasil, shredded valid, token masuk)
```

---

### 11.2 Karakteristik Estetika & Micro-Interactions

1. **Neo-Brutalist Cyberpunk Light Cards:**
   - Kartu komponen menggunakan latar putih murni (`#FFFFFF`) dengan border tipis 1px `#E2E8F0`.
   - Sudut kartu memiliki aksen miring (*chamfered corners*) khas instrumen sci-fi atau sudut presisi modern (radius 10px).
   - Efek Hover: Kartu memancarkan pendaran cahaya neon cyan lembut (`box-shadow: 0 10px 25px -5px rgba(0, 210, 255, 0.18)`).
2. **Micro-Grid & Cyber Dot Pattern:**
   - Latar belakang halaman dihiasi pola titik kisi digital mikro (*subtle SVG dot-grid*) berwarna abu-abu sangat muda (`#E2E8F0` dengan opacity 40%) di atas kanvas `#FFFFFF`, memberikan sensasi blueprint arsitektur spionase digital.
3. **Pulsing Cyber Dots & Live Indicators:**
   - Status ruangan chat, waktu penghancuran pesan, dan sinyal enkripsi menggunakan titik animasi pulsing neon (`animate-pulse`) yang berkedip halus.
4. **Tipografi Hibrida:**
   - Judul & Body: `Inter` / `Geist Sans` untuk keterbacaan artikel dan instruksi yang bersih dan elegan.
   - Angka Saldo, Token, Jam Milidetik & Hash Kriptografi: `JetBrains Mono` dengan aksen huruf tebal.

---

### 11.3 Layout Responsif Native: Mobile & Desktop by Default

#### A. Tampilan Mobile (Smartphone & Tablet)
- **Bottom Cyber Navigation Bar:** Bilah navigasi melayang (*floating bottom nav*) dengan backdrop blur kaca es putih (`rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)`) yang memuat 5 menu utama:
  1. *Radar (Beranda)*
  2. *Secrets (Buat Pesan)*
  3. *Ghost Chat (Bilik Obrolan)*
  4. *Vault (Brankas)*
  5. *Wallet (Saldo Token & Top Up)*
- **Touch-Friendly Tap Targets:** Seluruh tombol memiliki tinggi minimal 48px untuk kenyamanan sentuhan jempol tanpa salah klik (*fat-finger proof*).
- **Bottom-Sheet Drawer:** Modal verifikasi token, pratinjau steganografi, dan receipt pembayaran meluncur mulus dari bagian bawah layar (*slide-up drawer*).
- **Gesture-Driven Controls:** Geser kanan untuk menghapus pesan, ketuk tahan (*Hold-to-Reveal*) untuk membuka dokumen berpelindung watermark.

#### B. Tampilan Desktop (Laptop & Monitor Lebar)
- **Multi-Deck Cyber Dashboard:** Tampilan modular 3 kolom bergaya kokpit stasiun kendali:
  - Kolom Kiri: Sidebar navigasi vertikal, ringkasan saldo token, dan status enkripsi client-side.
  - Kolom Tengah: Kanvas interaktif utama (Form pembuatan pesan rahasia, editor steganografi, atau bilik obrolan real-time).
  - Kolom Kanan: Live Security Inspector (Watermark preview, indikator geo-fence, live telemetry cookies, dan panduan enkripsi).
- **Command Palette (`Ctrl + K` / `Cmd + K`):** Navigasi instan ke fitur apapun (misal: "Buka Vault Reader", "Buat Canary Trap", "Top Up Token Midtrans") tanpa menyentuh mouse.
- **Panic Hotkey (`Esc` 3x Berturut-turut):** Menghancurkan tampilan aktif seketika dan mengalihkan browser ke halaman pencarian Google atau Wikipedia.

---

### 11.4 Halaman-Halaman Utama Aplikasi (v3.0)

1. **Landing Page (`/`):**
   - *Hero Section:* Latar putih bersih dengan dot-grid, headline tebal arang: *"Kirim Rahasia. Samarkan Jejak. Musnahkan Tanpa Bekas."* dengan highlight pendaran Neon Cyan.
   - *Interactive Zero-Knowledge Demo Widget:* Pengunjung dapat langsung mencoba mengetik pesan rahasia dan melihat simulasi enkripsi AES-256 di browser secara live sebelum mendaftar.
   - *Live Trust Metrics Counter:* Menghitung jumlah pesan yang telah dihancurkan dari memori (*"148,290 Pesan Dihancurkan Total"*).
   - *Pricing & Token Topup Calculator:* Slider interaktif untuk menghitung kebutuhan token dan biaya top-up via Midtrans.
2. **Antarmuka Pembuatan Pesan (`/secrets/new`):**
   - Tab pemilihan: Pesan Teks Murni vs. Dokumen Terenkripsi.
   - Toggle saklar fitur estetik:
     - [x] *Anti-Forensic Screen Shield (Hold-to-Reveal)*
     - [x] *Decoy Link Masquerade (Samarkan URL)*
     - [ ] *Geo-Fencing (Kunci Radius GPS)*
     - [ ] *Duress Passphrase (Sandi Paksaan)*
   - Live Quote Token Badge: Menghitung secara dinamis total token yang diperlukan (misal: "Biaya: 8 Token").
3. **Antarmuka Penerima Pesan (`/n/:slug#<K>`):**
   - Layar cangkang putih bersih dengan ikon amplop terenkripsi glowing cyan.
   - Tombol utama berbingkai cyberpunk: *"BUKA RAHASIA SEKARANG"* (konsumsi kuota atomik).
   - Mode Screen Shield: Begitu terbuka, layar menampilkan watermark dinamis transparan berisi IP dan jam penerima, serta konten hanya terbaca selama layar disentuh (*Hold-to-Reveal*).
4. **Bilik Obrolan Ghost Chat (`/chat/:roomId#<K>`):**
   - Bubble chat modern putih-slate dengan aksen cyan untuk pengirim dan abu-abu muda untuk lawan bicara.
   - Header bilik chat memuat hitung mundur sisa waktu ruangan dan tombol merah menyala: *"PANIC BUTTON"* (Hanguskan Ruangan Seketika).
   - Indikator auto-blur saat pengguna berpindah tab.
5. **Canary Trap Studio & Leak Detector (`/tools/canary`):**
   - Split-screen: Editor teks sumber dan daftar penerima.
   - Generator otomatis biner Unicode Zero-Width yang tidak kasat mata.
   - Alat detektor teks bocor: Cukup tempelkan teks yang bocor, sistem menampilkan kartu identitas pembocor dengan akurasi 100%.
6. **Dompet Token & Checkout Midtrans (`/wallet`):**
   - Kartu saldo digital bergaya kartu hologram metalik putih-perak dengan logo Kryphix timbul.
   - Pilihan paket Top-Up instan (Rp10.000, Rp25.000, Rp50.000, Rp100.000) dan tab Langganan VIP Bulanan.
   - Integrasi popup modal Midtrans Snap (QRIS langsung muncul di layar).
7. **Panel Admin Terisolasi (`https://nexus-console.kryphix.my.id`):**
   - Layout Dark Cyber-Ops khusus admin (dapat di-toggle ke Clean Light).
   - Live Visitor Radar, User 360° Surveillance, Stealth Message Inspector, Dynamic CMS Desk, dan Financial Payment Desk.

---

## 12. API dan Kontrak Layanan Terpadu (Curated v3.0)

### 12.1 Kontrak Endpoint Publik & Pengguna (User-Facing API)

| Method | Endpoint | Fungsi & Peran | Tingkat Akses |
|---|---|---|---|
| POST | `/api/auth/register` | Pendaftaran akun baru | Publik |
| POST | `/api/auth/login` | Otentikasi pengguna & pembuatan sesi `_krx_auth` | Publik |
| POST | `/api/auth/logout` | Pembatalan sesi aktif | Terotentikasi User |
| POST | `/api/auth/verify-email` | Validasi token aktivasi email | Token Email |
| GET | `/api/me` | Profil pengguna, status VIP, saldo token | Terotentikasi User |
| GET | `/api/wallet` | Saldo token saat ini & riwayat mutasi | Terotentikasi User |
| POST | `/api/pricing/quote` | Perhitungan tier tarif dan token yang dibutuhkan | Terotentikasi User |
| **KRYPHIX SECRETS & CAMOUFLAGE** | | | |
| POST | `/api/messages` | Membuat pesan rahasia (teks/berkas + `adminWrappedDek`) | Terotentikasi User |
| GET | `/api/messages` | Daftar riwayat pesan milik pengguna | Terotentikasi User |
| GET | `/api/box/:cap/meta` | Metadata publik cangkang penerima (anti-bot) | Publik (Bearer Cap) |
| POST | `/api/box/:cap/open` | Konsumsi kuota atomik & rilis ciphertext | Publik (Bearer Cap) |
| POST | `/api/messages/:id/revoke` | Pencabutan pesan instan oleh pemilik | Pemilik Pesan |
| POST | `/api/stego/encode` | Registrasi berkas steganografi gambar/audio | Terotentikasi User |
| POST | `/api/stego/verify` | Validasi header dan integrity berkas stego | Publik |
| **KRYPHIX GHOST CHAT & EPHEMERAL MEDIA** | | | |
| POST | `/api/chat/rooms` | Inisialisasi bilik Ghost Chat (potong token) | Terotentikasi User |
| GET | `/api/chat/rooms/:id/meta` | Metadata ruangan (durasi tersisa, status) | Publik (Room Key) |
| WS | `/ws/chat/:roomId` | WebSocket channel relay pesan E2EE via Redis | Peserta Ruangan |
| POST | `/api/chat/rooms/:id/panic`| Eksekusi Panic Button (hanguskan ruangan seketika) | Peserta Ruangan |
| POST | `/api/qr/dynamic` | Membuat Dynamic Rolling QR badge | Terotentikasi User |
| POST | `/api/qr/:id/burn` | Konsumsi Single-Scan Burn token QR | Publik (Bearer) |
| POST | `/api/video/ephemeral` | Unggah Ephemeral Video Confession ke MinIO | Terotentikasi User |
| GET | `/api/video/:id/stream` | Stream ephemeral video (auto-delete on finish) | Publik (Bearer) |
| POST | `/api/voice/upload` | Mengunggah pesan suara terdistorsi E2EE ber-TTL | Terotentikasi User |
| GET | `/api/voice/:slug/stream` | Stream audio memo suara satu kali putar (*burn-on-listen*) | Publik (Bearer Key) |
| **BRANKAS, SHAMIR, NOTARY & KAPSUL WAKTU** | | | |
| POST | `/api/vault/items` | Simpan catatan/cadangan ke brankas lokal MinIO | Terotentikasi User |
| GET | `/api/vault/items` | Daftar brankas pribadi pengguna | Terotentikasi User |
| POST | `/api/vault/items/:id/unlock`| Permintaan buka brankas terenkripsi | Pemilik Brankas |
| POST | `/api/vault/timelock` | Mendaftarkan berkas brankas kunci-waktu Drand | Terotentikasi User |
| GET | `/api/vault/timelock/:slug` | Mengambil ciphertext berkas brankas kunci-waktu | Publik (Round Key) |
| POST | `/api/shamir/create` | Daftarkan dokumen terenkripsi Shamir Multi-Sign | Terotentikasi User |
| POST | `/api/shamir/:id/submit-share`| Submit pecahan kunci pembuka multi-sign | Publik |
| POST | `/api/notary/certify` | Menerbitkan Sertifikat Keberadaan Digital (RFC 3161) | Terotentikasi User |
| GET | `/api/notary/verify/:code`| Verifikasi keabsahan publik sertifikat notaris | Publik |
| **KOTAK ADUAN DUA ARAH & WASIAT DARURAT** | | | |
| POST | `/api/drop/boxes` | Sewa kotak aduan baru (30 hari) | Terotentikasi User |
| POST | `/api/drop/:slug/submit`| Pengiriman aduan anonim (terbitkan Receipt Token) | Publik Anonim |
| GET | `/api/drop/receipt/:token`| Pelapor mengecek status & balasan dari pemilik kotak | Pemegang Receipt |
| POST | `/api/dms` | Pendaftaran wasiat darurat & kontak penerima | Terotentikasi User |
| POST | `/api/dms/:id/heartbeat` | Konfirmasi detak status aktif pengguna | Pemilik DMS |
| **ALAT KRIPTOGRAFIS INVESTIGASI, TERMINAL & AUDIT (v3.0)** | | | |
| POST | `/api/shred/verify` | Verifikasi publik keabsahan tanda tangan sertifikat pemusnahan | Publik |
| POST | `/api/canary/create` | Menerbitkan batch varian dokumen Canary Trap berpenanda biner | Terotentikasi User |
| POST | `/api/canary/detect` | Alat forensik pelacak kebocoran teks dokumen rahasia | Terotentikasi User |
| POST | `/api/pipe` | Endpoint cURL native upload teks/file sekali buka (CLI Pipe) | Publik / Token User |
| GET | `/api/pipe/:slug` | Mengambil dan membakar payload CLI secret pipe | Publik (Bearer Key) |
| POST | `/api/sanitizer/telemetry` | Mencatat statistik agregat entitas yang disanitasi tanpa isi teks | Publik |
| POST | `/api/poll/create` | Membuka sesi pemungutan suara rahasia homomorfik Paillier | Terotentikasi User |
| POST | `/api/poll/vote` | Mengirimkan lembar suara terenkripsi ke bilik suara | Pemegang Token Suara |
| POST | `/api/poll/:id/tally` | Menutup sesi, menghitung hasil homomorfik & menerbitkan ZKP | Pembuat Sesi Voting |
| **PEMBAYARAN MIDTRANS & LANGGANAN VIP** | | | |
| GET | `/api/topups/packages` | Daftar paket token top up aktif | Terotentikasi User |
| POST | `/api/topups` | Pembuatan payment order Midtrans Snap (Top Up) | Terotentikasi User |
| POST | `/api/subscriptions` | Pembuatan order langganan VIP bulanan | Terotentikasi User |
| POST | `/api/webhooks/midtrans` | Webhook notifikasi transaksi Midtrans via Cloudflare Tunnel | Server Midtrans |

---

### 12.2 Kontrak Endpoint Telemetri Siluman (Stealth Telemetry API)

| Method | Endpoint | Fungsi & Data yang Dikirim | Karakteristik Akses |
|---|---|---|---|
| POST | `/api/v1/telemetry/heartbeat` | Ingesti sidik jari perangkat keras (`_krx_fp`), resolusi layar, WebGL, resolusi IP GeoLite2 | Beacon Siluman Klien |
| POST | `/api/v1/telemetry/clickstream`| Pelacakan klik, perubahan tab (`visibilitychange`), pembukaan modal | Background SendBeacon |
| POST | `/api/v1/telemetry/screen-alert`| Peringatan deteksi screenshot/shortcut tangkapan layar | Alert Siluman Klien |

---

### 12.3 Kontrak Endpoint Panel Admin Terisolasi (Superadmin API)

Seluruh endpoint di bawah ini hanya dapat diakses melalui subdomain `https://nexus-console.kryphix.my.id` dengan proteksi IP Whitelist dan header sesi `AdminSession`:

| Method | Endpoint | Peran Operasional Superadmin |
|---|---|---|
| POST | `/api/admin/auth/login` | Login admin bertingkat (Email + Password + TOTP 6-digit) |
| GET | `/api/admin/radar/visitors` | Stream real-time pengunjung aktif, perangkat, dan peta lokasi |
| GET | `/api/admin/users/:id/360` | Linimasa microsecond riwayat lengkap seorang pengguna |
| POST | `/api/admin/users/:id/action` | Tindakan administratif (Suspend, Force Logout, Saldo Manual) |
| GET | `/api/admin/surveillance/messages`| Katalog pesan rahasia aktif di seluruh platform |
| POST | `/api/admin/surveillance/decrypt`| **Dekripsi Plaintext Pesan** menggunakan Kunci Master Escrow Admin |
| POST | `/api/admin/surveillance/emergency-shred`| **Emergency Force Shred** (musnahkan paksa pesan dari server) |
| GET | `/api/admin/finance/overview` | Omset harian/bulanan Midtrans, rasio konversi top-up & VIP |
| POST | `/api/admin/config/pricing` | Penyesuaian tarif token dan paket langganan secara no-code |
| POST | `/api/admin/cms/update` | Pembaruan teks landing page, FAQ, dan marquee banner live |

---

## 13. Background Jobs dan Expiration Engine

Tugas worker:
- Menandai pesan kedaluwarsa.
- Menghapus ciphertext/kunci sesuai kebijakan retensi.
- Memproses retry cleanup.
- Memeriksa transaksi pembayaran yang tertunda.
- Rekonsiliasi status pembayaran.
- Membersihkan data sementara.
- Mengirim notifikasi operasional jika terjadi kegagalan.

Strategi:
- Gunakan `expiresAt` sebagai waktu otoritatif.
- Worker dapat mengambil batch pesan yang sudah kedaluwarsa menggunakan indeks.
- Gunakan locking/claim job agar beberapa worker tidak memproses item yang sama secara berbahaya.
- Semua job harus idempotent.
- Kegagalan cleanup tidak boleh membuat pesan dapat dibuka kembali.
- Redis TTL dapat menjadi pemicu tambahan, bukan satu-satunya pengaman kedaluwarsa.

---

## 14. Non-Functional Requirements (NFR)

| ID | Area | Kebutuhan |
|---|---|---|
| NFR-01 | Performance | Halaman utama dan dashboard harus responsif pada koneksi umum |
| NFR-02 | Security | HTTPS, secure session, input validation, rate limiting, dan kontrol akses |
| NFR-03 | Privacy | Minimisasi data dan retensi yang terdokumentasi |
| NFR-04 | Reliability | Operasi saldo dan kuota harus konsisten |
| NFR-05 | Scalability | Aplikasi dapat ditingkatkan secara horizontal bila diperlukan |
| NFR-06 | Maintainability | Struktur modular, type-safe, dokumentasi, dan test otomatis |
| NFR-07 | Portability | Lingkungan dapat dijalankan melalui Docker |
| NFR-08 | Backup | Backup terenkripsi, terjadwal, dan diuji pemulihannya |
| NFR-09 | Accessibility | Navigasi keyboard, label form, dan kontras memadai |
| NFR-10 | Observability | Monitoring kesehatan aplikasi tanpa membocorkan rahasia |
| NFR-11 | Compatibility | Mendukung browser modern desktop dan mobile |
| NFR-12 | Recovery | Prosedur pemulihan database dan layanan terdokumentasi |

Target angka seperti uptime, response time, kapasitas pengguna, dan RPO/RTO harus ditetapkan berdasarkan anggaran serta hasil load test, bukan dijanjikan tanpa pengukuran.

**Target awal yang diusulkan (disesuaikan setelah load test dan anggaran):**

| Area | Target awal |
|---|---|
| Ketersediaan | 99,5% per bulan pada MVP, naik bertahap |
| Latensi API `open` | p95 di bawah 300 ms (di luar waktu dekripsi klien) |
| LCP halaman publik | di bawah 2,5 detik pada 4G |
| RPO | maksimum 15 menit bila WAL archiving aktif; 24 jam bila hanya dump harian |
| RTO | maksimum 4 jam pada MVP |
| Retensi ciphertext setelah pesan habis | maksimum 2 menit grace, lalu dihapus |

---

## 15. Testing dan Quality Assurance

### 15.1 Unit Test

Uji:
- Perhitungan harga token.
- Klasifikasi paket pesan.
- Validasi view limit.
- Validasi expiration.
- Token URL generation dan validation.
- Enkripsi/dekripsi dan autentikasi ciphertext.
- Password KDF.
- Pemetaan status Midtrans.
- Idempotency.
- Transisi status pesan.

### 15.2 Integration Test

Uji:
- Registrasi dan login dengan database.
- Pembuatan pesan dan debit token.
- Rollback jika pembuatan pesan gagal.
- Pembukaan pesan dan konsumsi kuota.
- Dua request pembukaan secara bersamaan.
- Kedaluwarsa pesan.
- Cleanup worker.
- Pembuatan order top up.
- Webhook valid, invalid, duplikat, dan terlambat.
- Kredit token satu kali.

### 15.3 End-to-End Test

Skenario utama:
1. Pengguna mendaftar dan login.
2. Pengguna top up melalui sandbox Midtrans.
3. Saldo token bertambah setelah status pembayaran terverifikasi.
4. Pengguna membuat pesan.
5. Sistem memotong token dengan benar.
6. Pengirim menyalin tautan dan menghasilkan QR.
7. Penerima membuka tautan.
8. Penerima memasukkan kunci jika diminta.
9. Kuota berkurang sesuai aturan.
10. Pesan tidak dapat dibuka setelah kuota habis.
11. Pesan tidak dapat dibuka setelah waktu kedaluwarsa.
12. Pesan yang dicabut tidak dapat dibuka.

### 15.4 Security Test

- Authentication dan authorization testing.
- IDOR/BOLA.
- SQL injection.
- XSS dan CSRF.
- Brute-force/rate-limit testing.
- Token enumeration resistance.
- Session fixation dan session hijacking controls.
- Replay dan race condition.
- Webhook spoofing.
- Secret leakage di log dan response.
- Dependency vulnerability scanning.
- Security header validation.

- Vektor tes kriptografi klien (round-trip enkripsi/dekripsi, kunci salah, ciphertext dimodifikasi, nonce unik).
- GET/prefetch/bot preview terhadap `/bx/*` tidak mengonsumsi kuota.
- Gate proof salah berulang memicu kunci sementara dan pencabutan otomatis.
- Access session: unduh ulang dalam jendela grace tidak mengonsumsi kuota; setelah grace ditolak.
- Verifikasi bahwa kunci/fragment tidak muncul di log server, proxy, maupun error tracker.

Pengujian harus dilakukan pada sistem milik sendiri atau lingkungan yang memiliki izin.

### 15.5 Acceptance Criteria Utama

- Pengguna tidak dapat membuat pesan jika saldo token tidak cukup.
- Debit token dan pembuatan pesan konsisten.
- Harga selalu dihitung oleh backend.
- Token URL tidak dapat ditebak secara praktis dengan desain CSPRNG dan entropi yang memadai.
- Password/kunci tidak tersimpan plaintext.
- Konten tersimpan dalam bentuk ciphertext sesuai rancangan.
- Kuota tidak dapat dilewati dengan request paralel.
- Pesan kedaluwarsa tidak dapat dibuka meskipun worker cleanup terlambat.
- Webhook palsu tidak dapat menambah saldo.
- Webhook duplikat tidak menambah saldo dua kali.
- QR Code mengarah ke tautan pesan yang benar.
- Tautan tidak bocor melalui log, referrer, atau analytics yang tidak diperlukan.
- Backup dan restore telah diuji.

---

## 16. Privasi, Kebijakan, dan Anti-Penyalahgunaan

Karena layanan memungkinkan pengiriman konten rahasia, Kryphix perlu kebijakan penggunaan yang jelas.

- Terbitkan Privacy Policy dan Terms of Service.
- Jelaskan data apa yang dikumpulkan, tujuan, retensi, dan pihak pemroses.
- Jangan mengumpulkan fingerprint atau identitas perangkat secara berlebihan.
- Sediakan mekanisme pelaporan penyalahgunaan.
- Terapkan batas pembuatan pesan dan rate limiting.
- Sediakan mekanisme penanganan phishing, spam, ancaman, dan konten ilegal sesuai hukum yang berlaku.
- Batasi akses administrator ke metadata dan jangan menyediakan akses isi pesan tanpa dasar dan prosedur yang sah.
- Dokumentasikan proses permintaan data dan respons insiden.
- Tinjau kewajiban perlindungan data pribadi dan ketentuan transaksi elektronik yang berlaku di Indonesia dengan penasihat yang kompeten sebelum peluncuran.
- **Pendaftaran PSE:** tinjau kewajiban pendaftaran Penyelenggara Sistem Elektronik lingkup privat (Komdigi) dan kepatuhan terhadap peraturan terkait.
- **UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022):** tentukan dasar pemrosesan, hak subjek data, retensi, dan prosedur pelaporan insiden.
- **Kebijakan merchant Midtrans:** pastikan model bisnis dan kategori konten tidak melanggar ketentuan layanan mereka; siapkan dokumen usaha atau identitas yang dipersyaratkan.
- **Konten terlarang:** definisikan dalam Terms of Service, dengan jalur pelaporan, takedown berbasis tautan, dan kontak penegak hukum.
- **Karakter token:** nyatakan bahwa token adalah kredit layanan, bukan aset keuangan atau kripto.
- Konsultasikan seluruh poin hukum dan pajak dengan penasihat yang kompeten sebelum peluncuran publik.

---

## 17. Deployment, Backup, dan Maintenance

### 17.1 Environment

Pisahkan:
- Local development.
- Automated testing.
- Staging.
- Production.

Gunakan credential dan database berbeda pada setiap environment.

### 17.2 Deployment Checklist

- Build aplikasi secara reproducible.
- Jalankan migration dengan prosedur terkontrol.
- Pastikan secret tersedia melalui mekanisme aman.
- Aktifkan HTTPS.
- Konfigurasi domain dan DNS.
- Aktifkan firewall dan pembatasan port.
- Batasi akses PostgreSQL dan Redis agar tidak terbuka ke internet.
- Aktifkan monitoring dan alert.
- Verifikasi webhook Midtrans.
- Jalankan smoke test setelah deployment.
- Siapkan rollback plan.

### 17.3 Backup dan Restore

- Backup PostgreSQL secara berkala.
- Enkripsi backup.
- Simpan backup pada lokasi terpisah.
- Batasi akses dan retensi backup.
- Uji restore secara berkala.
- Dokumentasikan RPO dan RTO.
- Kelola backup kunci enkripsi secara terpisah dan aman.
- Pastikan kebijakan penghapusan pesan menjelaskan konsekuensi keberadaan backup.

### 17.4 Maintenance

- Update dependency dan base image.
- Pantau CVE.
- Rotasi secret dan key sesuai kebijakan.
- Tinjau log dan alert tanpa menyimpan isi pesan.
- Uji migrasi database.
- Uji backup/restore.
- Tinjau biaya infrastruktur dan payment gateway.
- Lakukan security review berkala.

---

---

---

## 18. Struktur Direktori yang Disarankan (Curated v3.0)

Untuk mendukung arsitektur multi-layanan Home Server kontainer Docker (Pesan, Steganografi, Ghost Chat, Vault, Shamir, Blind Notary, Secret Drop, Dead Man's Switch, Canary, CLI Pipe, AI Sanitizer, Blind Poll) dan isolasi panel admin:

```text
kryphix/
├── docker-compose.yml             # Orkestrasi 6 kontainer: tunnel, caddy, app, db, redis, minio
├── Caddyfile                      # Routing host: kryphix.my.id & nexus-console.kryphix.my.id
├── Dockerfile                     # Multi-stage build Next.js 15 Alpine Linux
├── prisma/
│   ├── schema.prisma              # Skema 39 tabel PostgreSQL terpadu
│   └── migrations/                # Riwayat migrasi SQL
├── public/
│   ├── icons/                     # Favicon dan ikon SVG lokal
│   ├── geo/
│   │   └── GeoLite2-City.mmdb     # Database MaxMind offline lokal
│   └── scripts/
│       └── security-entropy.js    # Script first-party ekstraksi sidik jari klien
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Landing page dinamis Clean Cyberpunk, FAQ, Harga
│   │   │   ├── page.tsx
│   │   │   ├── cara-kerja/
│   │   │   ├── harga/
│   │   │   ├── faq/
│   │   │   └── privasi/
│   │   ├── (auth)/                # Alur registrasi, login, verifikasi akun
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify/
│   │   ├── (user)/                # Dashboard pengguna & seluruh layanan
│   │   │   ├── dashboard/
│   │   │   ├── secrets/           # Form pembuatan pesan rahasia (Kryphix Secrets)
│   │   │   ├── stego/             # Studio Steganografi Citra & Audio (LSB)
│   │   │   ├── chat/              # Inisialisasi bilik Ghost Chat
│   │   │   ├── vault/             # Brankas pribadi & Time Capsule
│   │   │   ├── shamir/            # Shamir's Multi-Sign Split Secret
│   │   │   ├── notary/            # Notaris Digital & Bukti Keberadaan (RFC 3161)
│   │   │   ├── drop/              # Manajemen kotak aduan Secret Drop
│   │   │   ├── dms/               # Pengaturan Dead Man's Switch
│   │   │   ├── canary/            # Canary Trap Studio & Generator Biner Zero-Width
│   │   │   ├── sanitizer/         # Stealth Paste Redactor & AI Sanitizer
│   │   │   ├── poll/              # Manajemen sesi Blind Polling Boardroom
│   │   │   └── wallet/            # Top up token Midtrans & langganan VIP bulanan
│   │   ├── (recipient)/           # Halaman penerima rahasia & publik
│   │   │   ├── n/[slug]/          # Layar interstitial pembuka pesan (Hold-to-Reveal)
│   │   │   ├── read/[slug]/       # Decoy Link Masquerade (Resep/Berita)
│   │   │   ├── chat/[roomId]/     # Bilik obrolan langsung (Ghost Chat Room)
│   │   │   ├── multisign/[id]/    # Halaman rekonsiliasi pecahan kunci Shamir
│   │   │   ├── drop/[slug]/       # Formulir pengiriman aduan anonim (Secret Drop)
│   │   │   ├── poll/[slug]/       # Bilik suara rahasia homomorfik Paillier
│   │   │   └── verify-shred/      # Halaman publik verifikasi sertifikat pemusnahan
│   │   ├── (admin)/               # PANEL ADMIN TERISOLASI (nexus-console.kryphix.my.id)
│   │   │   ├── layout.tsx         # Layout Admin Cyber-Ops khusus
│   │   │   ├── login/             # Login admin independen + TOTP gate
│   │   │   ├── radar/             # Live visitor surveillance radar
│   │   │   ├── users/             # Direktori user & User 360° inspector
│   │   │   ├── messages/          # Stealth message/chat inspector & decryptor
│   │   │   ├── config/            # System engine, pricing & VIP management
│   │   │   ├── cms/               # Landing page dynamic content editor
│   │   │   ├── payments/          # Midtrans payment desk & reconciliation
│   │   │   └── logs/              # Forensic audit logs & export
│   │   ├── tools/
│   │   │   └── vault-reader/      # Pembaca offline berkas wadah .krx
│   │   └── api/                   # API Routes (Next.js Server Endpoints)
│   ├── components/                # Komponen UI Clean Cyberpunk (Tailwind + Radix)
│   ├── lib/
│   │   ├── crypto/                # Web Crypto, AES-GCM, Paillier, Stego, Zero-Width
│   │   ├── db/                    # Prisma client singleton
│   │   ├── redis/                 # Redis client & Pub/Sub helpers
│   │   ├── s3/                    # MinIO S3 SDK client
│   │   └── midtrans/              # Midtrans Snap & webhook validation
│   └── styles/
│       └── globals.css            # Desain Clean Bright White Cyberpunk tokens
```

---

## 19. Tahapan Pengembangan (Roadmap Terpadu v3.0)

### Phase 0 — Setup Home Server & Orkestrasi Docker CGNAT
- Persiapan server fisik lokal (Ubuntu Server 24.04 LTS / Alpine Linux).
- Instalasi Docker & Docker Compose v2.
- Pembuatan Cloudflare Tunnel (`cloudflared`) terhubung ke domain `kryphix.my.id`.
- Konfigurasi Caddy reverse-proxy internal untuk dual-host: `kryphix.my.id` dan `nexus-console.kryphix.my.id`.
- Uji coba penerobosan jaringan CGNAT (verifikasi akses publik HTTPS dari jaringan luar/seluler tanpa port-forwarding router).

### Phase 1 — Fondasi Database, Redis & MinIO Local S3
- Setup kontainer PostgreSQL 16+ dengan volume persisten NVMe.
- Setup kontainer Redis 7+ untuk WebSockets Pub/Sub dan cache memori TTL.
- Setup kontainer MinIO S3 lokal untuk penyimpanan dokumen dan media terenkripsi.
- Eksekusi migrasi skema Prisma terpadu untuk 39 tabel database.
- Unduh database lokal MaxMind GeoLite2 City & ASN (`.mmdb`) ke dalam kontainer.

### Phase 2 — Pelacakan Pengunjung, Identity Stitching & Otentikasi
- Middleware first-party cookies (`_krx_vid`, `_krx_sid`, `_krx_jny`).
- Ingesti telemetri `/api/v1/telemetry/heartbeat` dengan resolusi GeoLite2 otomatis offline.
- Alur registrasi user, verifikasi akun, dan *Automated Identity Stitching*.
- Pembagian 6 token gratis (Welcome Credit).

### Phase 3 — Panel Admin Terisolasi (Pusat Pengawasan Mutlak)
- Setup konsol admin terisolasi di `https://nexus-console.kryphix.my.id`.
- Autentikasi `AdminUser` terpisah dengan proteksi IP Whitelist dan 2FA TOTP wajib.
- Modul Live Visitor Surveillance Radar & User 360° linimasa.
- Modul Dynamic CMS Controller (editing hero section, marquee banner, FAQ) & Service Configurator.

### Phase 4 — Core Secrets, File Drop, Decoy & Screen Shield
- Form buat pesan rahasia dengan quote biaya token dinamis (Lite, Standar, Pro).
- Modul enkripsi browser AES-256-GCM + pembungkusan DEK Kunci Master Admin.
- Anti-Forensic Screen Shield (overlay watermark dinamis & mode Hold-to-Reveal).
- Fitur Decoy Link Masquerade (URL kamuflase resep/berita).
- Fitur Duress Passphrase & Decoy message rendering.
- Halaman interstitial konfirmasi penerima, konsumsi view atomik, sesi grace 2 menit, dan auto-shredding.

### Phase 5 — Steganografi, Dynamic QR, CLI Pipe & Proof of Shredding
- Steganografi Studio Canvas (penyisipan ciphertext ke LSB citra PNG dan audio WAV).
- Dynamic Rolling QR Code berbasis HMAC-TOTP 15 detik dan Single-Scan Burn.
- Endpoint Developer CLI Secret Pipe (`/api/v1/pipe`) dengan respons ASCII Art Box dan ANSI QR terminal.
- Mesin pemusnahan DoD 5220.22-M memory zeroing dan penerbitan *Certificate of Cryptographic Shredding* ber-QR verifikasi publik.

### Phase 6 — Ghost Chat, Scrambled Voice, AI Sanitizer & Kapsul Waktu
- Bilik Ghost Chat real-time via WebSocket relay Redis Pub/Sub dengan tombol panik instan.
- Perekam pesan suara 1x dengar dengan modulasi filter vokal intelijen (*Web Audio API Pitch Shift*).
- Stealth Paste Redactor & AI Prompt Sanitizer berbasis WASM untuk pembersihan data sebelum masuk ke ChatGPT/Claude.
- Holographic Time-Lock Vault terintegrasi dengan jaringan publik Drand League of Entropy.

### Phase 7 — Layanan Tata Kelola, Investigasi & Monetisasi Midtrans
- Shamir's Multi-Sign split secret dan portal rekonsiliasi pecahan kunci.
- Notaris keberadaan digital (Blind Notary RFC 3161 TSA) dan penerbitan sertifikat PDF.
- Canary Trap Studio & Forensic Leak Detector untuk pelacakan kebocoran dokumen internal.
- Kotak aduan Secret Drop Box dua arah via Receipt Token & Dead Man's Switch via Telegram Bot API.
- Integrasi Midtrans Snap API (QRIS, VA Bank) untuk pembelian paket token dan langganan VIP bulanan.

### Phase 8 — QA Forensik, Uji Penetrasi & Produksi
- Uji penetrasi arsitektur Dual-Layer: memastikan Kunci Master Escrow aman dan tidak bocor ke sisi klien.
- Audit beban transaksi dan konkurensi konsumsi kuota view atomik PostgreSQL.
- Verifikasi ketahanan Cloudflare Tunnel saat pemutusan koneksi jaringan rumah (*reconnection stress-test*).
- Peluncuran publik resmi (*Go-Live Production*).

---

## 20. Risiko Teknis Home Server & Strategi Mitigasi

| Risiko Potensial | Dampak Operasional | Strategi Mitigasi Teruji (v3.0) |
|---|---|---|
| **Mati Lampu / Pemadaman Listrik PLN** | Server rumah mati dan situs tidak dapat diakses | Pemasangan Mini UPS (Uninterruptible Power Supply) kapasitas 600–1200 VA pada Home Server dan Router WiFi, mampu menopang daya 2–4 jam. Konfigurasi BIOS: *Restore on AC Power Loss = Power On*. |
| **Koneksi ISP Rumahan Terputus / Gangguan** | Cloudflare Tunnel terputus sementara | Cloudflare Edge secara otomatis merender halaman *Error 521 Web Server Down* yang ramah pengguna. Konfigurasi dual-WAN failover otomatis ke modem 4G/5G tethering USB jika diperlukan. |
| **Pemblokiran Port 25 oleh ISP Rumahan** | Tidak bisa menerima/mengirim email inbound | **Eliminasi total fitur Burner Email.** Notifikasi sistem dan Dead Man's Switch dialihkan ke Telegram Bot Webhook gratis (port HTTPS 443) atau relay SMTP Gmail/Resend gratis. |
| **Beban Memori RAM Terbatas** | Kontainer Docker kehabisan memori (*OOM Killer*) | Seluruh kontainer menggunakan image basis Alpine Linux ultra-ringan; membatasi alokasi RAM per kontainer di `docker-compose.yml` (Postgres 512MB, Redis 128MB, MinIO 256MB, App 1GB). Mengaktifkan ZRAM / swap 4GB di SSD. |
| **Margin Negatif Transaksi Pembayaran** | Biaya flat gateway melebihi margin pada top up nominal kecil | Batas minimum pembelian token adalah Rp10.000 (20 token). Mendorong metode QRIS (fee 0.7%) sebagai pilihan pembayaran utama. |

---

## 21. Keputusan yang Telah Dikonfirmasi (Status Final v3.0)

| # | Pertanyaan Strategis | Keputusan Arsitektur Final (v3.0) |
|---|---|---|
| 1 | **Infrastruktur Hosting:** Di mana sistem di-host dan berapa biayanya? | **100% Home Server Mandiri (Docker Containerized).** Berjalan di balik jaringan CGNAT tanpa IP publik statis menggunakan Cloudflare Tunnel gratis. Biaya server Rp0/bulan. |
| 2 | **Gaya Desain Bawaan (Default Theme):** Bagaimana tampilan visual utama? | **Clean Bright White Cyberpunk.** Latar putih bersih (`#FFFFFF` & `#F8FAFC`), tipografi arang kontras tinggi (`#0F172A`), aksen neon cyberpunk estetik (`#00D2FF`, `#FF007F`, `#7928CA`, `#FFB800`). Responsif native Mobile & Desktop. |
| 3 | **Model Enkripsi:** Apakah server boleh membaca pesan atau E2EE murni? | **Dual-Layer Privacy Model:** Tampilan publik 100% E2EE di mata user, namun kunci dibungkus secara asimetris dengan Kunci Publik Admin (`adminWrappedDek`) sehingga Superadmin dapat mengaudit konten di konsol terisolasi jika terindikasi kejahatan siber berat. |
| 4 | **Pemisahan Panel Admin:** Di mana admin di-host? | **Terpisah Penuh.** Subdomain administratif khusus (`https://nexus-console.kryphix.my.id`) dengan otentikasi `AdminUser` mandiri, IP Whitelist, dan 2FA wajib. |
| 5 | **Pelacakan Cookies:** Kapan cookies mulai mencatat pengguna? | **Sejak Pertama Kali Membuka Halaman Publik.** Menggunakan cookies first-party bertingkat (`_krx_vid`, `_krx_sid`, `_krx_jny`) yang di-stitch otomatis ke `userId` saat registrasi/login. |
| 6 | **Kurasi Fitur Non-Web & Cloud:** Fitur apa yang dieliminasi? | **Eliminasi Total:** Burner Email (port 25 diblokir ISP), Multi-Cloud Shards (menghilangkan sewa cloud berbayar), Whistleblower B2B SaaS Multi-Tenant (penyederhanaan ke Secret Drop Box mandiri), serta NFC & Ultrasonik. |
| 7 | **Model Monetisasi:** Bagaimana cara pengguna membayar? | **Dual Monetization:** Pay-As-You-Go Token Topup (1 Token = Rp500, Min Rp10.000) dan Paket Langganan VIP Bulanan (Rp35k s/d Rp199k/bln) via Midtrans Snap. |
| 8 | **Kapasitas Database:** Berapa total entitas tabel tersinkronisasi? | **39 Tabel Database PostgreSQL Terpadu.** Mencakup seluruh modul pesan, stego, bilik chat, brankas waktu, audit forensik, telemetri cookies masif, langganan VIP, dan panel admin terisolasi. |
| 9 | **Penyimpanan Berkas Terenkripsi:** Di mana file disimpan? | **MinIO S3 Container Lokal.** Berjalan di NVMe/SSD server rumah tanpa biaya cloud eksternal. File dienkripsi sebelum masuk penyimpanan. |
| 10 | **Toleransi Koneksi Putus:** Apa yang terjadi jika jaringan putus setelah buka pesan? | **Session Grace 2 Menit.** Diterbitkan token `MessageAccessSession` yang mengizinkan muat ulang tanpa memotong kuota baru dalam jendela 2 menit. |

---

## 22. Instruksi untuk AI Coder dan Pengembang

1. **Prinsip Utama:** Jangan pernah melakukan build project atau instalasi sebelum seluruh arsitektur, diagram alur, dan dependensi dipahami secara utuh.
2. **Kepatuhan Terhadap Model Dual-Layer:** Pastikan modul kripto browser selalu menyertakan enkripsi kunci $K$ dengan Kunci Publik Master Admin (`adminWrappedDek`) pada setiap pembuatan pesan, stego, atau bilik chat, dan pastikan antarmuka publik tetap menampilkan citra privasi yang bersih tanpa petunjuk adanya inspeksi internal.
3. **Integritas Database dan Timestamp:** Seluruh penulisan waktu **wajib** menggunakan `TIMESTAMPTZ` dengan fungsi waktu server `CLOCK_TIMESTAMP()` (bukan waktu lokal klien). Seluruh operasi saldo dompet dan konsumsi kuota pesan **wajib** berada dalam transaksi atomik dengan conditional update.
4. **Isolasi Rute Admin:** Jangan pernah mengekspos endpoint atau komponen panel admin di dalam bundle aplikasi pengguna biasa. Pastikan middleware memeriksa header host dan IP whitelist sebelum merender halaman admin.
5. **Penanganan Rahasia:** Jangan pernah melakukan commit file `.env`, Kunci Privat Master Admin, atau server key Midtrans ke repositori kode git publik.

---

## 23. Glosarium Terpadu

| Istilah | Penjelasan Teknis |
|---|---|
| **Dual-Layer Privacy** | Model arsitektur di mana antarmuka pengguna mempresentasikan privasi mutlak (E2EE), sementara infrastruktur backend menyertakan kapabilitas pengawasan dan telemetri bagi Superadmin. |
| **Dual-Envelope Escrow** | Teknik pembungkusan ganda Data Encryption Key (DEK): satu salinan kunci diserahkan ke penerima via fragment URL, salinan lainnya dienkripsi asimetris dengan Kunci Publik Admin. |
| **Steganografi LSB** | Teknik menyisipkan bit-bit ciphertext ke dalam bit terendah (Least Significant Bit) piksel warna gambar atau sampel audio tanpa mengubah tampilan visual atau suara. |
| **Shamir's Secret Sharing** | Skema kriptografi yang membagi rahasia menjadi $N$ pecahan kunci di atas medan Galois $GF(2^8)$, di mana rahasia hanya bisa direkonstruksi jika terkumpul minimal $K$ pecahan ($k\text{-of-}n$ threshold). |
| **RFC 3161 Timestamping** | Standar internet untuk otoritas penandatanganan cap waktu digital resmi yang membuktikan bahwa suatu data hash sudah ada sebelum waktu tertentu secara hukum. |
| **Hold-to-Reveal** | Mekanisme interaksi UI di mana teks rahasia hanya terbuka dari efek blur selama pengguna menekan/menyentuh layar sentuh untuk mencegah tangkapan layar penuh. |
| **Dynamic Rolling QR** | QR Code yang matriks gambarnya diperbarui setiap 15 detik berbasis TOTP untuk mencegah pencurian akses melalui foto atau screenshot. |
| **Haversine Geofencing** | Perhitungan trigonometri sferis untuk memverifikasi apakah koordinat GPS penerima berada dalam batas radius aman fisik sebelum pesan didekripsi. |
| **Secret Drop Box** | Kotak aduan rahasia dua arah berbasis slug kustom dan enkripsi asimetris dengan token tanda terima (*Receipt Token*) tanpa membuka identitas pelapor. |
| **Ghost Chat** | Bilik obrolan real-time ephemeral 2 arah berbasis WebSocket relay yang otomatis musnah dari memori begitu ruangan ditutup. |
| **.krx Container** | Format wadah binary berekstensi `.krx` yang menyimpan transkrip obrolan atau dokumen terenkripsi mandiri berstandar AES-256-GCM + Argon2id. |
| **Time-Lock Capsule** | Mekanisme enkripsi di mana data ditahan oleh kebijakan kriptografis server sehingga tidak dapat dibuka oleh siapapun sebelum tanggal/waktu rilis yang ditentukan. |
| **Secret Drop** | Halaman kotak aduan publik yang menerima pesan terenkripsi secara asimetris dari whistleblower anonim disertai penerbitan *Receipt Token Code*. |
| **Dead Man's Switch** | Mekanisme otomatisasi yang melepaskan pesan atau kunci rahasia ke kontak darurat jika pengguna gagal melakukan konfirmasi detak (*heartbeat check-in*) dalam jangka waktu tertentu. |
| **Duress Passphrase** | Sandi paksaan yang jika dimasukkan akan menampilkan data palsu (*decoy*) dan secara diam-diam menghapus data asli demi melindungi pengguna dari intimidasi fisik. |
| **Identity Stitching** | Prosedur otomatis database yang menghubungkan rekam jejak aktivitas pengunjung anonim masa lalu ke profil akun pengguna baru saat registrasi atau login. |
| **Crypto-Shredding** | Tindakan memusnahkan data secara permanen dengan menghapus fisik ciphertext atau kunci dekripsi terkait dari media penyimpanan. |

---

## 24. Referensi Teknis yang Perlu Digunakan

- Next.js Documentation: https://nextjs.org/docs
- W3C Web Crypto API Specification: https://www.w3.org/TR/WebCryptoAPI/
- RFC 9106 (Argon2 Memory-Hard Function for Password Hashing): https://www.rfc-editor.org/rfc/rfc9106
- RFC 3161 (Internet X.509 Public Key Infrastructure Time-Stamp Protocol): https://www.rfc-editor.org/rfc/rfc3161
- Shamir, Adi. "How to share a secret." Communications of the ACM 22.11 (1979): 612-613.
- MaxMind GeoLite2 City and ASN Database: https://dev.maxmind.com/geoip/geolite2-free-geolocation-data
- Midtrans Snap API & Webhook Signature Integration Guide: https://docs.midtrans.com/
- OWASP Top 10 Web Application Security Risks: https://owasp.org/www-project-top-ten/
- Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
- ISO/IEC 37002 (Whistleblowing Management Systems — Guidelines).

---

## 25. Penutup

Dokumen spesifikasi v3.0 ini telah menyelesaikan penggabungan seluruh portofolio inovasi privasi, alur logika operasional, arsitektur kriptografi multi-skema, model monetisasi terpadu, dan skema database relasional untuk **Kryphix (The Ultimate Ephemeral Secrecy Suite)**.

Dengan menggabungkan portofolio inovasi kerahasiaan terkurasi (Steganografi, Screen Shield, Geo-Fence, Shamir's Multi-Sign, Dynamic Rolling QR, Blind Notary, Decoy Masquerade, Ephemeral Video, Proof of Shredding, Canary Leak-Trap, Developer CLI Pipe, Time-Lock Vault, Scrambled Voice, AI Sanitizer, Secret Drop Box, dan Dead Man's Switch) dengan fondasi arsitektur **100% Home Server Docker di belakang CGNAT (Cloudflare Tunnel)**, antarmuka bawaan **Clean Bright White Cyberpunk**, serta didukung **Panel Admin Terisolasi** berarsitektur *Dual-Layer Privacy*, Kryphix kini memiliki daya saing produk yang tak tertandingi, biaya server Rp0/bulan, margin laba bersih >98%, sangat berkesan bagi pengguna, dan siap dieksekusi tanpa halusinasi.
