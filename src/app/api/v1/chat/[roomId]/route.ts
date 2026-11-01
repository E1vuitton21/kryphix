import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { hashSha256 } from "@/lib/crypto";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const roomCapabilityHash = hashSha256(roomId);

    const room = await prisma.chatRoom.findUnique({
      where: { roomCapabilityHash },
    });

    if (!room || room.status !== "ACTIVE" || new Date() > new Date(room.expiresAt)) {
      return NextResponse.json({ message: "Bilik obrolan telah kedaluwarsa atau ditutup", closed: true }, { status: 410 });
    }

    // Read messages from Redis RAM list
    let messages: any[] = [];
    try {
      const rawList = await redis.lrange(`krx:chat:${room.id}:messages`, 0, -1);
      messages = rawList.map((m) => JSON.parse(m));
    } catch {
      messages = [];
    }

    return NextResponse.json({
      room: {
        id: room.id,
        durationMinutes: room.durationMinutes,
        expiresAt: room.expiresAt,
        maxParticipants: room.maxParticipants,
      },
      messages,
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Error fetching chat", error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const body = await request.json();
    const { senderAlias, encryptedContent, action } = body;

    const roomCapabilityHash = hashSha256(roomId);

    const room = await prisma.chatRoom.findUnique({
      where: { roomCapabilityHash },
    });

    if (!room || room.status !== "ACTIVE" || new Date() > new Date(room.expiresAt)) {
      return NextResponse.json({ message: "Bilik obrolan telah kedaluwarsa atau ditutup", closed: true }, { status: 410 });
    }

    // If manual close action (DoD Shred Room)
    if (action === "CLOSE_ROOM") {
      await prisma.chatRoom.update({
        where: { id: room.id },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
          closeReason: "MANUAL_PURGE",
        },
      });

      // Purge Redis keys
      try {
        await redis.del(`krx:chat:${room.id}:messages`);
        await redis.del(`krx:chat:${room.id}:meta`);
      } catch {}

      return NextResponse.json({ success: true, message: "Bilik berhasil dihancurkan tanpa sisa." });
    }

    if (!encryptedContent) {
      return NextResponse.json({ message: "Konten pesan wajib diisi" }, { status: 400 });
    }

    const messageItem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: senderAlias || "Anon",
      content: encryptedContent,
      timestamp: Date.now(),
    };

    // Push to Redis with TTL
    try {
      const remainingSeconds = Math.max(
        10,
        Math.floor((new Date(room.expiresAt).getTime() - Date.now()) / 1000)
      );
      await redis.rpush(`krx:chat:${room.id}:messages`, JSON.stringify(messageItem));
      await redis.expire(`krx:chat:${room.id}:messages`, remainingSeconds);
    } catch {}

    return NextResponse.json({ success: true, message: messageItem });
  } catch (err: any) {
    return NextResponse.json({ message: "Error sending message", error: err.message }, { status: 500 });
  }
}
