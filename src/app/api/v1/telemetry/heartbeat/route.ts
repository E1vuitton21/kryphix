import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashSha256 } from "@/lib/crypto";
import { getClientIpFromHeaders } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const {
      visitorId,
      sessionId,
      screenResolution,
      canvasFingerprint,
      webglFingerprint,
      audioFingerprint,
      batteryLevel,
      cpuCores,
      timeZone,
      pageUrl,
      referrerUrl,
      journeyPath,
    } = payload;

    if (!visitorId || !sessionId) {
      return NextResponse.json({ message: "Missing visitor or session id" }, { status: 400 });
    }

    const clientIp = getClientIpFromHeaders(request.headers);
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Combine fingerprints into hardware hash
    const compositeRaw = `${canvasFingerprint || ""}-${webglFingerprint || ""}-${audioFingerprint || ""}-${screenResolution || ""}`;
    const fingerprintHash = hashSha256(compositeRaw);

    // Upsert VisitorTrack
    await prisma.visitorTrack.upsert({
      where: { visitorId },
      update: {
        lastSeenAt: new Date(),
        lastIp: clientIp,
        firstUserAgent: userAgent,
        hardwareCanvasHash: canvasFingerprint ? hashSha256(canvasFingerprint) : null,
        hardwareWebglHash: webglFingerprint ? hashSha256(webglFingerprint) : null,
        hardwareAudioHash: audioFingerprint ? hashSha256(audioFingerprint) : null,
      },
      create: {
        visitorId,
        firstSessionId: sessionId,
        fingerprintHash,
        firstIp: clientIp,
        lastIp: clientIp,
        firstUserAgent: userAgent,
        deviceCategory: screenResolution?.includes("x") && parseInt(screenResolution.split("x")[0]) < 768 ? "MOBILE" : "DESKTOP",
        hardwareCanvasHash: canvasFingerprint ? hashSha256(canvasFingerprint) : null,
        hardwareWebglHash: webglFingerprint ? hashSha256(webglFingerprint) : null,
        hardwareAudioHash: audioFingerprint ? hashSha256(audioFingerprint) : null,
      },
    });

    // Record VisitorEvent
    await prisma.visitorEvent.create({
      data: {
        visitorId,
        sessionId,
        eventName: "PAGE_VIEW",
        pageUrl: pageUrl || "/",
        referrerUrl: referrerUrl || null,
        ipAddress: clientIp,
        metadata: {
          journeyPath,
          batteryLevel,
          cpuCores,
          timeZone,
        },
      },
    });

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (err: any) {
    // Non-blocking telemetry response
    return NextResponse.json({ success: false, error: err.message }, { status: 200 });
  }
}

