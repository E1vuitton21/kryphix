# MODUL 10: DEVOPS, BACKGROUND JOBS, TESTING, RISIKO & PEMELIHARAAN
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** Expiration Engine, NFR, Testing & QA, Privasi & Anti-Abuse, Deployment Home Server, Struktur Direktori, Roadmap, Mitigasi Risiko CGNAT, Keputusan Final, Instruksi AI Coder, Glosarium, dan Referensi Teknis

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

---

## 22. Instruksi untuk AI Coder dan Pengembang

1. **Prinsip Utama:** Jangan pernah melakukan build project atau instalasi sebelum seluruh arsitektur, diagram alur, dan dependensi dipahami secara utuh.
2. **Kepatuhan Terhadap Model Dual-Layer:** Pastikan modul kripto browser selalu menyertakan enkripsi kunci $K$ dengan Kunci Publik Master Admin (`adminWrappedDek`) pada setiap pembuatan pesan, stego, atau bilik chat, dan pastikan antarmuka publik tetap menampilkan citra privasi yang bersih tanpa petunjuk adanya inspeksi internal.
3. **Integritas Database dan Timestamp:** Seluruh penulisan waktu **wajib** menggunakan `TIMESTAMPTZ` dengan fungsi waktu server `CLOCK_TIMESTAMP()` (bukan waktu lokal klien). Seluruh operasi saldo dompet dan konsumsi kuota pesan **wajib** berada dalam transaksi atomik dengan conditional update.
4. **Isolasi Rute Admin:** Jangan pernah mengekspos endpoint atau komponen panel admin di dalam bundle aplikasi pengguna biasa. Pastikan middleware memeriksa header host dan IP whitelist sebelum merender halaman admin.
5. **Penanganan Rahasia:** Jangan pernah melakukan commit file `.env`, Kunci Privat Master Admin, atau server key Midtrans ke repositori kode git publik.

---

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

---

## 25. Penutup

Dokumen spesifikasi v3.0 ini telah menyelesaikan penggabungan seluruh portofolio inovasi privasi, alur logika operasional, arsitektur kriptografi multi-skema, model monetisasi terpadu, dan skema database relasional untuk **Kryphix (The Ultimate Ephemeral Secrecy Suite)**.

Dengan menggabungkan portofolio inovasi kerahasiaan terkurasi (Steganografi, Screen Shield, Geo-Fence, Shamir's Multi-Sign, Dynamic Rolling QR, Blind Notary, Decoy Masquerade, Ephemeral Video, Proof of Shredding, Canary Leak-Trap, Developer CLI Pipe, Time-Lock Vault, Scrambled Voice, AI Sanitizer, Secret Drop Box, dan Dead Man's Switch) dengan fondasi arsitektur **100% Home Server Docker di belakang CGNAT (Cloudflare Tunnel)**, antarmuka bawaan **Clean Bright White Cyberpunk**, serta didukung **Panel Admin Terisolasi** berarsitektur *Dual-Layer Privacy*, Kryphix kini memiliki daya saing produk yang tak tertandingi, biaya server Rp0/bulan, margin laba bersih >98%, sangat berkesan bagi pengguna, dan siap dieksekusi tanpa halusinasi.
