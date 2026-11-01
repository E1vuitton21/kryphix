import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("_krx_admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        createdByUser: { select: { id: true, email: true, displayName: true } },
        senderVisitor: { select: { visitorId: true, firstIp: true, deviceCategory: true } },
        accessLogs: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });

    const sanitized = messages.map((m) => ({
      id: m.id,
      capabilityHash: m.capabilityHash,
      status: m.status,
      maxViews: m.maxViews,
      viewsRemaining: m.viewsRemaining,
      hasPassphrase: m.hasPassphrase,
      screenShieldEnabled: m.screenShieldEnabled,
      hasAttachment: m.hasAttachment,
      attachmentName: m.attachmentName,
      user: m.createdByUser,
      visitor: m.senderVisitor,
      accessLogsCount: m.accessLogs.length,
      createdAt: m.createdAt,
      expiresAt: m.expiresAt,
      burnedAt: m.burnedAt,
      hasCiphertext: m.ciphertextBlob.length > 0,
    }));

    return NextResponse.json({ messages: sanitized });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

