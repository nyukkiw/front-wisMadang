// Navbar component untuk menampilkan navigasi atas pada aplikasi

"use client";

import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const { session } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-800">{session?.nama}</p>

        <p className="text-xs capitalize text-gray-500">{session?.peran}</p>
      </div>
    </header>
  );
}
