// Sidebar component untuk menampilkan navigasi samping pada aplikasi

"use client";

import Link from "next/link";
import { BarChart3, ChefHat, ClipboardList, House, ShoppingCart, Sparkles, Utensils, X, type LucideIcon } from "lucide-react";

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
          links: [{ href: "/admin/kasir", icon: ClipboardList, text: "Transaksi" }],
        }
      : role === "pelanggan"
        ? {
            title: "Pelanggan",
            links: [
              { href: "/pelanggan", icon: House, text: "Dashboard" },
              { href: "/pelanggan/menu", icon: Utensils, text: "Menu" },
              { href: "/pelanggan/catering", icon: ChefHat, text: "Paket Catering" },
              { href: "/pelanggan/keranjang", icon: ShoppingCart, text: "Keranjang" },
            ],
          }
        : {
            title: "Admin",
            links: [
              { href: "/admin", icon: BarChart3, text: "Dashboard" },
              { href: "/admin/menu", icon: Utensils, text: "Menu" },
              { href: "/admin/ai-insight", icon: Sparkles, text: "AI Ulasan" },
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
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {navigation.links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClass} onClick={() => window.innerWidth < 768 && onToggle()}>
            <span aria-hidden="true">
              {role === "pelanggan" && link.href === "/pelanggan/keranjang" ? (
                <CartBadge showIcon={false} />
              ) : (
                (() => {
                  const Icon = link.icon as LucideIcon;
                  return <Icon className="h-5 w-5" />;
                })()
              )}
            </span>
            <span>{link.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
