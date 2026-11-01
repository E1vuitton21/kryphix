import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    const switches = await prisma.deadManSwitch.findMany({
      where: { ownerUserId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    const sanitized = switches.map((s) => ({
      ...s,
      ciphertextPayload: `[PROTECTED_BLOB: ${s.ciphertextPayload.length} bytes]`,
    }));

    return NextResponse.json({ switches: sanitized });
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
    const { title, payloadText, checkInFrequencyDays = 30, recipientEmail } = body;

    if (!title || !payloadText || !recipientEmail) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const now = new Date();
    const nextCheckInDeadline = new Date(
      now.getTime() + checkInFrequencyDays * 24 * 60 * 60 * 1000
    );

    const dms = await prisma.deadManSwitch.create({
      data: {
        ownerUserId: payload.userId,
        title: title.trim(),
        ciphertextPayload: new Uint8Array(Buffer.from(payloadText, "utf-8")),
        checkInFrequencyDays: Number(checkInFrequencyDays),
        lastCheckInAt: now,
        nextCheckInDeadline,
        recipientEmail: recipientEmail.trim(),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, dms }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { switchId } = body;

    const current = await prisma.deadManSwitch.findUnique({ where: { id: switchId } });
    if (!current) return NextResponse.json({ message: "Switch tidak ditemukan" }, { status: 404 });

    const now = new Date();
    const newDeadline = new Date(
      now.getTime() + current.checkInFrequencyDays * 24 * 60 * 60 * 1000
    );

    const updated = await prisma.deadManSwitch.update({
      where: { id: switchId },
      data: {
        lastCheckInAt: now,
        nextCheckInDeadline: newDeadline,
        escalationStage: 0,
      },
    });

    return NextResponse.json({ success: true, message: "Check-in berhasil tercatat!", updated });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}
