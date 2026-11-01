import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Clone headers for response manipulation
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 1. Telemetry & 5-Tier Cookies Injection
  const isHttps = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const krxVid = request.cookies.get("_krx_vid")?.value;
  const krxSid = request.cookies.get("_krx_sid")?.value;

  const newVid = krxVid || crypto.randomUUID();
  const newSid = krxSid || crypto.randomUUID();

  // Set-Cookie on response if missing
  if (!krxVid) {
    response.cookies.set("_krx_vid", newVid, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false, // Accessible to entropy collector script
      sameSite: "lax",
      secure: isHttps,
    });
  }

  if (!krxSid) {
    response.cookies.set("_krx_sid", newSid, {
      path: "/",
      maxAge: 1800, // 30 minutes
      httpOnly: false,
      sameSite: "lax",
      secure: isHttps,
    });
  }

  // 2. Subdomain Routing: Nexus Console (Admin Subdomain)
  const isAdminDomain =
    host.startsWith("nexus-console.") ||
    host === "nexus-console.kryphix.my.id" ||
    host === "nexus-console.localhost";

  // If hitting admin subdomain
  if (isAdminDomain) {
    // If accessing root on admin domain, rewrite to /admin
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url, { headers: response.headers });
    }
    // If accessing any path on admin domain, prefix with /admin if not already
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next") && !pathname.startsWith("/images") && !pathname.startsWith("/icons")) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url, { headers: response.headers });
    }
  } else {
    // On the main domain: If user directly navigates to /admin, redirect to isolated console (unless testing on localhost)
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
    if (pathname.startsWith("/admin") && !isLocalhost) {
      const adminUrl = new URL(request.url);
      if (process.env.NODE_ENV === "production") {
        adminUrl.hostname = "nexus-console.kryphix.my.id";
      } else {
        adminUrl.hostname = "nexus-console.localhost";
      }
      return NextResponse.redirect(adminUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons (public static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|icons|scripts).*)",
  ],
};

