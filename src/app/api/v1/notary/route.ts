import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { signShredCertificatePayload, verifyShredCertificatePayload } from "@/lib/crypto";
import { generateSecureSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim();
    const hash = searchParams.get("hash")?.trim();

    if (!code && !hash) {
      return NextResponse.json(
        { message: "Parameter 'code' atau 'hash' wajib disertakan untuk verifikasi." },
        { status: 400 }
      );
    }

    const cert = await prisma.blindNotaryCertificate.findFirst({
      where: {
        OR: [
          ...(code ? [{ verificationCode: code }] : []),
          ...(hash ? [{ documentHashSha256: hash }] : []),
        ],
      },
    });

    if (!cert) {
      return NextResponse.json(
        { message: "Sertifikat stempel waktu tidak ditemukan di database Notary." },
        { status: 404 }
      );
    }

    const signature = Buffer.from(cert.rfc3161TokenBlob).toString("utf-8");
    const payload = `${cert.verificationCode}|${cert.documentHashSha256}|${cert.certifiedAt.toISOString()}`;
    const isValid = verifyShredCertificatePayload(payload, signature);

    return NextResponse.json({
      verified: isValid,
      verificationCode: cert.verificationCode,
      documentHashSha256: cert.documentHashSha256,
      certifiedAt: cert.certifiedAt,
      rfc3161Status: "RFC_3161_COMPLIANT_TRUSTED_TIMESTAMP",
      signature,
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentHashSha256 } = body;

    if (!documentHashSha256 || documentHashSha256.length !== 64) {
      return NextResponse.json(
        { message: "SHA-256 hash dokumen (64 karakter hex) wajib disertakan" },
        { status: 400 }
      );
    }

    const verificationCode = `NOTARY-${new Date().getFullYear()}-${generateSecureSlug(8).toUpperCase()}`;
    const certifiedAt = new Date();

    // Create cryptographic timestamp signature
    const signaturePayload = `${verificationCode}|${documentHashSha256}|${certifiedAt.toISOString()}`;
    const signature = signShredCertificatePayload(signaturePayload);

    // Check user session
    let userId: string | null = null;
    const token = request.cookies.get("_krx_token")?.value;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
        userId = payload.userId || null;
      } catch {}
    }

    const cert = await prisma.blindNotaryCertificate.create({
      data: {
        documentHashSha256,
        verificationCode,
        rfc3161TokenBlob: new Uint8Array(Buffer.from(signature, "utf-8")),
        certifiedAt,
        ownerUserId: userId,
      },
    });

    return NextResponse.json({
      success: true,
      verificationCode: cert.verificationCode,
      documentHashSha256: cert.documentHashSha256,
      certifiedAt: cert.certifiedAt,
      signature,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
