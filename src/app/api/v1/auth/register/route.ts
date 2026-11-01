import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPasswordPbkdf2 } from "@/lib/crypto";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan kata sandi wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const clientIp = getClientIpFromHeaders(request.headers);

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Alamat email sudah terdaftar" }, { status: 409 });
    }

    const passwordHash = hashPasswordPbkdf2(password);

    // Database transaction: Create User + Wallet + Welcome Token Ledger
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          passwordHash,
          displayName: displayName?.trim() || cleanEmail.split("@")[0],
          registeredIp: clientIp,
          status: "ACTIVE",
          vipTier: "NONE",
        },
      });

      // Initialize Wallet with 6 Welcome Tokens
      await tx.wallet.create({
        data: {
          userId: user.id,
          balanceTokens: 6,
          lifetimeTokensPurchased: 0,
          lifetimeTokensSpent: 0,
        },
      });

      // Record welcome bonus in Token Ledger
      await tx.tokenLedger.create({
        data: {
          userId: user.id,
          amountTokens: 6,
          balanceAfter: 6,
          entryType: "CREDIT",
          referenceType: "WELCOME_BONUS",
          referenceId: `welcome-${user.id}`,
          description: "Bonus saldo pendaftaran pengguna baru (6 KRX)",
          idempotencyKey: `idemp-welcome-${user.id}`,
        },
      });

      return user;
    });

    // Identity Stitching: Link _krx_vid cookie to User
    const krxVid = request.cookies.get("_krx_vid")?.value;
    if (krxVid) {
      try {
        await prisma.visitorTrack.update({
          where: { visitorId: krxVid },
          data: { linkedUserId: newUser.id },
        });
      } catch (err) {
        // If visitor record not yet created by heartbeat, non-fatal
      }
    }

    // Create session token payload (base64url JSON or signed token)
    const sessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: "USER",
      createdAt: Date.now(),
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString("base64url");

    const response = NextResponse.json({
      message: "Registrasi berhasil",
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        balanceTokens: 6,
      },
    }, { status: 201 });

    // Set secure auth cookie
    const isHttps = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
    response.cookies.set("_krx_token", sessionToken, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
    });

    return response;
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json({ message: "Gagal memproses pendaftaran", error: err.message }, { status: 500 });
  }
}

