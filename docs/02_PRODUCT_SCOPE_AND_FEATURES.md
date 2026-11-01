# MODUL 02: RUANG LINGKUP PRODUK & SPESIFIKASI FITUR FUNGSIONAL
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** 6 Pilar Fungsional Produk + 2 Pilar Infrastruktur Pengawasan (18 Inovasi Web Murni Terkurasi)

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
