import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const visitors = await prisma.visitorTrack.findMany({
      orderBy: { lastSeenAt: "desc" },
      take: 60,
      include: {
        linkedUser: { select: { id: true, email: true, displayName: true } },
        events: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    const serialized = visitors.map((v) => ({
      ...v,
      events: v.events.map((e) => ({
        ...e,
        id: e.id.toString(),
      })),
    }));

    return NextResponse.json({ visitors: serialized });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

