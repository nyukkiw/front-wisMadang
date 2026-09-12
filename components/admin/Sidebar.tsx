// File untuk sidebar admin, menampilkan menu navigasi untuk admin dan kasir

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    name: "Dashboard",
    href: "/admin",
  },
  {
    name: "Kasir",
    href: "/admin/kasir",
  },
  {
    name: "Menu",
    href: "/admin/menu",
  },
  {
    name: "Analisis Ulasan",
    href: "/admin/analisis-ulasan",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-[#174C4F] p-5 text-white md:block">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">WIS MADANG</h1>

        <p className="text-sm text-white/60">Panel Penjual</p>
      </div>

      <nav className="space-y-2">
        {menus.map((menu) => {
          const active = pathname === menu.href;

          return (
            <Link key={menu.href} href={menu.href} className={`block rounded-xl px-4 py-3 transition ${active ? "bg-[#E9785F] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              {menu.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
