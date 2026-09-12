// File untuk middleware yang mengatur akses ke halaman admin berdasarkan token dan role pengguna

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("wis_madang_token")?.value;

  const role = request.cookies.get("wis_madang_role")?.value;

  // Hanya berlaku untuk /admin/*
  if (pathname.startsWith("/admin")) {
    // Belum login
    if (!token || !role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Pelanggan tidak boleh masuk area seller
    if (role === "pelanggan") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Role yang tidak dikenal
    if (role !== "admin" && role !== "kasir") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
