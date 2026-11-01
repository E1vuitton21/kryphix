# MODUL 09: PUSAT PENGAWASAN OPERASIONAL SUPERADMIN (NEXUS CONSOLE)
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Domain Terisolasi:** `https://nexus-console.kryphix.my.id`  
> **Keamanan Gate:** IP Whitelist, 2FA TOTP Wajib, Sesi Admin Terpisah, Master Admin Key Escrow

---

## 1. Arsitektur Isolasi Mutlak Nexus Console
- **Subdomain Terpisah:** Seluruh antarmuka admin di-host eksklusif pada `nexus-console.kryphix.my.id`.
- **Proteksi Caddy Reverse-Proxy:** Hanya alamat IP yang terdaftar pada whitelist yang diizinkan melakukan handshake TLS ke subdomain admin.
- **Tabel Kredensial Independen:** Menggunakan tabel `admin_users` dan `admin_sessions` yang 100% terpisah dari tabel `users` umum.
- **2FA TOTP Wajib:** Setiap login mewajibkan verifikasi kode 6 digit dari aplikasi authenticator (Google Authenticator / Aegis).
- **Session Auto-Timeout:** Sesi admin kedaluwarsa otomatis setelah 15 menit nir-aktivitas.

---

## 2. Modul Fungsional Utama Nexus Console

### 2.1 Live Visitor Surveillance Radar
- Menampilkan grafik radar real-time pengunjung yang sedang aktif di `kryphix.my.id`.
- Data telemetri: IP publik, resolusi GeoLite2 (Kota, Negara, ISP/ASN), kategori perangkat (Mobile/Desktop), dan sidik jari perangkat keras (`_krx_fp`).

### 2.2 User 360° Surveillance & Identity Stitching Inspector
- Linimasa microsecond vertikal per pengguna:
  - Detik pertama mendarat sebagai pengunjung anonim (`_krx_vid`).
  - Jejak halaman yang dikunjungi (`visitor_events`).
  - Titik waktu registrasi akun dan pengaitan otomatis (*Identity Stitching*).
  - Riwayat pembelian token Midtrans dan riwayat pembuatan pesan rahasia.
- Tombol Aksi Administratif: *Suspend Account*, *Force Logout*, dan *Manual Token Adjustment*.

### 2.3 Stealth Message & Chat Inspector (Master Escrow Decryptor)
- Katalog pesan rahasia dan bilik chat yang sedang aktif di seluruh sistem.
- **Fitur Dekripsi Plaintext (Master Admin Key Escrow):**
  - Superadmin memasukkan Kunci Privat Master Admin (RSA-OAEP) untuk mendekripsi `adminWrappedDek`.
  - Sistem menampilkan plaintext isi pesan dan lampiran berkas seketika di layar admin.
  - *Catatan Kepatuhan:* Fitur ini disiapkan khusus untuk audit internal, investigasi panggilan penegak hukum, dan pencegahan eksploitasi kejahatan siber berat / terorisme.
- **Emergency Force Shred:** Tombol darurat untuk menghapus paksa pesan dari server dan memusnahkan ciphertext seketika.

### 2.4 Dynamic CMS Desk (No-Code Content Management)
- Editor no-code untuk mengubah konten landing page secara live tanpa deploy ulang:
  - Headline & Subheadline Hero Section.
  - Teks Berjalan (*Marquee Alert Banner*).
  - Pertanyaan & Jawaban (*FAQ Management*).
  - SEO Metadata & OpenGraph Tags.

### 2.5 Core Service Configurator & Financial Payment Desk
- Pengaturan tarif token pesan dan layanan spionase secara dinamis.
- Saklar pemeliharaan (*Maintenance Switch*): Global atau per modul layanan.
- Monitoring transaksi Midtrans live dengan tombol *Force-Reconcile* pembayaran yang tertunda.
- Audit pembukuan buku besar (*Token Ledger*) dan ringkasan laba bersih bulanan.
