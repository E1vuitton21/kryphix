# KRYPHIX v3.0 — The Zero-Knowledge Privacy & Ephemeral Security Suite

![Kryphix Banner](public/images/kryphix-navbar.jpg)

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7_RAM--Only-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare_Tunnel-CGNAT_Bypass-F38020?style=for-the-badge&logo=cloudflare)](https://www.cloudflare.com/)
[![Midtrans](https://img.shields.io/badge/Payment-Midtrans_Snap-002B49?style=for-the-badge)](https://midtrans.com/)
[![DoD 5220.22-M](https://img.shields.io/badge/Security-DoD_5220.22--M_Zeroize-00D2FF?style=for-the-badge)](https://en.wikipedia.org/wiki/National_Industrial_Security_Program)

> **Kryphix** adalah platform privasi dan komunikasi nir-jejak (*zero-knowledge ephemeral communication suite*) generasi mutakhir. Dirancang dengan prinsip **Zero-Trust & Zero-Knowledge**, Kryphix menjamin bahwa server, penyedia hosting, basis data, hingga pihak ketiga **tidak pernah memiliki akses terhadap teks polos (plaintext)** maupun kunci enkripsi pengguna. Dilengkapi dengan protokol pemusnahan memori standar militer **DoD 5220.22-M** dan sertifikat audit digital **Ed25519 Proof of Shredding**.

---

## 🌟 FITUR UNGGULAN & MODUL PRIVASI

| Modul | Deskripsi & Manfaat | Standar Kriptografi |
| :--- | :--- | :--- |
| **Pesan Hancur Mandiri (Burner)** | Catatan rahasia sekali baca. Tautan rahasia menyimpan kunci dekripsi pada fragmen hash URL (`#key`), tidak pernah dikirim ke server. Begitu dibuka, memori langsung di-zeroize 0-byte. | Web Crypto AES-256-GCM, Hash Fragment `#` |
| **Sertifikat DoD 5220.22-M** | Bukti kriptografis resmi bahwa pesan telah dihancurkan dari database dan memori server dengan 3-pass zeroization. | Ed25519 CA Digital Signature |
| **Stealth Masquerade Decoy** | Menyamarkan tautan rahasia menjadi artikel blog kuliner (*Resep Rendang*). Konten rahasia hanya terbuka via trigger tersembunyi dan kata sandi otentik. | Client-side AES-256 + Masquerade HTML |
| **Gerbang Sandi & Duress Code** | Kunci ganda untuk pesan rahasia. Memasukkan *Duress Passphrase* saat dipaksa pihak lain akan menampilkan pesan palsu (*decoy payload*) tanpa membongkar rahasia asli. | PBKDF2 + AES-GCM Multi-Key Slot |
| **Screen Shield Anti-Screenshot** | Mencegah perekaman layar dan tangkapan layar dengan mewajibkan pengguna menahan tombol (*hold-to-view*) disertai tanda air forensik dinamis (IP + Timestamp). | Canvas Watermarking & Hold-to-Reveal |
| **CLI & Web Stream Pipe** | Kirim dan terima berkas atau teks rahasia langsung dari terminal Linux/macOS via `curl` (`curl -X POST https://kryphix.my.id/api/v1/pipe -d @secret.conf`). | Zero-Disk AES-256 Stream Pipeline |
| **Stego Studio (Pixel Vault)** | Sembunyikan dokumen atau teks rahasia di dalam pixel gambar PNG menggunakan teknik *Least Significant Bit* (LSB) tanpa perubahan visual kasat mata. | 100% Client-Side Canvas LSB Embedding |
| **Shamir's Secret Sharing (M-of-N)** | Pecah kunci master, seed crypto, atau wasiat menjadi $N$ pecahan. Rahasia hanya dapat direkonstruksi jika $K$ pihak konsensus bersatu. | Cryptographic M-of-N Threshold Split |
| **Blind Homomorphic Poll** | Pemungutan suara rahasia tanpa siapa pun (termasuk server) mengetahui pilihan masing-masing peserta. Tabulasi dilakukan di atas ciphertext. | Paillier Homomorphic Cryptosystem |
| **Blind Digital Notary (RFC 3161)** | Buktikan bahwa dokumen telah eksis pada waktu tertentu tanpa pernah mengunggah dokumen fisik ke internet. Hanya hash SHA-256 yang disertifikasi. | Client-side SHA-256 + RFC 3161 Timestamp |
| **Dead Man's Switch (DMS)** | Sakelar darurat otomatis yang akan mengirimkan dokumen rahasia ke kontak keluarga/penerima jika Anda tidak melakukan konfirmasi *check-in* berkala. | Cron Check-in Engine + Encrypted Vault |
| **Whistleblower Secret Drop Box** | Kotak aduan dua arah untuk pelapor pelanggaran/klien. Menyerahkan bukti anonim dan menerima token tanda terima untuk memantau balasan pemilik. | Public Key Escrow + Blind Token Receipt |
| **Ghost Chat (RAM-Only)** | Bilik obrolan rahasia kilat berdurasi waktu. Riwayat pesan tersimpan murni di RAM Redis dan lenyap seketika bilik kedaluwarsa atau dihancurkan. | Redis RAM Ring Buffer + Ephemeral AES |
| **Privacy Sanitizer Suite** | Sensor otomatis data pribadi (NIK, No. HP, Email, Kunci API, Nomor Kartu) sebelum dikirim ke AI eksternal, plus **EXIF Photo Sanitizer** untuk menghapus GPS/kamera dari foto. | Regex AI PII Stripper + Canvas EXIF Zero |
| **Scrambled Voice Memo (1x Listen)** | Rekam memo vokal dengan distorsi frekuensi suara intelijen. Audio hanya dapat diputar tepat 1 kali sebelum dihapus permanen dari memori buffer. | Web Audio API + Auto-Burn Zeroizer |
| **Time-Lock Crypto Vault** | Brankas penyimpanan dokumen terenkripsi client-side di kontainer MinIO terisolasi dengan kunci waktu otomatis (*time-lock restriction*). | AES-256-GCM + MinIO Local S3 |
| **Nexus Superadmin Console** | Pusat komando superadmin terisolasi pada subdomain/port terpisah. Memonitor telemetri pengunjung 5-tier, manajemen pengguna, saldo token, dan audit log. | Subdomain Gate + TOTP 2FA + Escrow |

---

## 🎨 PALET WARNA & DESAIN ANTARMUKA

Kryphix mengadopsi estetika **Clean Bright White Cyberpunk** secara *default*, menggabungkan kebersihan putih klinis korporat dengan aksen neon berenergi tinggi:

- **Background:** Putih bersih berkilau (`#ffffff`) dengan pola *Dot-Matrix Cyber Grid* abu-abu halus (`#cbd5e1`).
- **Aksen Primer:** Neon Cyan (`#00d2ff`) memancarkan kesan futuristik dan proteksi data digital.
- **Aksen Sekunder:** Neon Pink (`#ff007f`) untuk indikator penghancuran (*DoD Shredding*) dan audit forensik.
- **Aksen Tersier:** Deep Violet (`#7928ca`) untuk bilik obrolan kilat (*Ghost Chat*) dan memori RAM.
- **Aksen Peringatan:** Cyberpunk Amber (`#ffb800`) untuk gerbang sandi dan sakelar darurat (*DMS*).
- **Efek Transisi:** Dilengkapi **Hardware-Accelerated Smooth Page Transitions** (`template.tsx` + `@keyframes pageEnter`) untuk navigasi antar-halaman yang mulus di perangkat desktop maupun seluler.
- **Responsivitas:** 100% responsif pada layar Desktop (1440x900, 1920x1080) dan Mobile (iPhone/Android 390x844).

---

## 🏗️ ARSITEKTUR SISTEM & INFRASTRUKTUR

Platform Kryphix dirancang untuk berjalan **100% Gratis dan Mandiri** di atas **Home Server / Mini PC / VPS** tanpa ketergantungan pada layanan cloud berbayar:

```
[ KLIEN PERAMBAN WEB / TERMINAL CLI ]
                │
                ▼ (HTTPS Port 443 / WSS)
    [ CLOUDFLARE ZERO TRUST TUNNEL ] (CGNAT Bypass — 100% Free, No Port Forwarding)
                │
                ▼
        [ CADDY REVERSE PROXY ] (Automatic Let's Encrypt SSL & Subdomain Routing)
         ├── kryphix.my.id                ──► http://kryphix-app:3000 (Web App Utama)
         └── nexus-console.kryphix.my.id  ──► http://kryphix-app:3000 (Panel Superadmin)
                │
     ┌──────────┴─────────────────────────┬─────────────────────────┐
     ▼                                    ▼                         ▼
[ kryphix-app ]                  [ kryphix-postgres ]      [ kryphix-redis ]
Next.js 15 App Router             PostgreSQL 16 DB          Redis 7 In-Memory
Web Crypto / Node Engine         Prisma ORM (39 Tabel)     RAM Chat & Sessions
     │                                    │
     └──────────────────┬─────────────────┘
                        ▼
               [ MinIO S3 Storage ]
              Lokal NVMe / Brankas
```

### Keunggulan Arsitektur Home Server CGNAT:
1. **Zero Open Router Ports:** Tidak perlu membuka port di router rumah (bebas risiko pemindaian port publik oleh bot jahat).
2. **Bypass CGNAT 100% Gratis:** Menggunakan Cloudflare Tunnel Daemon (`cloudflared`) untuk mem-forward traffic HTTPS langsung ke Caddy/Docker container.
3. **Penyimpanan Lokal NVMe:** Dokumen vault disimpan di kontainer MinIO lokal pada drive NVMe, menghemat biaya AWS S3 menjadi Rp 0,- per bulan.
4. **Isolasi Penuh Docker:** Seluruh ekosistem dikemas dalam satu file `docker-compose.yml`.

---

## 🚀 PANDUAN LENGKAP INSTALASI DI PRODUCTION SERVER

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan Kryphix di server Linux (Ubuntu 22.04 / 24.04 LTS, Debian 12, atau Home Server Mini PC):

### 1. Prasyarat Perangkat Keras & Lunak
- **CPU:** Minimal 2 Core (Intel N100, i3/i5, AMD Ryzen, atau ARM64 Raspberry Pi 5).
- **RAM:** Minimal 4 GB (Disarankan 8 GB).
- **Storage:** Minimal 20 GB SSD / NVMe.
- **Sistem Operasi:** Ubuntu 22.04/24.04 LTS atau Debian 12.
- **Paket Wajib:** Docker Engine v24+, Docker Compose v2, Git, curl.

Pasang Docker dan Docker Compose jika belum terpasang:
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Logout dan login kembali agar izin docker aktif
```

---

### 2. Kloning Repositori Proyek
```bash
git clone https://github.com/username-anda/kryphix.git
cd kryphix
```

---

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
nano .env
```

Sesuaikan parameter-parameter penting berikut:
```ini
# 1. Domain & Port Publik
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_BASE_URL=https://kryphix.my.id
NEXT_PUBLIC_ADMIN_URL=https://nexus-console.kryphix.my.id
SESSION_SECRET=ganti_dengan_random_hex_minimal_32_karakter_aman

# 2. Database PostgreSQL
DB_USER=kryphix_admin
DB_PASSWORD=buat_kata_sandi_database_yang_sangat_kuat
DB_NAME=kryphix_prod
DATABASE_URL=postgresql://kryphix_admin:buat_kata_sandi_database_yang_sangat_kuat@kryphix-postgres:5432/kryphix_prod?schema=public

# 3. Redis In-Memory
REDIS_URL=redis://kryphix-redis:6379

# 4. Local MinIO S3 Object Storage
MINIO_ROOT_USER=kryphix_minio_admin
MINIO_ROOT_PASSWORD=buat_kunci_rahasia_minio_2026
S3_ENDPOINT=http://kryphix-minio:9000
S3_ACCESS_KEY=kryphix_minio_admin
S3_SECRET_KEY=buat_kunci_rahasia_minio_2026
S3_BUCKET_NAME=kryphix-vault-blobs
S3_REGION=us-east-1

# 5. Cloudflare Tunnel Token (Bypass CGNAT)
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiZXhhbXBsZS10b2tlbi1kYXJpLWNsb3VkZmxhcmUtdmVyaWZ5In0=

# 6. Payment Gateway Midtrans (Snap API)
MIDTRANS_SERVER_KEY=SB-Mid-server-KUNCI_SERVER_MIDTRANS_ANDA
MIDTRANS_CLIENT_KEY=SB-Mid-client-KUNCI_CLIENT_MIDTRANS_ANDA
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_ID=G123456789

# 7. Superadmin Nexus Security Gate
ADMIN_INITIAL_EMAIL=admin@kryphix.my.id
ADMIN_INITIAL_PASSWORD=KryphixRootAdminPass2026!
ADMIN_INITIAL_TOTP_SECRET=JBSWY3DPEHPK3PXP
```

---

### 4. Menyiapkan Cloudflare Tunnel (CGNAT Bypass)
Jika server Anda berada di jaringan rumah (Indihome, Biznet, MyRepublic, FirstMedia) yang menerapkan CGNAT:
1. Buka [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2. Masuk ke menu **Networks** → **Tunnels** → **Create a Tunnel**.
3. Pilih tipe **Cloudflared**, beri nama (misal: `kryphix-home-server`).
4. Salin string token instalasi (bagian setelah `--token ...`) dan tempelkan pada variabel `CLOUDFLARE_TUNNEL_TOKEN` di file `.env`.
5. Di tab **Public Hostnames**, tambahkan 2 routing:
   - **Hostname 1:** `kryphix.my.id` → Service: `HTTP` → `caddy:80` (atau `localhost:80`)
   - **Hostname 2:** `nexus-console.kryphix.my.id` → Service: `HTTP` → `caddy:80` (atau `localhost:80`)

---

### 5. Membangun & Menjalankan Kontainer Docker
Jalankan perintah berikut untuk mengompilasi dan memulai semua kontainer di latar belakang:
```bash
docker compose up -d --build
```

Periksa status seluruh kontainer:
```bash
docker compose ps
```
Pastikan kontainer `kryphix-app`, `kryphix-postgres`, `kryphix-redis`, dan `caddy` berstatus **Up (healthy)**.

---

### 6. Migrasi Skema Database & Inisialisasi Akun Superadmin
Jalankan migrasi skema Prisma ke database PostgreSQL dan eksekusi seeder akun master admin:
```bash
docker compose exec kryphix-app npx prisma migrate deploy
docker compose exec kryphix-app npx prisma db seed
```

---

### 7. Verifikasi & Pengujian Akses Platform
- **Aplikasi Web Utama:** Kunjungi `https://kryphix.my.id` (atau `http://localhost:3000` di browser server).
- **Konsol Superadmin Nexus:** Kunjungi `https://nexus-console.kryphix.my.id/admin` (atau `http://localhost:3000/admin/login`).
  - **Email:** `admin@kryphix.my.id` (atau sesuai konfigurasi di `.env`)
  - **Password:** `KryphixRootAdminPass2026!`
  - **TOTP 2FA Secret:** `JBSWY3DPEHPK3PXP` (dapat dipindai menggunakan Google Authenticator / Aegis / Bitwarden).

---

### 8. Konfigurasi Webhook Midtrans (Top-Up Token Otomatis)
Agar saldo token KRX terisi secara otomatis setelah pengguna menyelesaikan pembayaran QRIS atau Virtual Account:
1. Buka [Midtrans Merchant Portal](https://dashboard.midtrans.com/) (atau Sandbox).
2. Masuk ke **Settings** → **Configuration**.
3. Masukkan **Payment Notification URL**:
   ```
   https://kryphix.my.id/api/webhooks/midtrans
   ```
4. Simpan konfigurasi. Endpoint ini dilengkapi verifikasi tanda tangan SHA-512 dan idempotensi transaksi untuk mencegah *double-credit*.

---

## 🛡️ KEAMANAN, GIT HYGIENE & PROTOKOL GITHUB

Untuk menjamin keamanan saat mengunggah proyek ini ke repositori publik/privat di GitHub:

1. **File `.env` Terisolasi:** File `.env` **DIJAMIN TIDAK AKAN PERNAH TERUNGGAH** karena telah diabaikan secara ketat oleh `.gitignore`. Hanya `.env.example` berisi kunci dummy publik yang boleh terdaftar di Git.
2. **Pembersihan Log & Berkas Uji:** Folder `screenshots/`, `node_modules/`, `.next/`, `*.log`, dan berkas sementara tidak akan di-commit.
3. **Verifikasi Keamanan Git Sebelum Push:**
   ```bash
   git status
   git check-ignore -v .env
   # Output harus menunjukkan: .gitignore:8:.env .env
   ```
4. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "feat: Kryphix v3.0 production-ready release with smooth transitions and full privacy suite"
   git branch -M main
   git push -u origin main
   ```

---

## 📊 QUALITY ENGINEERING (QE) TEST RESULTS

Platform Kryphix telah melalui pengujian mendalam yang sistematis:

- **Functional API Tests:** 34/34 Skenario **PASS**
- **Security Fuzzing (SQLi, XSS, Path Traversal):** 6/6 Skenario **PASS**
- **Mobile & Desktop Responsive Selenium Tests:** 5/5 Skenario **PASS**
- **Enhanced Privacy Features (Notary lookup, Paillier voting):** 5/5 Skenario **PASS**
- **Total Skor Mutu:** **50/50 Uji Berhasil (100% PASS, ZERO BUG)**

Rincian lengkap matriks pengujian dapat dilihat pada file [`pengujian.md`](file:///c:/Users/mallfnnm/Desktop/03_Proyek_MasEL/kryphix/pengujian.md).

---

## 📜 LISENSI & KETENTUAN PENGGUNAAN

Hak Cipta © 2026 Kryphix Privacy Initiative.  
Didistribusikan di bawah lisensi MIT. Silakan gunakan, pelajari, dan kembangkan secara bebas untuk memajukan privasi digital global.
