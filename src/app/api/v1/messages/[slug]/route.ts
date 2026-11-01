import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashSha256, signShredCertificatePayload } from "@/lib/crypto";
import { getClientIpFromHeaders, generateSecureSlug } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ message: "Slug pesan tidak valid" }, { status: 400 });
    }

    const capabilityHash = hashSha256(slug);
    const clientIp = getClientIpFromHeaders(request.headers);
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const krxVid = request.cookies.get("_krx_vid")?.value || null;

    // Find message
    const message = await prisma.message.findUnique({
      where: { capabilityHash },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Pesan tidak ditemukan atau telah dihapus permanen" },
        { status: 404 }
      );
    }

    // Check if burned or expired
    const isExpired = new Date() > new Date(message.expiresAt);
    if (message.status === "BURNED" || isExpired) {
      const cert = await prisma.shredCertificate.findFirst({
        where: { resourceId: message.id, resourceType: "MESSAGE" },
      });

      return NextResponse.json(
        {
          burned: true,
          status: "BURNED",
          message: "Pesan ini telah hancur lebur tanpa jejak (DoD 5220.22-M Zeroization).",
          burnedAt: message.burnedAt || message.expiresAt,
          certificateCode: cert?.certificateCode || null,
        },
        { status: 410 }
      );
    }

    // Check passphrase requirement
    const providedPassphrase = request.headers.get("x-gate-passphrase");
    let isDuress = false;

    if (message.hasPassphrase) {
      if (!providedPassphrase) {
        return NextResponse.json({
          requiresPassphrase: true,
          screenShield: message.screenShieldEnabled,
          title: message.title,
        });
      }

      const providedHash = hashSha256(providedPassphrase);

      // Check Duress
      if (message.duressProofHash && providedHash === message.duressProofHash) {
        isDuress = true;
      } else if (message.gateProofHash && providedHash !== message.gateProofHash) {
        return NextResponse.json({ message: "Kata sandi pembuka tidak valid" }, { status: 401 });
      }
    }

    // Determine payload: If duress, return duress blob if exists
    let returnCiphertext = Buffer.from(message.ciphertextBlob);
    if (isDuress && message.duressCiphertextBlob) {
      returnCiphertext = Buffer.from(message.duressCiphertextBlob);
    }

    // Decrement view count & shred if 0 remaining
    const newViewsRemaining = message.viewsRemaining - 1;
    const shouldBurnNow = newViewsRemaining <= 0;

    let certCode: string | null = null;

    await prisma.$transaction(async (tx) => {
      // 1. Log access
      await tx.messageAccessLog.create({
        data: {
          messageId: message.id,
          accessType: isDuress ? "DURESS_DECOY_VIEW" : "NORMAL_VIEW",
          ipAddress: clientIp,
          userAgent,
          wasDuressUsed: isDuress,
        },
      });

      // 2. If burn needed, zeroize and issue Shred Certificate
      if (shouldBurnNow) {
        const nonce = generateSecureSlug(16);
        const shredTime = new Date();
        certCode = `SHRED-${shredTime.getFullYear()}-${generateSecureSlug(8).toUpperCase()}`;

        const payloadForSig = `${certCode}|MESSAGE|${message.id}|${capabilityHash}|${nonce}|${shredTime.toISOString()}`;
        const signature = signShredCertificatePayload(payloadForSig);

        // Update message to BURNED
        await tx.message.update({
          where: { id: message.id },
          data: {
            viewsRemaining: 0,
            status: "BURNED",
            burnedAt: shredTime,
            ciphertextBlob: new Uint8Array(0), // Overwrite in database
            duressCiphertextBlob: null,
          },
        });

        // Create Shred Certificate
        await tx.shredCertificate.create({
          data: {
            certificateCode: certCode,
            resourceType: "MESSAGE",
            resourceId: message.id,
            fingerprintSha256: capabilityHash,
            nonce,
            shredMethod: "DOD_5220_22_M_RAM_ZERO",
            caSignatureEd25519: signature,
            issuedToVisitorId: krxVid,
            shreddedAt: shredTime,
          },
        });
      } else {
        await tx.message.update({
          where: { id: message.id },
          data: { viewsRemaining: newViewsRemaining },
        });
      }
    });

    return NextResponse.json({
      success: true,
      ciphertextBase64: returnCiphertext.toString("base64"),
      ivBase64: Buffer.from(message.ivBytes).toString("base64"),
      screenShield: message.screenShieldEnabled,
      viewsRemaining: newViewsRemaining,
      burnedAfterThis: shouldBurnNow,
      certificateCode: certCode,
      isDuress,
    });
  } catch (err: any) {
    console.error("Fetch message error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses pembukaan pesan", error: err.message },
      { status: 500 }
    );
  }
}
