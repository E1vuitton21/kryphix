import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateSecureSlug, hashSha256 } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const polls = await prisma.blindPoll.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        _count: { select: { votes: true } },
      },
    });

    return NextResponse.json({ polls });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("_krx_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    const body = await request.json();
    const { title, options } = body;

    if (!title || !options || options.length < 2) {
      return NextResponse.json({ message: "Judul dan minimal 2 opsi voting wajib diisi" }, { status: 400 });
    }

    const pollSlug = generateSecureSlug(12);

    const poll = await prisma.blindPoll.create({
      data: {
        pollSlug,
        title: title.trim(),
        publicPaillierKey: "PAILLIER_HOMOMORPHIC_PUB_2048",
        optionsJson: options,
        totalEligibleVoters: 100,
        ownerUserId: payload.userId,
      },
    });

    return NextResponse.json({ success: true, poll }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

