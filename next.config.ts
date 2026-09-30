import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    // Backend masih jalan di 127.0.0.1 (localhost) buat development, jadi izinkan Next.js ambil gambar dari situ.
    // Ini AMAN untuk sekarang karena backend-nya cuma bisa diakses dari komputer sendiri, tapi WAJIB diganti
    // ke domain asli (bukan IP privat) begitu backend sudah di-deploy ke server publik.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
