import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPasswordPbkdf2 } from "@/lib/crypto";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "Username dan password wajib diisi" }, { status: 400 });
    }

    const clientIp = getClientIpFromHeaders(request.headers);

    // Find admin by username or email
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username: username.trim() }, { email: username.trim().toLowerCase() }],
        isActive: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ message: "Kredensial operator tidak valid" }, { status: 401 });
    }

    const isMatch = verifyPasswordPbkdf2(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ message: "Kredensial operator tidak valid" }, { status: 401 });
    }

    // Update login info
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: clientIp,
      },
    });

    // Record audit log
    await prisma.adminAuditLog.create({
      data: {
        adminUserId: admin.id,
        action: "ADMIN_LOGIN_SUCCESS",
        targetType: "AUTH",
        targetId: admin.id,
        reason: "Berhasil masuk ke konsol Nexus Operator",
        ipAddress: clientIp,
      },
    });

    // Session payload
    const sessionPayload = {
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      loginAt: Date.now(),
    };
    const adminSessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString("base64url");

    const response = NextResponse.json({
      success: true,
      message: "Otorisasi operator berhasil",
      admin: {
        id: admin.id,
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
      },
    });

    const isHttps = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
    response.cookies.set("_krx_admin_token", adminSessionToken, {
      path: "/",
      maxAge: 12 * 60 * 60, // 12 hours
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
    });

    return response;
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json({ message: "Gagal memproses otentikasi admin", error: err.message }, { status: 500 });
  }
}

