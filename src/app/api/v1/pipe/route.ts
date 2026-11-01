import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { encryptAes256Gcm, generateRandomDek } from "@/lib/crypto";
import { generateSecureSlug, getClientIpFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let rawPayload = "";

    if (contentType.includes("application/json")) {
      const json = await request.json();
      rawPayload = json.payload || json.data || JSON.stringify(json);
    } else {
      rawPayload = await request.text();
    }

    if (!rawPayload.trim()) {
      return new NextResponse("Error: Empty payload piped\n", { status: 400 });
    }

    const dek = generateRandomDek();
    const { ciphertext, iv, authTag } = encryptAes256Gcm(rawPayload, dek);

    // Combine iv (12) + authTag (16) + ciphertext
    const combined = Buffer.concat([iv, authTag, ciphertext]);
    const pipeSlug = generateSecureSlug(12);
    const clientIp = getClientIpFromHeaders(request.headers);
    const userAgent = request.headers.get("user-agent") || "curl";

    await prisma.cliPipe.create({
      data: {
        pipeSlug,
        encryptedPayload: new Uint8Array(combined),
        sizeBytes: combined.length,
        burnAfterRead: true,
        downloadCount: 0,
        maxDownloads: 1,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdIp: clientIp,
        userAgent,
      },
    });

    const host = request.headers.get("host") || "kryphix.my.id";
    const protocol = host.includes("localhost") ? "http" : "https";
    const keyHex = dek.toString("hex");

    // Terminal plain output
    const returnUrl = `${protocol}://${host}/api/v1/pipe/${pipeSlug}#${keyHex}\n`;
    return new NextResponse(returnUrl, {
      status: 201,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}\n`, { status: 500 });
  }
}
