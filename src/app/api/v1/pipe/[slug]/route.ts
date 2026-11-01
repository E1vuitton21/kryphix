import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { decryptAes256Gcm } from "@/lib/crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const keyFromHeader = request.headers.get("x-pipe-key");

    const pipe = await prisma.cliPipe.findUnique({
      where: { pipeSlug: slug },
    });

    if (!pipe || pipe.downloadCount >= pipe.maxDownloads || new Date() > pipe.expiresAt) {
      return new NextResponse("Error: Secret pipe already burned or expired (0 Byte Retained)\n", {
        status: 410,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const payload = Buffer.from(pipe.encryptedPayload);
    const iv = Buffer.from(payload.subarray(0, 12));
    const authTag = Buffer.from(payload.subarray(12, 28));
    const ciphertext = Buffer.from(payload.subarray(28));

    // If key provided in header or client decrypts
    let outputText = "";
    if (keyFromHeader) {
      try {
        const key = Buffer.from(keyFromHeader, "hex");
        const decrypted = decryptAes256Gcm(ciphertext, key, iv, authTag);
        outputText = decrypted.toString("utf-8") + "\n";
      } catch {
        outputText = "[Error: Decryption failed - invalid key]\n";
      }
    } else {
      outputText = `[ENCRYPTED_BLOB_BASE64: ${ciphertext.toString("base64")}]\n[IV: ${iv.toString("base64")}]\n[AUTHTAG: ${authTag.toString("base64")}]\n`;
    }

    // Burn pipe DoD Zeroize
    await prisma.cliPipe.update({
      where: { id: pipe.id },
      data: {
        downloadCount: { increment: 1 },
        encryptedPayload: new Uint8Array(0),
      },
    });

    return new NextResponse(outputText, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}\n`, { status: 500 });
  }
}
