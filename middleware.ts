// Middleware untuk mengatur akses ke area penjual.

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("wis_madang_token")?.value;

  const role = request.cookies.get("wis_madang_role")?.value;

  if (pathname.startsWith("/admin")) {
    if (!token || !role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "penjual") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
