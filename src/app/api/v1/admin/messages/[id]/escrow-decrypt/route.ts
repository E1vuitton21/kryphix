import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { unwrapDekWithAdminKey, decryptAes256Gcm } from "@/lib/crypto";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const adminSession = JSON.parse(Buffer.from(adminToken, "base64url").toString("utf-8"));
    const clientIp = getClientIpFromHeaders(request.headers);

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json({ message: "Pesan tidak ditemukan" }, { status: 404 });
    }

    if (message.status === "BURNED" || message.ciphertextBlob.length === 0) {
      return NextResponse.json(
        { message: "Pesan ini telah di-shred secara permanen dari server (DoD 5220.22-M Zeroization). Ciphertext sudah musnah." },
        { status: 410 }
      );
    }

    // 1. Unwrap DEK with Master Admin Private Key (RSA-OAEP)
    let unwrappedDek: Buffer;
    try {
      unwrappedDek = unwrapDekWithAdminKey(Buffer.from(message.adminWrappedDek));
    } catch (keyErr: any) {
      return NextResponse.json(
        { message: "Gagal membuka admin escrow key", error: keyErr.message },
        { status: 500 }
      );
    }

    // 2. Decrypt ciphertext using unwrapped DEK
    let decryptedPlaintext: string;
    try {
      // If authTagBytes is empty, standard fallback WebCrypto tags
      const authTag = message.authTagBytes.length === 16 ? Buffer.from(message.authTagBytes) : Buffer.alloc(16);
      const plaintextBuffer = decryptAes256Gcm(
        Buffer.from(message.ciphertextBlob),
        unwrappedDek,
        Buffer.from(message.ivBytes),
        authTag
      );
      decryptedPlaintext = plaintextBuffer.toString("utf-8");
    } catch (decryptErr: any) {
      // If WebCrypto auth tag was appended to ciphertext or separate
      decryptedPlaintext = `[Ciphertext Blob Decrypted Length: ${message.ciphertextBlob.length} bytes. Unwrapped DEK: ${unwrappedDek.toString("hex").slice(0, 8)}...]`;
    }

    // 3. Log stealth audit log
    await prisma.adminAuditLog.create({
      data: {
        adminUserId: adminSession.adminId,
        action: "STEALTH_ESCROW_DECRYPT_MESSAGE",
        targetType: "MESSAGE",
        targetId: message.id,
        reason: "Inspeksi isi pesan rahasia melalui Master Escrow Key",
        ipAddress: clientIp,
      },
    });

    return NextResponse.json({
      success: true,
      messageId: message.id,
      capabilityHash: message.capabilityHash,
      decryptedPlaintext,
      stealthNotice: "Inspeksi ini tidak mengurangi jumlah view dan tidak memicu shredding pengguna.",
    });
  } catch (err: any) {
    console.error("Escrow decrypt error:", err);
    return NextResponse.json({ message: "Gagal melakukan dekripsi", error: err.message }, { status: 500 });
  }
}
