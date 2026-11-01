import * as crypto from "crypto";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-KryphixDevKey12345";
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-KryphixDevKey12345";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const SNAP_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export interface CreateSnapTransactionParams {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    first_name: string;
    email: string;
    phone?: string;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export interface SnapResponse {
  token: string;
  redirect_url: string;
}

export async function createSnapTransaction(
  params: CreateSnapTransactionParams
): Promise<SnapResponse> {
  // If Midtrans Server Key is placeholder/sandbox mock, return local Snap simulated session
  if (
    MIDTRANS_SERVER_KEY.includes("XXXXX") ||
    MIDTRANS_SERVER_KEY.includes("dummy") ||
    MIDTRANS_SERVER_KEY.includes("KryphixDevKey")
  ) {
    const mockToken = `snap-sim-${params.orderId}-${crypto.randomBytes(6).toString("hex")}`;
    return {
      token: mockToken,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${mockToken}`,
    };
  }

  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: params.customerDetails,
    item_details: params.itemDetails,
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL || "https://kryphix.my.id"}/wallet?payment=finish&order_id=${params.orderId}`,
      error: `${process.env.NEXT_PUBLIC_APP_URL || "https://kryphix.my.id"}/wallet?payment=error&order_id=${params.orderId}`,
    },
  };

  const response = await fetch(SNAP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans API Error [${response.status}]: ${errorText}`);
  }

  const data = (await response.json()) as SnapResponse;
  return data;
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const rawString = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`;
  const calculatedHash = crypto.createHash("sha512").update(rawString).digest("hex");
  return calculatedHash.toLowerCase() === signatureKey.toLowerCase();
}

export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): "SETTLED" | "PENDING" | "FAILED" | "EXPIRED" {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "SETTLED" : "FAILED";
  }
  if (transactionStatus === "settlement") {
    return "SETTLED";
  }
  if (transactionStatus === "pending") {
    return "PENDING";
  }
  if (transactionStatus === "deny" || transactionStatus === "cancel") {
    return "FAILED";
  }
  if (transactionStatus === "expire") {
    return "EXPIRED";
  }
  return "FAILED";
}

