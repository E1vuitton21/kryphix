import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        wallet: true,
        linkedVisitors: {
          select: {
            visitorId: true,
            fingerprintHash: true,
            firstIp: true,
            deviceCategory: true,
            lastSeenAt: true,
          },
        },
        _count: {
          select: {
            messages: true,
            stegoItems: true,
            vaultItems: true,
            canaryTraps: true,
            paymentOrders: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

