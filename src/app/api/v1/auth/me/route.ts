import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payloadRaw = Buffer.from(token, "base64url").toString("utf-8");
    const session = JSON.parse(payloadRaw);

    if (!session?.userId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { wallet: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        vipTier: user.vipTier,
        balanceTokens: user.wallet?.balanceTokens ?? 0,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 401 });
  }
}

