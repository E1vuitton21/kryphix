import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { uploadVaultBlob } from "@/lib/s3";
import { generateSecureSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Silakan login untuk menyimpan berkas di brankas" }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    if (!payload?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, ciphertextBase64, isTimeLocked, unlockAt } = body;

    if (!title || !ciphertextBase64) {
      return NextResponse.json({ message: "Judul dan berkas terenkripsi diperlukan" }, { status: 400 });
    }

    const buffer = Buffer.from(ciphertextBase64, "base64");
    const minioBlobKey = `vault/${payload.userId}/${Date.now()}-${generateSecureSlug(8)}.enc`;

    // Upload to local MinIO container
    await uploadVaultBlob(minioBlobKey, buffer);

    // Save record in database
    const vaultItem = await prisma.vaultItem.create({
      data: {
        title: title.trim(),
        minioBlobKey,
        fileSizeBytes: buffer.length,
        isTimeLocked: Boolean(isTimeLocked),
        unlockAt: unlockAt ? new Date(unlockAt) : null,
        ownerUserId: payload.userId,
      },
    });

    return NextResponse.json({ success: true, vaultItem });
  } catch (err: any) {
    console.error("Vault create error:", err);
    return NextResponse.json({ message: "Gagal menyimpan ke brankas", error: err.message }, { status: 500 });
  }
}

