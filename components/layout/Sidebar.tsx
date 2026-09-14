// Sidebar component untuk menampilkan navigasi samping pada aplikasi

"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Sidebar() {
  const { session, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-white shadow-md md:block">
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold text-green-700">Wis Madang</h1>

        <p className="mt-1 text-xs text-gray-500">Panel {session?.peran}</p>
      </div>

      <nav className="space-y-1 p-4">
        <Link href="/admin" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
          Kasir
        </Link>

        <Link href="/admin/kasir" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
          Dashboard
        </Link>

        <Link href="/admin/menu" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
          Menu
        </Link>

        <Link href="/admin/pesanan" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
          Analisis Ulasan
        </Link>

        {session?.peran === "admin" && (
          <Link href="/admin/pengguna" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700">
            Pengguna
          </Link>
        )}
      </nav>

      <div className="absolute bottom-0 w-full border-t p-4">
        <button onClick={logout} className="w-full rounded-lg bg-red-50 px-4 py-3 text-left text-red-600 hover:bg-red-100">
          Keluar
        </button>
      </div>
    </aside>
  );
}
