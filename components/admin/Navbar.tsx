// File untuk navbar admin, menampilkan informasi pengguna dan tombol logout

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const router = useRouter();

  const { session, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white px-6">
      <div>
        <p className="text-sm text-gray-500">Selamat datang,</p>

        <h2 className="font-semibold text-gray-900">{session?.nama || "Seller"}</h2>
      </div>

      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9785F] font-bold text-white">{session?.nama?.charAt(0) || "U"}</div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold">{session?.nama}</p>

            <p className="text-xs capitalize text-gray-500">{session?.peran}</p>
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white p-2 shadow-lg">
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100">Profil</button>

            <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100">Pengaturan</button>

            <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
