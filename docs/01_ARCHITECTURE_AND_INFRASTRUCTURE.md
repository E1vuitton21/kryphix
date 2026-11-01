# MODUL 01: ARSITEKTUR SISTEM & INFRASTRUKTUR HOME SERVER (CGNAT-READY)
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Target Infrastruktur:** 100% Home Server Mandiri, Docker Containerized, Jaringan CGNAT via Cloudflare Tunnel Gratis (Biaya Server Rp0/bulan)

---

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
