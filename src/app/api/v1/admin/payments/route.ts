import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.paymentOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        user: { select: { id: true, email: true, displayName: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

