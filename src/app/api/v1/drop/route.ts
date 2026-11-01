import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateSecureSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    const boxes = await prisma.secretDropBox.findMany({
      where: { ownerUserId: payload.userId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitized = boxes.map((b) => ({
      ...b,
      messages: b.messages.map((m) => ({
        ...m,
        ciphertextBlob: `[ENCRYPTED_SUBMISSION: ${m.ciphertextBlob.length} bytes]`,
      })),
    }));

    return NextResponse.json({ boxes: sanitized });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ message: "Judul kotak aduan wajib diisi" }, { status: 400 });
    }

    const boxSlug = generateSecureSlug(12);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const box = await prisma.secretDropBox.create({
      data: {
        boxSlug,
        title: title.trim(),
        description: description?.trim() || null,
        publicEncryptionKey: "ED25519_KRX_PUBLIC_DROP_ESCROW",
        ownerUserId: payload.userId,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, box }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

