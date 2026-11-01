import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [
      totalVisitors,
      totalUsers,
      totalMessages,
      shreddedMessages,
      settledOrders,
      activeChatRooms,
      recentEvents,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.visitorTrack.count(),
      prisma.user.count(),
      prisma.message.count(),
      prisma.message.count({ where: { status: "BURNED" } }),
      prisma.paymentOrder.findMany({ where: { status: "SETTLED" } }),
      prisma.chatRoom.count({ where: { status: "ACTIVE" } }),
      prisma.visitorEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
        include: { visitor: { select: { visitorId: true, firstIp: true, deviceCategory: true } } },
      }),
      prisma.adminAuditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const totalRevenueRupiah = settledOrders.reduce((acc, curr) => acc + curr.amountRupiah, 0);

    const serializedEvents = recentEvents.map((e) => ({
      ...e,
      id: e.id.toString(),
    }));

    const serializedAuditLogs = recentAuditLogs.map((l) => ({
      ...l,
      id: l.id.toString(),
    }));

    return NextResponse.json({
      metrics: {
        totalVisitors,
        totalUsers,
        totalMessages,
        shreddedMessages,
        totalOrdersCount: settledOrders.length,
        totalRevenueRupiah,
        activeChatRooms,
      },
      recentEvents: serializedEvents,
      recentAuditLogs: serializedAuditLogs,
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ message: "Error fetching admin stats", error: err.message }, { status: 500 });
  }
}

