// Navbar component untuk menampilkan navigasi atas pada aplikasi

"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, Menu, Phone, UserCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { CartBadge } from "@/components/pelanggan/CartNotification";
import { UserRole } from "@/lib/auth";

interface NavbarProps {
  role: UserRole;
  nama?: string;
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function Navbar({ role, nama = "Pengguna", sidebarOpen, onMenuToggle }: NavbarProps) {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login"); // Redirect ke halaman login setelah logout
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#C08A57]/40 bg-[#174a43] text-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* =========================
            KIRI
        ========================= */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="rounded-lg p-2 text-xl hover:bg-[#C08A57]" aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}>
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>

          <Image src="/IMG Wis Madang/Wis Madang Logo.jpg" alt="Logo WIS MADANG" width={42} height={42} className="h-10 w-10 rounded-xl object-cover" priority />

          <div>
            <h1 className="font-bold">WIS MADANG</h1>

            <p className="text-xs text-white/70">Cafe & Catering</p>
          </div>
        </div>

        {/* =========================
            KANAN
        ========================= */}

        {/* PELANGGAN */}
        {role === "pelanggan" && (
          <div className="flex items-center gap-5 text-sm">
            {!session && (
              <Link href="/login" className="hover:text-[#C08A57]">
                Masuk / Daftar
              </Link>
            )}

            <Link href="/pelanggan/keranjang" className="text-xl hover:text-[#C08A57]" title="Keranjang">
              <CartBadge />
            </Link>

            <div className="hidden xl:block text-right">
              <p className="flex items-center justify-end gap-1">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                0812-3456-7890
              </p>
              <p className="text-xs text-white/70">Jl. Contoh No. 123, Yogyakarta</p>
            </div>

            <div className="hidden lg:block text-xs text-white/70">Buka 08.00–21.00</div>
          </div>
        )}

        {/* PENJUAL */}
        {role === "penjual" && (
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#C08A57]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4EAE1] text-[#2C2520]">
                <UserCircle className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold">{nama}</p>

                <p className="text-xs text-white/60 capitalize">Penjual</p>
              </div>

              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* DROPDOWN */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#F4EAE1] p-2 text-[#2C2520] shadow-xl">
                <button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#C08A57]/20">Edit Profil</button>

                <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
