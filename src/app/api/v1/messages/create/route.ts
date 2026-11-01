import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { wrapDekWithAdminKey, hashSha256, hashPasswordPbkdf2 } from "@/lib/crypto";
import { generateSecureSlug, getClientIpFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ciphertextBase64,
      ivBase64,
      keyHex,
      expiry,
      screenShieldEnabled,
      hasPassphrase,
      passphrase,
      duressPassphrase,
      duressCiphertextBase64,
      decoyTheme,
    } = body;

    if (!ciphertextBase64 || !ivBase64 || !keyHex) {
      return NextResponse.json(
        { message: "Payload ciphertext, IV, dan kunci enkripsi wajib disertakan" },
        { status: 400 }
      );
    }

    // 1. Calculate TTL Date
    const now = new Date();
    let expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // default 24 hours
    let maxViews = 1;

    if (expiry === "1_view") {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days window to open once
      maxViews = 1;
    } else if (expiry === "1_hour") {
      expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
      maxViews = 100;
    } else if (expiry === "24_hours") {
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      maxViews = 100;
    } else if (expiry === "7_days") {
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      maxViews = 100;
    }

    // 2. Generate slug and capability hash
    const slug = generateSecureSlug(20);
    const capabilityHash = hashSha256(slug);

    // 3. Encrypt DEK for Master Admin Escrow
    const dekBuffer = Buffer.from(keyHex, "hex");
    const adminWrappedDek = wrapDekWithAdminKey(dekBuffer);

    // 4. Passphrase hashing for gate proof
    let gateProofHash: string | null = null;
    let duressProofHash: string | null = null;

    if (hasPassphrase && passphrase) {
      gateProofHash = hashSha256(passphrase);
    }
    if (duressPassphrase) {
      duressProofHash = hashSha256(duressPassphrase);
    }

    // 5. Check logged in user or visitor ID
    let userId: string | null = null;
    const token = request.cookies.get("_krx_token")?.value;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
        userId = payload.userId || null;
      } catch {}
    }

    const krxVid = request.cookies.get("_krx_vid")?.value || null;

    // 6. Insert Message into Database
    const messageRecord = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          capabilityHash,
          ciphertextBlob: new Uint8Array(Buffer.from(ciphertextBase64, "base64")),
          ivBytes: new Uint8Array(Buffer.from(ivBase64, "base64")),
          authTagBytes: new Uint8Array(Buffer.alloc(16)), // standard tag length or client provided
          adminWrappedDek: new Uint8Array(adminWrappedDek),
          maxViews,
          viewsRemaining: maxViews,
          hasPassphrase: Boolean(hasPassphrase),
          gateProofHash,
          duressProofHash,
          duressCiphertextBlob: duressCiphertextBase64
            ? new Uint8Array(Buffer.from(duressCiphertextBase64, "base64"))
            : null,
          screenShieldEnabled: Boolean(screenShieldEnabled),
          createdByUserId: userId,
          senderVisitorId: krxVid,
          status: "ACTIVE",
          expiresAt,
        },
      });

      if (decoyTheme && decoyTheme !== "NONE") {
        await tx.decoyMaskedLink.create({
          data: {
            messageId: msg.id,
            maskedSlug: generateSecureSlug(12),
            decoyTheme,
            decoyTitle: "Resep Masakan Spesial Nusantara",
          },
        });
      }

      return msg;
    });

    return NextResponse.json({
      success: true,
      slug,
      expiresAt: messageRecord.expiresAt,
      maxViews: messageRecord.maxViews,
      screenShield: messageRecord.screenShieldEnabled,
    }, { status: 201 });
  } catch (err: any) {
    console.error("Message creation error:", err);
    return NextResponse.json(
      { message: "Gagal membuat pesan rahasia", error: err.message },
      { status: 500 }
    );
  }
}
