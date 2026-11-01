import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const configs = await prisma.systemConfig.findMany({
      orderBy: { configKey: "asc" },
    });

    const packages = await prisma.tokenPackage.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ configs, packages });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminSession = JSON.parse(Buffer.from(adminToken, "base64url").toString("utf-8"));
    const clientIp = getClientIpFromHeaders(request.headers);
    const body = await request.json();
    const { configKey, configValue } = body;

    if (!configKey) {
      return NextResponse.json({ message: "Config key is required" }, { status: 400 });
    }

    const updated = await prisma.systemConfig.upsert({
      where: { configKey },
      update: { configValue, updatedAt: new Date() },
      create: { configKey, configValue },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminUserId: adminSession.adminId,
        action: "UPDATE_SYSTEM_CONFIG",
        targetType: "CONFIG",
        targetId: configKey,
        reason: `Memperbarui parameter konfigurasi ${configKey}`,
        ipAddress: clientIp,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

