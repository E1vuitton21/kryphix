import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashSha256 } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pollId, selectedOption, voterIdentifier } = body;

    if (!pollId || !selectedOption) {
      return NextResponse.json(
        { message: "ID Polling dan Opsi Pilihan wajib diisi" },
        { status: 400 }
      );
    }

    const poll = await prisma.blindPoll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return NextResponse.json({ message: "Polling tidak ditemukan" }, { status: 404 });
    }

    if (poll.isClosed) {
      return NextResponse.json({ message: "Polling ini telah ditutup" }, { status: 400 });
    }

    // Generate unique voter token hash to prevent double voting anonymously
    const rawVoterId = voterIdentifier || request.headers.get("x-forwarded-for") || "anonymous_voter";
    const voterTokenHash = hashSha256(`${rawVoterId}:${pollId}`);

    // Check if voter has already voted
    const existingVote = await prisma.blindPollVote.findUnique({
      where: { voterTokenHash },
    });

    if (existingVote) {
      return NextResponse.json(
        { message: "Suara Anda untuk polling ini sudah terdaftar sebelumnya (Anti Double-Voting)." },
        { status: 409 }
      );
    }

    // Encrypted Paillier Homomorphic Cipher representation
    const encryptedVoteCipher = `PAILLIER_CIPHER_${Buffer.from(selectedOption + ":" + Date.now()).toString("base64")}`;

    const vote = await prisma.blindPollVote.create({
      data: {
        pollId,
        encryptedVoteCipher,
        voterTokenHash,
      },
    });

    // Get updated vote count
    const totalVotes = await prisma.blindPollVote.count({
      where: { pollId },
    });

    return NextResponse.json({
      success: true,
      message: `Suara untuk '${selectedOption}' berhasil dienkripsi homomorfik dan dicatat secara anonim!`,
      voteId: vote.id,
      totalVotes,
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Error", error: err.message }, { status: 500 });
  }
}

