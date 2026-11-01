import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyShredCertificatePayload } from "@/lib/crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ message: "Parameter kode sertifikat diperlukan" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const cert = await prisma.shredCertificate.findUnique({
      where: { certificateCode: cleanCode },
    });

    if (!cert) {
      return NextResponse.json(
        { message: "Sertifikat penghancuran tidak ditemukan dalam arsip audit publik" },
        { status: 404 }
      );
    }

    // Verify Ed25519 signature
    const payloadForSig = `${cert.certificateCode}|${cert.resourceType}|${cert.resourceId}|${cert.fingerprintSha256}|${cert.nonce}|${cert.shreddedAt.toISOString()}`;
    const isValidSignature = verifyShredCertificatePayload(payloadForSig, cert.caSignatureEd25519);

    // Increment verification counter
    await prisma.shredCertificate.update({
      where: { id: cert.id },
      data: {
        verificationCount: { increment: 1 },
        lastVerifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      valid: true,
      signatureVerified: isValidSignature,
      certificateCode: cert.certificateCode,
      resourceType: cert.resourceType,
      shredMethod: cert.shredMethod,
      shreddedAt: cert.shreddedAt,
      fingerprintSha256: cert.fingerprintSha256,
      caSignatureEd25519: cert.caSignatureEd25519,
      verificationCount: cert.verificationCount + 1,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Gagal memproses verifikasi sertifikat", error: err.message },
      { status: 500 }
    );
  }
}

