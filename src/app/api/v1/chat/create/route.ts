import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { hashSha256 } from "@/lib/crypto";
import { generateSecureSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { durationMinutes = 30, maxParticipants = 2, hostAlias = "Host" } = body;

    const roomId = generateSecureSlug(16);
    const roomCapabilityHash = hashSha256(roomId);
    const secretRoomKey = generateSecureSlug(32); // Shared encryption key living in hash

    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // Check user
    let userId: string | null = null;
    const token = request.cookies.get("_krx_token")?.value;
    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
        userId = payload.userId || null;
      } catch {}
    }

    const krxVid = request.cookies.get("_krx_vid")?.value || null;

    // Create record in DB
    const room = await prisma.chatRoom.create({
      data: {
        roomCapabilityHash,
        durationMinutes: Number(durationMinutes),
        maxParticipants: Number(maxParticipants),
        status: "ACTIVE",
        hostUserId: userId,
        hostVisitorId: krxVid,
        expiresAt,
      },
    });

    // Initialize Redis RAM state with TTL
    const ttlSeconds = durationMinutes * 60;
    try {
      await redis.set(
        `krx:chat:${room.id}:meta`,
        JSON.stringify({
          id: room.id,
          roomId,
          maxParticipants,
          expiresAt: expiresAt.toISOString(),
        }),
        "EX",
        ttlSeconds
      );
    } catch (e) {
      // Non-fatal if Redis connection in lazy mode
    }

    return NextResponse.json({
      success: true,
      roomId,
      secretRoomKey,
      expiresAt,
    }, { status: 201 });
  } catch (err: any) {
    console.error("Chat create error:", err);
    return NextResponse.json({ message: "Gagal membuat bilik obrolan", error: err.message }, { status: 500 });
  }
}
