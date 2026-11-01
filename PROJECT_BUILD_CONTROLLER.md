# PROJECT BUILD CONTROLLER — KRYPHIX PRIVACY PLATFORM
> **Nama Proyek:** Kryphix (The Ultimate Ephemeral Secrecy, Anti-Forensic, and Privacy Suite)  
> **Status Proyek Saat Ini:** `PRODUCTION_READY` (Build Selesai & Terverifikasi 100% Bebas Error — 50 Rute Static/Dynamic Terkompilasi)  
> **Target Arsitektur:** 100% Home Server Mandiri (Docker Containerized), Jaringan CGNAT via Cloudflare Tunnel Gratis (Biaya Server Rp0/bulan)  
> **Gaya Desain Default:** Clean Bright White Cyberpunk (`#FFFFFF`, `#0F172A`, `#00D2FF`, `#FF007F`, `#7928CA`, `#FFB800`)  
> **Dukungan Tampilan:** Native Responsive Mobile & Desktop (Thumb-Friendly Touch Targets & Multi-Deck Cyber Cockpit)  
> **Dokumen Rujukan Terpadu:** `rancangan.md` & Direktori Modular `docs/` (Modul 01 s/d 10)

---

## 1. Tujuan & Fungsi File Controller Ini

File ini bertindak sebagai **Sumber Kebenaran Tunggal (Single Source of Truth) Pengendali Proyek** selama proses build nanti. File ini dibuat untuk:
1. **Mencegah Halusinasi & Ambiguitas:** Menetapkan batasan teknis dan arsitektur yang tidak dapat diubah oleh AI Coder atau pengembang.
2. **Menjaga Konteks di Tengah Jalan:** Setiap pergantian sesi atau fase build tidak akan kehilangan konteks arsitektur, basis data, atau model bisnis.
3. **Mengontrol Kualitas & Progres secara Terukur:** Setiap tahapan (Phase 0 s.d. Phase 8) memiliki checklist tugas eksplisit, kriteria penerimaan (*Acceptance Criteria*), dan status ketercapaian.
4. **Memastikan Peletakan Asset Konten Presisi:** Seluruh asset gambar, maskot, dan ilustrasi di `/asset/` memiliki koordinat peletakan yang jelas pada komponen antarmuka.

---

## 2. Peta Dokumen Spesifikasi Modular (`docs/`)

Spesifikasi lengkap telah dipecah menjadi 10 modul terstruktur di direktori [`docs/`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs):

| Modul | Nama File Dokumentasi | Fokus & Tanggung Jawab Isi |
|:---:|:---|:---|
| **01** | [`01_ARCHITECTURE_AND_INFRASTRUCTURE.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/01_ARCHITECTURE_AND_INFRASTRUCTURE.md) | Visi produk, topologi Home Server di balik CGNAT, Cloudflare Tunnel, Caddy, dan konfigurasi `docker-compose.yml`. |
| **02** | [`02_PRODUCT_SCOPE_AND_FEATURES.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/02_PRODUCT_SCOPE_AND_FEATURES.md) | Ruang lingkup 6 pilar fungsional produk, aktor sistem, dan rincian spesifikasi kebutuhan (FR-SEC s/d FR-ADM). |
| **03** | [`03_USER_FLOWS_AND_LIFECYCLE.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/03_USER_FLOWS_AND_LIFECYCLE.md) | Alur interaksi pengirim, penerima (*Hold-to-Reveal*), Steganografi, Ghost Chat, Time-Lock, Canary Trap, dan mesin siklus hidup pesan. |
| **04** | [`04_SECURITY_AND_CRYPTOGRAPHY.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/04_SECURITY_AND_CRYPTOGRAPHY.md) | Dual-Layer Privacy, Dual-Envelope Admin Key Escrow, Web Crypto AES-256-GCM, Drand Timelock, Paillier Homomorfik, Shamir, LSB, dan DoD Zeroing. |
| **05** | [`05_DATABASE_AND_STORAGE_SCHEMA.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/05_DATABASE_AND_STORAGE_SCHEMA.md) | Skema DDL lengkap 39 tabel PostgreSQL, indeks performa, foreign keys, presisi `TIMESTAMPTZ`, dan struktur bucket lokal MinIO S3. |
| **06** | [`06_BUSINESS_TOKENOMICS_AND_MIDTRANS.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/06_BUSINESS_TOKENOMICS_AND_MIDTRANS.md) | Nilai token (1 Token = Rp500), Master Pricing Matrix, Paket Topup, Langganan VIP, integrasi Midtrans Snap, dan simulasi laba (>98%). |
| **07** | [`07_API_AND_INTEGRATION_CONTRACTS.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/07_API_AND_INTEGRATION_CONTRACTS.md) | 44 kontrak endpoint: User-Facing API, Stealth Telemetry API, dan Isolated Superadmin Nexus API. |
| **08** | [`08_UIUX_DESIGN_AND_ASSET_MAPPING.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/08_UIUX_DESIGN_AND_ASSET_MAPPING.md) | Design token Clean Bright White Cyberpunk, responsive mobile bottom-nav, desktop multi-deck cockpit, dan matriks penempatan seluruh asset `/asset/`. |
| **09** | [`09_SUPERADMIN_NEXUS_CONSOLE.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/09_SUPERADMIN_NEXUS_CONSOLE.md) | Konsol terisolasi `nexus-console.kryphix.my.id`, IP Whitelist, 2FA TOTP, User 360°, Stealth Inspector (Master Escrow Decryptor), dan Dynamic CMS. |
| **10** | [`10_DEVOPS_RISKS_AND_MAINTENANCE.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/docs/10_DEVOPS_RISKS_AND_MAINTENANCE.md) | Background jobs, NFR, Testing & QA, Privasi, Struktur Direktori, Roadmap, Mitigasi Risiko Home Server & CGNAT, Glosarium, dan Referensi. |

---

## 3. Matriks Penempatan Asset & Ilustrasi Resmi (`/asset/`)

Seluruh asset di folder `asset/` wajib ditempatkan sesuai peruntukan fungsional berikut:

| Nama Berkas Asset | Format & Ukuran | Rute Halaman / Komponen Target | Peran Tata Letak & Petunjuk Implementasi |
|:---|:---:|:---|:---|
| **`kryphix-icon.ico`** | ICO (432 KB) | Global Root (`app/favicon.ico`) | Favicon tab browser, shortcut PWA, icon bookmark, dan desktop notification icon. |
| **`kryphix-navbar.jpg`** | JPG (1.4 MB) | Header Referensi Layout | Layout acuan: Logo di kiri, navigasi tengah, dan pill saldo dompet token di kanan. |
| **`kryphix-maskot-welcome-rbg.png`** | PNG Transparan (163 KB) | Landing Page Hero (`/`) & Auth Dialogs | Maskot agen menyambut pengguna di Hero Section sebelah kanan headline, di modal registrasi/login, dan dialog onboarding. |
| **`kryphix-maskot-welcome.jpg`** | JPG (1.45 MB) | Dashboard (`/dashboard`) | Background banner kartu ucapan selamat datang bagi pengguna baru. |
| **`kryphix-maskot-payment-rbg.png`** | PNG Transparan (270 KB) | Dompet (`/wallet`) & Checkout Midtrans | Maskot memegang token; tampil di popup modal Midtrans Snap dan di samping tabel pilihan paket top-up token. |
| **`kryphix-maskot-payment.jpg`** | JPG (1.8 MB) | Tab Langganan VIP (`/wallet`) | Banner header kartu promosi paket langganan VIP bulanan (*Ghost Sentinel, Cyber Operative, Shadow Syndicate*). |
| **`kryphix-maskot-horray-rbg.png`** | PNG Transparan (170 KB) | Dialog Sukses & Konfirmasi Selesai | Maskot selebrasi sukses; muncul saat: Pembayaran token berhasil terkonfirmasi, Pesan rahasia siap dibagikan (*"Link Siap Disalin!"*), dan Sertifikat Pemusnahan terbit. |
| **`kryphix-maskot-horray.jpg`** | JPG (1.76 MB) | Layar Notifikasi Transaksi Berhasil | Gambar ilustrasi kartu bukti tanda terima pembayaran atau penyelesaian misi. |
| **`kryphix-ilustartion-1.jpg`** | JPG (4.3 MB) | Feature Showcase 1: Core Secrets | Kartu fitur Landing Page untuk layanan **Kryphix Secrets** (Pesan Teks & Dokumen Sekali Buka). |
| **`kryphix-ilustartion-2.jpg`** | JPG (5.7 MB) | Feature Showcase 2: Ghost Chat | Kartu fitur Landing Page untuk layanan **Ghost Chat Real-Time** (Bilik Obrolan dengan Panic Button). |
| **`kryphix-ilustartion-3.jpg`** | JPG (4.4 MB) | Feature Showcase 3: Time-Lock Vault | Kartu fitur Landing Page untuk layanan **Holographic Time-Lock Vault** & **Shamir's Multi-Sign**. |
| **`kryphix-ilustartion-4.jpg`** | JPG (1.6 MB) | Feature Showcase 4: Anti-Forensic | Kartu fitur Landing Page untuk layanan **Anti-Forensic Screen Shield** & **Steganografi Studio**. |
| **`kryphix-ilustartion-1kryphix-ilustartion-5.jpg`**| JPG (4.8 MB) | Feature Showcase 5: Canary Trap | Kartu fitur Landing Page untuk layanan **Canary Leak-Trap** (Pelacak Pembocor Dokumen Rahasia). |
| **`kryphix-ilustartion-6.jpg`** | JPG (2.6 MB) | Feature Showcase 6: Secret Drop & DMS | Kartu fitur Landing Page untuk layanan **Secret Drop Box** (Kotak Aduan Anonim) & **Dead Man's Switch**. |

---

## 4. Sepuluh Hukum & Guardrails Non-Negotiable (Pencegah Halusinasi)

AI Coder dan Pengembang **DILARANG KERAS** melanggar 10 aturan fundamental ini saat proses build:
1. **Zero External Paid Cloud:** Dilarang mengimpor SDK atau mengonfigurasi layanan cloud berbayar (AWS S3, Cloudflare R2, Wasabi, Backblaze B2). Seluruh penyimpanan berkas wajib menggunakan kontainer lokal **MinIO S3** di Home Server.
2. **Zero Inbound Port 25 SMTP:** Dilarang membuat mail server penerima email atau fitur *Burner Email* karena port 25 diblokir total oleh ISP rumahan di jaringan CGNAT. Notifikasi sistem wajib menggunakan Bot Telegram (port 443 HTTPS).
3. **Zero Broken Web APIs on iOS/Desktop:** Dilarang mengimplementasikan fitur yang tidak didukung browser Apple iOS Safari atau peramban desktop (misal: Web NFC `NDEFReader` atau modulasi suara ultrasonik).
4. **Dual-Layer Privacy Model:** Tampilan publik wajib 100% Zero-Knowledge di mata user. Kunci Master Admin Escrow (`adminWrappedDek`) dan Kunci Privat RSA-OAEP Admin **TIDAK BOLEH PERNAH** bocor atau dibundle ke dalam JavaScript sisi klien (`client bundle`).
5. **Universal Strict Time Precision:** Seluruh kolom waktu wajib menggunakan tipe PostgreSQL `TIMESTAMPTZ` dengan fungsi server `CLOCK_TIMESTAMP()` (bukan waktu lokal perangkat klien).
6. **Atomic Financial & View Counter Operations:** Seluruh pemotongan saldo token dan kuota tayang pesan wajib menggunakan transaksi atomik dengan *conditional update* (`UPDATE ... SET views_remaining = views_remaining - 1 WHERE views_remaining > 0`).
7. **Clean Bright White Cyberpunk by Default:** Tema bawaan sistem adalah latar putih bersih (`#FFFFFF` & `#F8FAFC`) dengan aksen neon estetik (`#00D2FF`, `#FF007F`, `#7928CA`, `#FFB800`). Dark mode hanya sebagai opsi alternatif sekunder.
8. **Mobile & Desktop Native Responsive:** Seluruh antarmuka wajib mendukung navigasi bawah (*Floating Bottom Nav*) dengan tap target minimal 48px pada mobile, dan layout kokpit multi-kolom dengan pintasan keyboard (`Ctrl+K`, `Esc 3x`) pada desktop.
9. **Isolated Nexus Admin Console:** Rute admin di `nexus-console.kryphix.my.id` wajib terisolasi penuh dari rute publik. Dilindungi oleh middleware pengecekan host header, IP Whitelist, tabel `admin_users` independen, dan 2FA TOTP wajib.
10. **Zero Scaffolding Without Authorization:** Dilarang menjalankan perintah inisialisasi kode (`npx create-next-app`, `npm install`, `docker compose up`) sebelum instruksi *Build Phase* diberikan secara eksplisit oleh Pengguna.

---

## 5. Checklist Pelacakan Progres Pembangunan (Phase 0 s/d Phase 8)

Status Indikator: `PENDING` (Belum Dikerjakan) | `IN_PROGRESS` (Sedang Dikerjakan) | `VERIFIED` (Selesai & Terverifikasi)

### Phase 0 — Setup Home Server & Orkestrasi Docker CGNAT Bypass
- [x] **P0-1:** Buat file `docker-compose.yml` terpadu memuat 6 kontainer: `cloudflared`, `caddy`, `app`, `postgres`, `redis`, `minio`. `[VERIFIED]`
- [x] **P0-2:** Buat file konfigurasi reverse-proxy `Caddyfile` dengan routing host ganda (`kryphix.my.id` dan `nexus-console.kryphix.my.id`). `[VERIFIED]`
- [x] **P0-3:** Setup file variabel lingkungan `.env.example` dengan seluruh kunci rahasia (Master Admin Keys, Midtrans Keys, S3 Keys). `[VERIFIED]`
- [x] **P0-4:** Uji coba koneksi terowongan Cloudflare Tunnel (`cloudflared`) menembus CGNAT tanpa port-forwarding router. `[VERIFIED]`
- [x] **P0-5:** Verifikasi resolusi SSL/TLS otomatis dan proteksi DDoS dari Cloudflare Edge. `[VERIFIED]`

### Phase 1 — Fondasi Database, Redis & MinIO Local S3
- [x] **P1-1:** Buat file skema Prisma `prisma/schema.prisma` mencakup seluruh **39 Tabel Database PostgreSQL Terpadu**. `[VERIFIED]`
- [x] **P1-2:** Eksekusi migrasi awal database `prisma migrate dev --name init_v3_schema` / Prisma Client Generation. `[VERIFIED]`
- [x] **P1-3:** Inisialisasi bucket lokal MinIO `kryphix-vault-blobs` dengan policy privat terenkripsi. `[VERIFIED]`
- [x] **P1-4:** Download dan letakkan database biner offline MaxMind `GeoLite2-City.mmdb` dan `GeoLite2-ASN.mmdb` di `public/geo/`. `[VERIFIED]`
- [x] **P1-5:** Setup helper koneksi singleton Prisma Client, Redis Client, dan MinIO S3 Client di `src/lib/`. `[VERIFIED]`
- [x] **P1-6:** Seeding data awal: Paket Token (`token_packages`), Konfigurasi Sistem (`system_configs`), dan CMS Default (`landing_cms_configs`). `[VERIFIED]`

### Phase 2 — Pelacakan Pengunjung, Identity Stitching & Otentikasi
- [x] **P2-1:** Buat script browser client-side `public/scripts/security-entropy.js` untuk ekstraksi sidik jari perangkat (`_krx_fp`). `[VERIFIED]`
- [x] **P2-2:** Implementasi middleware Next.js untuk inject first-party cookies bertingkat (`_krx_vid`, `_krx_sid`, `_krx_jny`). `[VERIFIED]`
- [x] **P2-3:** Buat endpoint `/api/v1/telemetry/heartbeat` dengan resolusi instan IP GeoLite2 (<1 ms di memori). `[VERIFIED]`
- [x] **P2-4:** Buat alur otentikasi pengguna (`/register`, `/login`) dengan hashing Argon2id/PBKDF2 dan verifikasi kode akun. `[VERIFIED]`
- [x] **P2-5:** Implementasi logika otomatis *Identity Stitching* (`VisitorTrack.linked_user_id = User.id`) saat registrasi atau login. `[VERIFIED]`
- [x] **P2-6:** Logika otomatis pemberian 6 Token gratis (*Welcome Credit*) ke wallet pengguna baru. `[VERIFIED]`

### Phase 3 — Panel Admin Terisolasi (Nexus Console)
- [x] **P3-1:** Isolasi rute subdomain `nexus-console.kryphix.my.id` di middleware Next.js dengan verifikasi IP Whitelist. `[VERIFIED]`
- [x] **P3-2:** Login admin terpisah dengan verifikasi password hash Argon2id/PBKDF2 dan validasi kode 2FA TOTP (RFC 6238). `[VERIFIED]`
- [x] **P3-3:** Dashboard *Live Visitor Surveillance Radar* dengan stream data pengunjung aktif real-time. `[VERIFIED]`
- [x] **P3-4:** Halaman *User 360° Surveillance Inspector* dengan linimasa vertikal microsecond per pengguna. `[VERIFIED]`
- [x] **P3-5:** Halaman *Stealth Message & Content Inspector* dengan fitur dekripsi plaintext via Master Admin Escrow Key & tombol *Emergency Force Shred*. `[VERIFIED]`
- [x] **P3-6:** Halaman *Dynamic CMS Controller* (editing headline hero, alert marquee, FAQ) dan *Financial Payment Desk*. `[VERIFIED]`

### Phase 4 — Core Secrets, Screen Shield, Decoy Link & Duress
- [x] **P4-1:** Form pembuatan pesan rahasia (`/secrets/new` & `InstantSecretCreator`) dengan kalkulasi biaya token dinamis. `[VERIFIED]`
- [x] **P4-2:** Modul Web Crypto browser untuk enkripsi AES-256-GCM dan pembungkusan kunci ganda (`adminWrappedDek`). `[VERIFIED]`
- [x] **P4-3:** Komponen *Anti-Forensic Screen Shield* (overlay watermark dinamis transparan dan mode sentuh *Hold-to-Reveal*). `[VERIFIED]`
- [x] **P4-4:** Modul *Decoy Link Masquerade* (URL kamuflase artikel blog resep masakan dengan pemicu sentuhan tersembunyi). `[VERIFIED]`
- [x] **P4-5:** Fitur *Duress Passphrase* (sandi paksaan yang menampilkan pesan palsu decoy). `[VERIFIED]`
- [x] **P4-6:** Halaman penerima (`/n/:slug#<K>`) dengan cangkang interstitial anti-bot preview dan pemotongan kuota atomik saat tombol buka ditekan. `[VERIFIED]`

### Phase 5 — Steganografi Citra & Audio, Dynamic QR, CLI Pipe & Proof of Shredding
- [x] **P5-1:** Studio Steganografi Canvas 2D (penyisipan ciphertext AES-256 ke LSB piksel gambar PNG). `[VERIFIED]`
- [x] **P5-2:** Steganografi Audio & LSB carrier extraction di memori browser. `[VERIFIED]`
- [x] **P5-3:** Komponen *Dynamic Rolling QR Code* berbasis HMAC-TOTP dan opsi *Single-Scan Burn*. `[VERIFIED]`
- [x] **P5-4:** Endpoint cURL terminal *Developer CLI Secret Pipe* (`/api/v1/pipe`) dengan respons terminal plain string. `[VERIFIED]`
- [x] **P5-5:** Mesin pemusnahan memori RAM server DoD 5220.22-M (zeroing 3-pass) saat pesan dihancurkan. `[VERIFIED]`
- [x] **P5-6:** Generator resmi *Certificate of Cryptographic Shredding* bertanda tangan Ed25519 dan rute verifikasi publik `/verify-shred`. `[VERIFIED]`

### Phase 6 — Ghost Chat Real-Time, Scrambled Voice, AI Sanitizer & Kapsul Waktu
- [x] **P6-1:** Bilik *Ghost Chat Real-Time* via Redis RAM Storage dengan hitung mundur durasi ruangan. `[VERIFIED]`
- [x] **P6-2:** Tombol panik instan (*Panic Button*) yang menghancurkan seluruh pesan di RAM seketika. `[VERIFIED]`
- [x] **P6-3:** Fitur *Anti-Peeping Auto-Blur* dan countdown timer room expiration. `[VERIFIED]`
- [x] **P6-4:** Perekam pesan suara 1x dengar dan enkripsi audio blob. `[VERIFIED]`
- [x] **P6-5:** Editor *Stealth Paste Redactor & AI Prompt Sanitizer* menyensor NIK, nomor HP, email, kartu kredit, dan kunci API. `[VERIFIED]`
- [x] **P6-6:** *Time-Lock Vault* terenkripsi client-side dengan penguncian target waktu masa depan. `[VERIFIED]`

### Phase 7 — Shamir's Multi-Sign, Blind Notary, Secret Drop, DMS & Midtrans
- [x] **P7-1:** Modul *Shamir's Secret Sharing* ($k$-of-$n$ polynomial split) dan portal rekonsiliasi pecahan kunci. `[VERIFIED]`
- [x] **P7-2:** Modul *Blind Notary* (penandatanganan hash dokumen via RFC 3161) dan penerbitan kode verifikasi keberadaan digital. `[VERIFIED]`
- [x] **P7-3:** Modul *Secret Drop Box* (kotak aduan anonim dengan asimetris enkripsi). `[VERIFIED]`
- [x] **P7-4:** Modul *Dead Man's Switch* dengan jadwal konfirmasi detak kehidupan (*heartbeat*) dan tombol *I Am Alive*. `[VERIFIED]`
- [x] **P7-5:** Integrasi payment gateway Midtrans Snap untuk paket Top-Up Token dan paket Langganan VIP Bulanan. `[VERIFIED]`
- [x] **P7-6:** Endpoint webhook Midtrans aman dengan validasi signature SHA-512 dan idempotency key. `[VERIFIED]`

### Phase 8 — QA Forensik, Uji Penetrasi Dual-Layer, Optimasi & Produksi
- [x] **P8-1:** Uji penetrasi arsitektur Dual-Layer: memastikan Kunci Master Escrow tidak pernah bocor ke sisi klien. `[VERIFIED]`
- [x] **P8-2:** Uji konkurensi konsumsi kuota view atomik PostgreSQL untuk mencegah race condition. `[VERIFIED]`
- [x] **P8-3:** Uji ketahanan Cloudflare Tunnel saat pemutusan koneksi jaringan rumah (*reconnection stress-test*). `[VERIFIED]`
- [x] **P8-4:** Verifikasi responsif mobile (*bottom nav*, tap target 48px) dan desktop multi-deck cockpit pada seluruh resolusi layar. `[VERIFIED]`
- [x] **P8-5:** Verifikasi penempatan seluruh 14 berkas di direktori `asset/` sesuai matriks tata letak. `[VERIFIED]`
- [x] **P8-6:** Rilis produksi resmi (*Production Build Complete: 50 Routes Static & Dynamic*). `[VERIFIED]`

---

## 6. Riwayat Perubahan & Audit Status

| Tanggal | Versi | Status Proyek | Tindakan yang Telah Dilakukan | Penanggung Jawab |
|:---:|:---:|:---:|:---|:---:|
| **01/11/2026** | **v3.0** | `READY_FOR_BUILD` | • Kurasi total arsitektur untuk Home Server Docker mandiri di balik CGNAT via Cloudflare Tunnel gratis.<br>• Eliminasi fitur cloud berbayar (Multi-cloud shards, Burner email port 25, B2B multi-tenant).<br>• Penetapan tema bawaan Clean Bright White Cyberpunk (Mobile & Desktop).<br>• Pemetaan 14 file asset di `/asset/`.<br>• Pemecahan `rancangan.md` menjadi 10 modul terstruktur di `docs/`.<br>• Pembuatan file controller `PROJECT_BUILD_CONTROLLER.md`. | System Architect |
| **01/11/2026** | **v3.0-PROD** | `PRODUCTION_READY` | • Full implementasi end-to-end Phase 0 s/d Phase 8.<br>• 39 tabel PostgreSQL schema Prisma tervalidasi & client terkompilasi.<br>• 50 rute Next.js 15 (App Router) static & dynamic berhasil di-build tanpa error (`npm run build`).<br>• Subdomain terisolasi `nexus-console.kryphix.my.id` dengan Stealth Escrow Inspector.<br>• Integrasi Midtrans Snap & Webhook signature SHA-512.<br>• Seluruh 14 aset grafis di `/asset/` aktif terpasang di antarmuka web. | Lead Engineer |

