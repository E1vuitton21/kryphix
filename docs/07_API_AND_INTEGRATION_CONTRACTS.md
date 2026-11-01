# MODUL 07: KONTRAK API & INTEGRASI LAYANAN TERPADU
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** 44 Endpoint Terpadu: User-Facing API, Stealth Telemetry API, dan Isolated Superadmin Nexus API

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
