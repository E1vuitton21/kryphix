# MODUL 06: MODEL BISNIS, SISTEM TOKEN, PEMBAYARAN MIDTRANS & HITUNGAN FINANSIAL
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** Nilai Token (1 Token = Rp500), Curated Master Pricing Matrix, Paket Topup Prabayar, Langganan VIP Bulanan, Integrasi Payment Gateway Midtrans Snap, dan Simulasi Keuntungan Bersih Home Server (>98%)

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
