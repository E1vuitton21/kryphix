import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPasswordPbkdf2 } from "@/lib/crypto";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan kata sandi wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = getClientIpFromHeaders(request.headers);

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json({ message: "Email atau kata sandi tidak cocok" }, { status: 401 });
    }

    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      return NextResponse.json({ message: "Akun Anda dinonaktifkan oleh administrator" }, { status: 403 });
    }

    const isValid = verifyPasswordPbkdf2(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Email atau kata sandi tidak cocok" }, { status: 401 });
    }

    // Update last IP
    await prisma.user.update({
      where: { id: user.id },
      data: { registeredIp: clientIp },
    });

    // Identity Stitching: Link _krx_vid cookie to User
    const krxVid = request.cookies.get("_krx_vid")?.value;
    if (krxVid) {
      try {
        await prisma.visitorTrack.update({
          where: { visitorId: krxVid },
          data: { linkedUserId: user.id },
        });
      } catch (err) {
        // Non-fatal
      }
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      role: "USER",
      createdAt: Date.now(),
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString("base64url");

    const response = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        balanceTokens: user.wallet?.balanceTokens ?? 0,
      },
    });

    const isHttps = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";

    response.cookies.set("_krx_token", sessionToken, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
    });

    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ message: "Gagal memproses login", error: err.message }, { status: 500 });
  }
}

