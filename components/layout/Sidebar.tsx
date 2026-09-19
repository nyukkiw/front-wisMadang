// Sidebar component untuk menampilkan navigasi samping pada aplikasi

"use client";

import Link from "next/link";

import { UserRole } from "@/lib/auth";
import { CartBadge } from "@/components/pelanggan/CartNotification";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ role, isOpen, onToggle }: SidebarProps) {
  const sidebarClass = `fixed inset-y-0 left-0 z-40 w-56 border-r border-[#e2d3c5] bg-[#F4EAE1] transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`;

  const linkClass = "mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#2C2520] hover:bg-[#C08A57]/20";

  const navigation =
    role === "kasir"
      ? {
          title: "Kasir",
          links: [{ href: "/admin/kasir", label: "🧾", text: "Transaksi" }],
        }
      : role === "pelanggan"
        ? {
            title: "Pelanggan",
            links: [
              { href: "/pelanggan", label: "🏠", text: "Dashboard" },
              { href: "/pelanggan/menu", label: "🍛", text: "Menu" },
              { href: "/pelanggan/catering", label: "🍱", text: "Paket Catering" },
              { href: "/pelanggan/keranjang", label: "🛒", text: "Keranjang" },
            ],
          }
        : {
            title: "Admin",
            links: [
              { href: "/admin", label: "📊", text: "Dashboard" },
              { href: "/admin/menu", label: "🍛", text: "Menu" },
              { href: "/admin/ai-insight", label: "✨", text: "AI Ulasan" },
            ],
          };

  // =========================
  // SIDEBAR PELANGGAN
  // =========================

  return (
    <aside className={sidebarClass} aria-label="Navigasi utama">
      <nav className="p-4">
        <div className="mb-4 flex items-center justify-between px-3">
          <p className="text-xs font-semibold uppercase text-[#2C2520]/60">{navigation.title}</p>

          <button onClick={onToggle} className="rounded-lg p-1 text-[#2C2520] hover:bg-[#C08A57]/20 md:hidden" aria-label="Tutup sidebar">
            ×
          </button>
        </div>

        {navigation.links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass} onClick={() => window.innerWidth < 768 && onToggle()}>
            <span aria-hidden="true">{role === "pelanggan" && link.href === "/pelanggan/keranjang" ? <CartBadge /> : link.label}</span>
            <span>{link.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
