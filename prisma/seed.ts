import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Kryphix database with initial configurations, packages, CMS, and admin...");

  // 1. Seed Token Packages
  const packages = [
    {
      id: 1,
      name: "Paket Coba",
      tokenAmount: 25,
      bonusTokens: 0,
      priceRupiah: 15000,
      isPopularBadge: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 2,
      name: "Paket Populer",
      tokenAmount: 100,
      bonusTokens: 20,
      priceRupiah: 49000,
      isPopularBadge: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 3,
      name: "Paket Pro",
      tokenAmount: 350,
      bonusTokens: 100,
      priceRupiah: 149000,
      isPopularBadge: false,
      isActive: true,
      sortOrder: 3,
    },
    {
      id: 4,
      name: "Paket Master",
      tokenAmount: 1000,
      bonusTokens: 350,
      priceRupiah: 399000,
      isPopularBadge: false,
      isActive: true,
      sortOrder: 4,
    },
  ];

  for (const pkg of packages) {
    await prisma.tokenPackage.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg,
    });
  }
  console.log("✅ Token packages seeded (4 tiers).");

  // 2. Seed System Configurations
  const configs = [
    {
      configKey: "FREE_TOKENS_ON_REGISTER",
      configValue: 6,
      description: "Jumlah saldo token gratis instan untuk setiap registrasi akun baru pengguna",
    },
    {
      configKey: "TELEGRAM_ADMIN_NOTIFICATIONS",
      configValue: {
        enabled: false,
        botToken: "",
        chatId: "",
        alertOnDuress: true,
        alertOnCanaryLeak: true,
        alertOnVipPurchase: true,
      },
      description: "Konfigurasi bot telegram webhook notifikasi real-time insiden keamanan dan pembayaran",
    },
    {
      configKey: "MASTER_ADMIN_PUBLIC_KEY",
      configValue: {
        keyType: "RSA-OAEP-4096",
        fingerprint: "krx-admin-root-001",
        note: "Digunakan untuk enkripsi lapis kedua adminWrappedDek pada seluruh pesan rahasia",
      },
      description: "Public key superadmin untuk escrow kriptografis",
    },
    {
      configKey: "SHRED_ALGORITHM_DEFAULT",
      configValue: {
        name: "DOD_5220_22_M_RAM_ZERO",
        passes: 3,
        signatureEngine: "Ed25519-Hardware-Isolated",
      },
      description: "Standar protokol penghancuran memori digital Proof of Shredding",
    },
    {
      configKey: "SECURITY_TELEMETRY_RULES",
      configValue: {
        requireStrictCookies: true,
        blockKnownTorExitNodes: false,
        flagSuspiciousCanvasNoise: true,
        maxFailedPassphraseTries: 5,
      },
      description: "Parameter rules engine pencegahan automasi bot dan deteksi penyerang",
    },
  ];

  for (const cfg of configs) {
    await prisma.systemConfig.upsert({
      where: { configKey: cfg.configKey },
      update: { configValue: cfg.configValue, description: cfg.description },
      create: { configKey: cfg.configKey, configValue: cfg.configValue, description: cfg.description },
    });
  }
  console.log("✅ System configs seeded.");

  // 3. Seed Landing CMS Configurations
  const cmsSections = [
    {
      sectionKey: "hero",
      contentData: {
        badge: "⚡ Zero-Knowledge Ephemeral Secrecy v3.0",
        headline: "Privasi Absolut Nirkrompromi untuk Komunikasi & Dokumen Rahasia",
        subheadline:
          "Enkripsi Client-Side AES-256-GCM sejati, hancur lebur tanpa jejak digital di server. Dilengkapi sertifikasi Proof-of-Shredding DoD 5220.22-M dan perlindungan duress sandi paksaan.",
        mascotUrl: "/images/kryphix-maskot-welcome-rbg.png",
        primaryCtaText: "Buat Pesan Rahasia Instan",
        primaryCtaLink: "/#instant-creator",
        secondaryCtaText: "Pelajari Mekanisme Shred",
        secondaryCtaLink: "/cara-kerja",
        activeUsersMetric: "48,920+",
        shreddedBytesMetric: "128.4 TB",
        zeroDataRetainedMetric: "100%",
      },
    },
    {
      sectionKey: "features",
      contentData: {
        title: "Kedaulatan Privasi dalam Setiap Fitur",
        subtitle: "Dirancang secara matematis tanpa celah kebocoran data di layer server maupun jaringan.",
        items: [
          {
            id: 1,
            title: "Pesan Hancur Mandiri & Screen Shield",
            description: "Pesan terbakar seketika setelah dibaca. Proteksi anti screenshot dengan watermarking dinamis identitas pengunjung.",
            assetUrl: "/images/kryphix-ilustartion-1.jpg",
            tag: "Burn-After-Reading",
          },
          {
            id: 2,
            title: "Steganografi Digital Deep Invisibility",
            description: "Sembunyikan pesan atau berkas rahasia di dalam pixel gambar PNG tanpa perubahan visual yang dapat dideteksi mata manusia.",
            assetUrl: "/images/kryphix-ilustartion-2.jpg",
            tag: "Stego Studio",
          },
          {
            id: 3,
            title: "Ghost Chat P2P Nir-Jejak RAM-Only",
            description: "Bilik obrolan rahasia kilat berdurasi waktu. Semua riwayat teks dan media tersimpan murni di RAM Redis dan lebur saat bilik ditutup.",
            assetUrl: "/images/kryphix-ilustartion-3.jpg",
            tag: "Ghost Protocol",
          },
          {
            id: 4,
            title: "Time-Lock Vault & Shamir Secret Sharing",
            description: "Kunci dokumen berharga hingga waktu masa depan tertentu, atau bagi kunci rahasia menjadi N pecahan (M-of-N threshold).",
            assetUrl: "/images/kryphix-ilustartion-4.jpg",
            tag: "Crypto Vault",
          },
          {
            id: 5,
            title: "Canary Trap & Watermark Forensik",
            description: "Lacak kebocoran internal dengan menyematkan karakter zero-width tak kasat mata unik untuk setiap penerima dokumen.",
            assetUrl: "/images/kryphix-ilustartion-5.jpg",
            tag: "Forensic Audit",
          },
          {
            id: 6,
            title: "Dead Man's Switch & Blind Notary",
            description: "Wasiat data terenkripsi otomatis terkirim jika gagal check-in, dan sertifikasi keberadaan dokumen berbasis stempel waktu RFC 3161.",
            assetUrl: "/images/kryphix-ilustartion-6.jpg",
            tag: "Emergency Escrow",
          },
        ],
      },
    },
    {
      sectionKey: "faq",
      contentData: {
        title: "Pertanyaan yang Sering Diajukan",
        subtitle: "Transparansi penuh mengenai teknologi zero-knowledge dan penanganan data Anda.",
        faqs: [
          {
            q: "Apakah Kryphix benar-benar tidak menyimpan data pesan saya?",
            a: "Kunci dekripsi pesan Anda diproses secara lokal di browser Anda menggunakan Web Crypto API (AES-256-GCM). Begitu batas baca tercapai atau waktu kedaluwarsa habis, ciphertext dan memory buffer dihancurkan seketika menggunakan protokol DoD 5220.22-M Zeroization.",
          },
          {
            q: "Bagaimana cara kerja Sandi Paksaan (Duress Passphrase)?",
            a: "Jika Anda dipaksa membuka pesan, masukkan sandi palsu duress Anda. Kryphix akan menampilkan dokumen pengecoh (decoy) yang telah disiapkan sebelumnya tanpa tanda kecurigaan apa pun.",
          },
          {
            q: "Metode pembayaran apa saja yang didukung untuk top up token?",
            a: "Kami mendukung QRIS instan otomatis (GoPay, OVO, Dana, ShopeePay, BCA, Mandiri) dan Virtual Account bank nasional melalui integrasi resmi Midtrans Snap.",
          },
          {
            q: "Apakah saya harus mendaftar akun untuk mengirim pesan rahasia?",
            a: "Tidak! Anda dapat mengirim pesan rahasia instan langsung dari halaman depan tanpa login. Akun pengguna opsional bagi mereka yang membutuhkan riwayat vault, canary trap, dan fitur lanjutan.",
          },
        ],
      },
    },
  ];

  for (const cms of cmsSections) {
    await prisma.landingCmsConfig.upsert({
      where: { sectionKey: cms.sectionKey },
      update: { contentData: cms.contentData },
      create: { sectionKey: cms.sectionKey, contentData: cms.contentData },
    });
  }
  console.log("✅ Landing CMS configs seeded.");

  // 4. Seed Default Superadmin Account
  // Password hash for: 'KryphixRoot2026!#' (Argon2id or SHA-256 hashed with salt)
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync("KryphixRoot2026!#", salt, 100000, 64, "sha512").toString("hex");
  const storedPasswordHash = `pbkdf2$100000$${salt}$${hash}`;

  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "superadmin@kryphix.my.id";
  const adminUsername = process.env.ADMIN_INITIAL_USERNAME || "kryphix_admin";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      displayName: "Nexus Master Operator",
      role: "SUPERADMIN",
      isActive: true,
      totpEnabled: false, // Initial setup mode allows password login, then prompts TOTP setup
      totpSecretEncrypted: "INITIAL_PENDING_SETUP",
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      displayName: "Nexus Master Operator",
      passwordHash: storedPasswordHash,
      role: "SUPERADMIN",
      isActive: true,
      totpEnabled: false,
      totpSecretEncrypted: "INITIAL_PENDING_SETUP",
    },
  });
  console.log(`✅ Superadmin account initialized: ${adminUsername} (${adminEmail})`);

  console.log("🚀 Kryphix Database Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

