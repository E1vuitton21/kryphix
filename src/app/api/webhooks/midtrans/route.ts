import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyMidtransSignature, mapMidtransStatus } from "@/lib/midtrans";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
      settlement_time,
    } = payload;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json({ message: "Payload webhook tidak lengkap" }, { status: 400 });
    }

    // 1. Verify Midtrans Signature
    const isValidSignature = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValidSignature) {
      console.warn("⚠️ Invalid Midtrans Webhook signature received for order:", order_id);
      return NextResponse.json({ message: "Tanda tangan signature tidak valid" }, { status: 403 });
    }

    // 2. Find PaymentOrder
    const order = await prisma.paymentOrder.findUnique({
      where: { orderId: order_id },
    });

    if (!order) {
      return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // 3. Map status
    const mappedStatus = mapMidtransStatus(transaction_status, fraud_status);

    // 4. Handle SETTLED
    if (mappedStatus === "SETTLED") {
      // Idempotency check: only credit if still pending
      if (order.status !== "SETTLED") {
        await prisma.$transaction(async (tx) => {
          // Update order
          await tx.paymentOrder.update({
            where: { id: order.id },
            data: {
              status: "SETTLED",
              midtransTransactionId: transaction_id,
              paymentType: payment_type,
              settlementTime: settlement_time ? new Date(settlement_time) : new Date(),
            },
          });

          // Update user wallet
          const updatedWallet = await tx.wallet.update({
            where: { userId: order.userId },
            data: {
              balanceTokens: { increment: order.tokensToCredit },
              lifetimeTokensPurchased: { increment: order.tokensToCredit },
            },
          });

          // Insert into TokenLedger
          await tx.tokenLedger.create({
            data: {
              userId: order.userId,
              amountTokens: order.tokensToCredit,
              balanceAfter: updatedWallet.balanceTokens,
              entryType: "CREDIT",
              referenceType: "MIDTRANS_PURCHASE",
              referenceId: order.orderId,
              description: `Top up berhasil via ${payment_type || "Midtrans"} (${order.tokensToCredit} Token KRX)`,
              idempotencyKey: `idemp-${order.orderId}`,
            },
          });
        });
        console.log(`✅ [Midtrans Webhook] Order ${order.orderId} settled. Credited ${order.tokensToCredit} tokens to ${order.userId}`);
      }
    } else if (mappedStatus === "FAILED" || mappedStatus === "EXPIRED") {
      if (order.status === "PENDING") {
        await prisma.paymentOrder.update({
          where: { id: order.id },
          data: { status: mappedStatus },
        });
      }
    }

    return NextResponse.json({ status: "OK", orderId: order_id, result: mappedStatus });
  } catch (err: any) {
    console.error("Midtrans webhook processing error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal webhook", error: err.message },
      { status: 500 }
    );
  }
}

