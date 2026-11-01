# MODUL 08: PANDUAN UI/UX, DESIGN SYSTEM & TATA LETAK ASSET KONTEN
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Tema Desain Default:** Clean Bright White Cyberpunk (`#FFFFFF`, `#0F172A`, `#00D2FF`, `#FF007F`, `#7928CA`, `#FFB800`)  
> **Dukungan Layar:** Mobile-First & Desktop Multi-Deck Native

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

---

### 11.5 Katalog Asset Resmi & Panduan Tata Letak Ilustrasi (/asset/)

Berikut adalah pemetaan penempatan seluruh berkas gambar dan ilustrasi yang berada di direktori `asset/` ke dalam antarmuka aplikasi web Kryphix (Mobile & Desktop):

| Nama Berkas Asset | Format & Ukuran | Komponen / Halaman Target | Penempatan & Peran Tata Letak |
|---|---|---|---|
| **`kryphix-icon.ico`** | ICO (432 KB) | Global Header / Favicon | Icon tab peramban, PWA manifest icon, shortcut bookmark, dan favicon desktop. |
| **`kryphix-navbar.jpg`** | JPG (1.4 MB) | Global Header / Navbar | Referensi layout navigasi desktop & mobile header: penempatan logo di kiri, navigasi tengah, dan pill saldo dompet token di kanan. |
| **`kryphix-maskot-welcome-rbg.png`** | PNG Transparan (163 KB) | Landing Page Hero & Onboarding | Karakter maskot agen menyambut pengguna di Hero Section sebelah kanan headline, di modal registrasi/login, dan onboarding panduan awal. |
| **`kryphix-maskot-welcome.jpg`** | JPG (1.45 MB) | Card Banner & Welcome Card | Ilustrasi latar belakang untuk kartu selamat datang (*Welcome Card*) di dashboard pengguna baru. |
| **`kryphix-maskot-payment-rbg.png`** | PNG Transparan (270 KB) | Halaman Dompet (`/wallet`) & Modal Midtrans | Maskot memegang koin token; ditempatkan di modal checkout Midtrans Snap dan di samping pilihan paket top up token. |
| **`kryphix-maskot-payment.jpg`** | JPG (1.8 MB) | Banner Paket Langganan VIP | Banner header pada tab "Langganan VIP Bulanan" di menu Dompet Token. |
| **`kryphix-maskot-horray-rbg.png`** | PNG Transparan (170 KB) | Dialog Sukses & Konfirmasi | Maskot selebrasi sukses; tampil saat: Pembayaran token berhasil, Pesan rahasia sukses dibuat (*"Link Siap Disalin!"*), dan Sertifikat Pemusnahan terbit. |
| **`kryphix-maskot-horray.jpg`** | JPG (1.76 MB) | Halaman Sukses Transaksi | Gambar kartu notifikasi transaksi sukses di email tanda terima atau layar konfirmasi final. |
| **`kryphix-ilustartion-1.jpg`** | JPG (4.3 MB) | Feature Showcase 1: Core Secrets | Kartu fitur utama di Landing Page untuk layanan **Kryphix Secrets** (Pesan Teks & Dokumen Sekali Buka). |
| **`kryphix-ilustartion-2.jpg`** | JPG (5.7 MB) | Feature Showcase 2: Ghost Chat | Kartu fitur di Landing Page untuk layanan **Kryphix Ghost Chat Real-Time** (Bilik obrolan dengan Panic Button). |
| **`kryphix-ilustartion-3.jpg`** | JPG (4.4 MB) | Feature Showcase 3: Time-Lock Vault | Kartu fitur di Landing Page untuk layanan **Holographic Time-Lock Vault** & **Shamir's Multi-Sign**. |
| **`kryphix-ilustartion-4.jpg`** | JPG (1.6 MB) | Feature Showcase 4: Anti-Forensic | Kartu fitur di Landing Page untuk layanan **Anti-Forensic Screen Shield** & **Steganografi Studio**. |
| **`kryphix-ilustartion-1kryphix-ilustartion-5.jpg`**| JPG (4.8 MB) | Feature Showcase 5: Canary Trap | Kartu fitur di Landing Page untuk layanan **Canary Leak-Trap** (Pelacak Pembocor Dokumen Rahasia). |
| **`kryphix-ilustartion-6.jpg`** | JPG (2.6 MB) | Feature Showcase 6: Secret Drop & DMS | Kartu fitur di Landing Page untuk layanan **Secret Drop Box** (Kotak Aduan Anonim) & **Dead Man's Switch**. |

#### Panduan Teknis Optimasi Asset saat Build:
1. **Versi WebP/AVIF Otomatis:** Gambar JPG besar (1–5 MB) di direktori `asset/` akan dioptimasi otomatis oleh komponen `<Image>` Next.js 15 menjadi format WebP/AVIF modern dengan kompresi terarah (<150 KB) tanpa penurunan ketajaman visual.
2. **Prioritas LCP (Largest Contentful Paint):** Maskot transparan `kryphix-maskot-welcome-rbg.png` pada Hero Section diberi atribut `priority={true}` agar termuat instan dalam <300 ms.

