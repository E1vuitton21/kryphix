import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { createSnapTransaction } from "@/lib/midtrans";
import { generateSecureSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenPackageId, amountRupiah, tokensToCredit } = body;

    // Check user session
    const token = request.cookies.get("_krx_token")?.value;
    let userId: string | null = null;
    let userEmail = "guest@kryphix.my.id";
    let userName = "Kryphix User";

    if (token) {
      try {
        const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
        userId = payload.userId || null;
        if (userId) {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            userEmail = user.email;
            userName = user.displayName || user.email.split("@")[0];
          }
        }
      } catch {}
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Silakan masuk ke akun Anda terlebih dahulu untuk top up token" },
        { status: 401 }
      );
    }

    const orderId = `KRX-${Date.now()}-${generateSecureSlug(6).toUpperCase()}`;

    // 1. Create Midtrans Snap Transaction
    const snapResponse = await createSnapTransaction({
      orderId,
      grossAmount: amountRupiah,
      customerDetails: {
        first_name: userName,
        email: userEmail,
      },
      itemDetails: [
        {
          id: `PKG-${tokenPackageId || "CUSTOM"}`,
          price: amountRupiah,
          quantity: 1,
          name: `Top Up ${tokensToCredit} Token KRX`,
        },
      ],
    });

    // 2. Save PaymentOrder in database
    await prisma.paymentOrder.create({
      data: {
        orderId,
        userId,
        tokenPackageId: tokenPackageId && !isNaN(Number(tokenPackageId)) ? Number(tokenPackageId) : null,
        amountRupiah: Number(amountRupiah),
        tokensToCredit: Number(tokensToCredit),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      snapToken: snapResponse.token,
      redirectUrl: snapResponse.redirect_url,
    }, { status: 201 });
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { message: "Gagal membuat pesanan pembayaran", error: err.message },
      { status: 500 }
    );
  }
}

