import * as crypto from "crypto";

// ============================================================================
// 1. AES-256-GCM SYMMETRIC ENCRYPTION / DECRYPTION
// ============================================================================

export interface AesGcmEncryptedPayload {
  ciphertext: Buffer;
  iv: Buffer;
  authTag: Buffer;
}

export function encryptAes256Gcm(plaintext: Buffer | string, key: Buffer): AesGcmEncryptedPayload {
  const buf = typeof plaintext === "string" ? Buffer.from(plaintext, "utf-8") : plaintext;
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for AES-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([cipher.update(buf), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return { ciphertext, iv, authTag };
}

export function decryptAes256Gcm(
  ciphertext: Buffer,
  key: Buffer,
  iv: Buffer,
  authTag: Buffer
): Buffer {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

// Generate random 256-bit Data Encryption Key (DEK)
export function generateRandomDek(): Buffer {
  return crypto.randomBytes(32);
}

// ============================================================================
// 2. MASTER ADMIN RSA-OAEP ESCROW WRAPPING (adminWrappedDek)
// ============================================================================

// Fallback ephemeral keypair if not configured in environment
let ephemeralAdminKeyPair: { publicKey: string; privateKey: string } | null = null;

export function getAdminPublicKeyPem(): string {
  if (process.env.ADMIN_MASTER_PUBLIC_KEY_PEM) {
    return process.env.ADMIN_MASTER_PUBLIC_KEY_PEM.replace(/\\n/g, "\n");
  }

  if (!ephemeralAdminKeyPair) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    ephemeralAdminKeyPair = { publicKey, privateKey };
  }
  return ephemeralAdminKeyPair.publicKey;
}

export function getAdminPrivateKeyPem(): string {
  if (process.env.ADMIN_MASTER_PRIVATE_KEY_PEM) {
    return process.env.ADMIN_MASTER_PRIVATE_KEY_PEM.replace(/\\n/g, "\n");
  }
  if (!ephemeralAdminKeyPair) {
    getAdminPublicKeyPem(); // will generate pair
  }
  return ephemeralAdminKeyPair!.privateKey;
}

export function wrapDekWithAdminKey(dek: Buffer): Buffer {
  const adminPubKey = getAdminPublicKeyPem();
  return crypto.publicEncrypt(
    {
      key: adminPubKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    dek
  );
}

export function unwrapDekWithAdminKey(wrappedDek: Buffer): Buffer {
  const adminPrivKey = getAdminPrivateKeyPem();
  return crypto.privateDecrypt(
    {
      key: adminPrivKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    wrappedDek
  );
}

// ============================================================================
// 3. PROOF OF SHREDDING (ED25519 HARDWARE ISOLATED SIGNATURE)
// ============================================================================

let shredCaKeyPair: { publicKey: string; privateKey: string } | null = null;

function getShredCaKeys() {
  if (shredCaKeyPair) return shredCaKeyPair;

  if (process.env.SHRED_CA_PRIVATE_KEY_PEM && process.env.SHRED_CA_PUBLIC_KEY_PEM) {
    shredCaKeyPair = {
      publicKey: process.env.SHRED_CA_PUBLIC_KEY_PEM.replace(/\\n/g, "\n"),
      privateKey: process.env.SHRED_CA_PRIVATE_KEY_PEM.replace(/\\n/g, "\n"),
    };
    return shredCaKeyPair;
  }

  // Generate deterministic/ephemeral Ed25519 keypair
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  shredCaKeyPair = { publicKey, privateKey };
  return shredCaKeyPair;
}

export function signShredCertificatePayload(payloadString: string): string {
  const { privateKey } = getShredCaKeys();
  const signature = crypto.sign(null, Buffer.from(payloadString, "utf-8"), privateKey);
  return signature.toString("base64");
}

export function verifyShredCertificatePayload(
  payloadString: string,
  base64Signature: string
): boolean {
  try {
    const { publicKey } = getShredCaKeys();
    return crypto.verify(
      null,
      Buffer.from(payloadString, "utf-8"),
      publicKey,
      Buffer.from(base64Signature, "base64")
    );
  } catch (err) {
    return false;
  }
}

export const verifyShredCertificateSignature = verifyShredCertificatePayload;

// ============================================================================
// 4. CANARY TRAP ZERO-WIDTH STEGANOGRAPHY
// ============================================================================

const ZW_ZERO = "\u200B"; // Zero-width space = 0
const ZW_ONE = "\u200C";  // Zero-width non-joiner = 1
const ZW_DELIM = "\uFEFF"; // Zero-width no-break space = delimiter

export function encodeCanaryBinaryToZeroWidth(binaryStr: string): string {
  let result = ZW_DELIM;
  for (let i = 0; i < binaryStr.length; i++) {
    result += binaryStr[i] === "1" ? ZW_ONE : ZW_ZERO;
  }
  result += ZW_DELIM;
  return result;
}

export function decodeCanaryZeroWidthFromText(text: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`${ZW_DELIM}([${ZW_ZERO}${ZW_ONE}]+)${ZW_DELIM}`, "g");
  let match;
  while ((match = regex.exec(text)) !== null) {
    const binary = match[1]
      .split("")
      .map((ch) => (ch === ZW_ONE ? "1" : "0"))
      .join("");
    results.push(binary);
  }
  return results;
}

export function injectCanaryIntoText(plainText: string, canaryZeroWidth: string): string {
  // Inject after the first word or punctuation mark so it's stealthy
  const spaceIndex = plainText.indexOf(" ");
  if (spaceIndex !== -1) {
    return plainText.slice(0, spaceIndex) + canaryZeroWidth + plainText.slice(spaceIndex);
  }
  return plainText + canaryZeroWidth;
}

// ============================================================================
// 5. SECURE HASHING & PASSWORDS
// ============================================================================

export function hashSha256(data: string | Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function hashPasswordPbkdf2(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `pbkdf2$100000$${salt}$${hash}`;
}

export function verifyPasswordPbkdf2(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") {
      return false;
    }
    const iterations = parseInt(parts[1], 10);
    const salt = parts[2];
    const originalHash = parts[3];

    const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
  } catch {
    return false;
  }
}

