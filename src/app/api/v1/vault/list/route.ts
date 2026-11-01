import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    if (!payload?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.vaultItem.findMany({
      where: { ownerUserId: payload.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

