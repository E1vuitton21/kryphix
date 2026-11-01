import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateSecureSlug, hashSha256 } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const box = await prisma.secretDropBox.findUnique({
      where: { boxSlug: slug },
      select: {
        id: true,
        boxSlug: true,
        title: true,
        description: true,
        isActive: true,
        expiresAt: true,
      },
    });

    if (!box || !box.isActive || new Date() > new Date(box.expiresAt)) {
      return NextResponse.json({ message: "Kotak aduan tidak ditemukan atau telah ditutup" }, { status: 404 });
    }

    return NextResponse.json({ box });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { encryptedPayload } = body;

    if (!encryptedPayload) {
      return NextResponse.json({ message: "Konten aduan rahasia wajib diisi" }, { status: 400 });
    }

    const box = await prisma.secretDropBox.findUnique({
      where: { boxSlug: slug },
    });

    if (!box || !box.isActive || new Date() > new Date(box.expiresAt)) {
      return NextResponse.json({ message: "Kotak aduan tidak ditemukan atau telah ditutup" }, { status: 404 });
    }

    const rawReceiptToken = generateSecureSlug(24);
    const receiptTokenHash = hashSha256(rawReceiptToken);

    await prisma.dropMessage.create({
      data: {
        boxId: box.id,
        receiptTokenHash,
        ciphertextBlob: new Uint8Array(Buffer.from(encryptedPayload, "utf-8")),
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      receiptToken: rawReceiptToken,
      message: "Laporan rahasia berhasil dikirimkan ke kotak aduan anonim.",
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

