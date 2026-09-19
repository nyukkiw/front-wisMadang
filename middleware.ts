// File untuk middleware yang mengatur akses ke halaman admin berdasarkan token dan role pengguna

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("wis_madang_token")?.value;

  const role = request.cookies.get("wis_madang_role")?.value;

  /*
   * Semua halaman seller/admin
   * berada di bawah /admin/*
   */

  if (pathname.startsWith("/admin")) {
    // Jika path dimulai dengan /admin, lakukan pengecekan token dan role
    /*
     * Belum login
     */

    if (!token || !role) {
      // Jika tidak ada token atau role, redirect ke halaman login seller
      return NextResponse.redirect(new URL("/seller", request.url));
    }

    /*
     * Buyer tidak boleh masuk panel seller
     */

    if (role === "pelanggan") {
      // Jika role adalah pelanggan, redirect ke halaman utama
      return NextResponse.redirect(new URL("/", request.url));
    }

    /*
     * Hanya admin dan kasir
     */

    if (role !== "admin" && role !== "kasir") {
      // Jika role bukan admin atau kasir, redirect ke halaman utama
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "kasir" && pathname !== "/admin/kasir") {
      // Jika role adalah kasir dan mencoba mengakses halaman selain /admin/kasir, redirect ke /admin/kasir
      return NextResponse.redirect(new URL("/admin/kasir", request.url));
    }
  }

  if (pathname.startsWith("/pelanggan")) { // Jika path dimulai dengan /pelanggan, lakukan pengecekan token dan role
    if (pathname === "/pelanggan/login") {
      // Jika halaman login pelanggan, biarkan akses tanpa token
      return NextResponse.next();
    }
    if (!token || !role) { // Jika tidak ada token atau role, redirect ke halaman login pelanggan
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "pelanggan") { // Jika role bukan pelanggan, redirect ke halaman utama
      return NextResponse.redirect(new URL("/seller", request.url));
    }
  }

  return NextResponse.next(); // Jika semua pengecekan lolos, lanjutkan ke halaman yang diminta
}

export const config = {
  // Konfigurasi middleware untuk menentukan path yang akan diterapkan
  matcher: ["/admin/:path*"],
};
