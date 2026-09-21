// File untuk dashboard pelanggan, menampilkan menu populer, paket catering, promo, dan ulasan pelanggan

"use client";

import { useState } from "react";
import { useEffect } from "react";

import Link from "next/link";
import MenuCard, { MenuItem } from "@/components/kasir/MenuCard";
import { CartToast, notifyCustomerCartUpdated } from "@/components/pelanggan/CartNotification";
import { useMenuCatalog } from "@/lib/useMenuCatalog";
import { useAuth } from "@/components/auth/AuthProvider";

const CUSTOMER_CART_KEY = "wis-madang-customer-cart";

export default function CustomerDashboard() {
  const [cateringPage, setCateringPage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const { session, openLogin } = useAuth();
  const catalog = useMenuCatalog();

  const popularMenus = catalog
    .filter((item) => item.type === "menu" && item.apakah_laris)
    .map((item) => ({ ...item, category: item.category ?? "lainnya", rating: item.rating ?? 0, review_count: item.review_count ?? 0, apakah_laris: item.apakah_laris ?? false }))
    .slice(0, 4);

  const cateringPerPage = 4;
  const start = cateringPage * cateringPerPage;

  const cateringPackages = catalog.filter((item) => item.type === "catering");
  const visibleCatering = cateringPackages.slice(start, start + cateringPerPage);

  const addToCart = (menu: MenuItem) => {
    if (!session || session.peran !== "pelanggan") {
      openLogin();
      return;
    }

    const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cart.find((item: MenuItem & { quantity: number; type: string }) => item.id === menu.id && item.type === "menu");
    const nextCart = existingItem
      ? cart.map((item: MenuItem & { quantity: number; type: string }) => (item.id === menu.id && item.type === "menu" ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { ...menu, quantity: 1, type: "menu" }];

    localStorage.setItem(CUSTOMER_CART_KEY, JSON.stringify(nextCart));
    notifyCustomerCartUpdated();
    setCartMessage(`${menu.name} ditambahkan ke keranjang.`);
  };

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCartMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [cartMessage]);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-bold">Selamat datang di WIS MADANG</h1>
        <p className="mt-2 text-[#2C2520]/65">Temukan menu favorit dan paket catering terbaik.</p>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Menu Populer</h2>
          <Link href="/pelanggan/menu" className="text-sm font-semibold text-[#C08A57] hover:underline">
            Lihat semua menu
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularMenus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onAdd={addToCart} />
          ))}
        </div>

        <CartToast message={cartMessage} onClose={() => setCartMessage("")} />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Paket Catering</h2>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-[#e2d3c5] px-3 py-2 text-sm disabled:opacity-40" disabled={cateringPage === 0} onClick={() => setCateringPage((page) => Math.max(0, page - 1))}>
              Sebelumnya
            </button>

            <button className="rounded-lg bg-[#C08A57] px-3 py-2 text-sm text-white disabled:opacity-40" disabled={start + cateringPerPage >= cateringPackages.length} onClick={() => setCateringPage((page) => page + 1)}>
              Berikutnya
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {visibleCatering.map((packageItem) => (
            <article key={packageItem.id} className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5">
              <h3 className="font-bold">{packageItem.name}</h3>
              <p className="mt-2 text-sm text-[#2C2520]/65">{packageItem.description}</p>
              <p className="mt-3 font-semibold">Rp {packageItem.price.toLocaleString("id-ID")}</p>
            </article>
          ))}
        </div>

        <Link href="/pelanggan/catering" className="inline-block text-sm font-semibold text-[#C08A57] hover:underline">
          Lihat semua paket catering
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-bold">Promo Hari Ini</h2>
        {/* PromoCard */}
      </section>

    </div>
  );
}
