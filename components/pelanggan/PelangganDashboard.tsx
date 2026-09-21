// File untuk dashboard pelanggan, menampilkan menu populer, paket catering, promo, dan ulasan pelanggan

"use client";

import { useState } from "react";
import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import MenuCard from "@/components/kasir/MenuCard";
import { CartToast, notifyCustomerCartUpdated } from "@/components/pelanggan/CartNotification";
import { CatalogItem, normalizeCatalogImage } from "@/lib/menuCatalog";
import { useMenuCatalog } from "@/lib/useMenuCatalog";
import { useAuth } from "@/components/auth/AuthProvider";

const CUSTOMER_CART_KEY = "wis-madang-customer-cart";

export default function CustomerDashboard() {
  const [cateringPage, setCateringPage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const [selectedCatering, setSelectedCatering] = useState<CatalogItem | null>(null);
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

  const addToCart = (item: CatalogItem) => {
    if (!session || session.peran !== "pelanggan") {
      openLogin();
      return;
    }

    const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cart.find((cartItem: CatalogItem & { quantity: number }) => cartItem.id === item.id && cartItem.type === item.type);
    const nextCart = existingItem
      ? cart.map((cartItem: CatalogItem & { quantity: number }) => (cartItem.id === item.id && cartItem.type === item.type ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem))
      : [...cart, { ...item, quantity: 1 }];

    localStorage.setItem(CUSTOMER_CART_KEY, JSON.stringify(nextCart));
    notifyCustomerCartUpdated();
    setCartMessage(`${item.name} ditambahkan ke keranjang.`);
  };

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCartMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [cartMessage]);

  useEffect(() => {
    if (!selectedCatering) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCatering(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCatering]);

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
            <MenuCard key={menu.id} menu={menu} onAdd={(menu) => addToCart({ ...menu, type: "menu" })} />
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
            <article
              key={packageItem.id}
              role="button"
              tabIndex={0}
              aria-label={`Lihat detail ${packageItem.name}`}
              onClick={() => setSelectedCatering(packageItem)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedCatering(packageItem);
                }
              }}
              className="cursor-pointer rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 transition hover:-translate-y-0.5 hover:border-[#C08A57] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#C08A57]/60"
            >
              <h3 className="font-bold">{packageItem.name}</h3>
              <p className="mt-2 text-sm text-[#2C2520]/65">{packageItem.description}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="font-semibold">Rp {packageItem.price.toLocaleString("id-ID")}</p>
                <span className="text-xs font-semibold text-[#C08A57]">Lihat detail</span>
              </div>
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

      {selectedCatering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={() => setSelectedCatering(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="catering-detail-title" className="w-full max-w-lg overflow-hidden rounded-2xl bg-[#F4EAE1] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="relative h-56 bg-[#EAF2ED]">
              <Image src={normalizeCatalogImage(selectedCatering.image)} alt={selectedCatering.name} fill sizes="(max-width: 768px) 100vw, 512px" className="object-cover" />
              <button type="button" onClick={() => setSelectedCatering(null)} aria-label="Tutup detail paket" className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <h2 id="catering-detail-title" className="text-2xl font-bold text-[#2C2520]">
                {selectedCatering.name}
              </h2>
              <p className="mt-3 leading-6 text-[#2C2520]/70">{selectedCatering.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#FCF9F6] p-3">
                  <p className="text-xs text-[#2C2520]/55">Harga</p>
                  <p className="mt-1 font-bold text-[#2C2520]">Rp {selectedCatering.price.toLocaleString("id-ID")}</p>
                </div>
                <div className="rounded-xl bg-[#FCF9F6] p-3">
                  <p className="text-xs text-[#2C2520]/55">Kapasitas</p>
                  <p className="mt-1 font-bold text-[#2C2520]">{selectedCatering.portions ?? "-"} porsi</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setSelectedCatering(null)} className="flex-1 rounded-xl border border-[#e2d3c5] px-4 py-3 font-semibold text-[#2C2520] transition hover:bg-[#FCF9F6]">
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedCatering);
                    setSelectedCatering(null);
                  }}
                  className="flex-1 rounded-xl bg-[#C08A57] px-4 py-3 font-bold text-white transition hover:bg-[#a97142]"
                >
                  Tambah ke keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
