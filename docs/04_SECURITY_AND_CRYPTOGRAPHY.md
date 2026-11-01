# MODUL 04: ARSITEKTUR KEAMANAN, DUAL-LAYER PRIVACY & KRIPTOGRAFI
> **Proyek:** Kryphix (The Ultimate Ephemeral Secrecy Suite)  
> **Status:** Final Terkurasi — Versi 3.0  
> **Cakupan:** Dual-Layer Privacy Model, Dual-Envelope Admin Key Escrow, Web Crypto AES-256-GCM, Drand Timelock, Paillier Homomorfik, Shamir Split Secret, Steganografi LSB, Unicode Zero-Width, dan DoD 5220.22-M Zeroing

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
