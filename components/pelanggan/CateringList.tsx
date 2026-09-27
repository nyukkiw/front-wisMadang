// File untuk menampilkan daftar paket catering, memungkinkan pelanggan menambahkan paket ke keranjang belanja

"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { CartToast, CUSTOMER_CART_KEY, notifyCustomerCartUpdated } from "@/components/pelanggan/CartNotification";
import { CatalogItem } from "@/lib/menuCatalog";
import { useMenuCatalog } from "@/lib/useMenuCatalog";
import { useAuth } from "@/components/auth/AuthProvider";
const ITEMS_PER_PAGE = 4;

export default function CateringList() {
  const [page, setPage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const { session, openLogin } = useAuth();
  const catalog = useMenuCatalog();
  const cateringPackages = catalog.filter((item) => item.type === "catering" && typeof item.portions === "number");
  const pageCount = Math.max(1, Math.ceil(cateringPackages.length / ITEMS_PER_PAGE));
  const visiblePackages = cateringPackages.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const addToCart = (packageItem: CatalogItem) => {
    if (!session || session.peran !== "pelanggan") {
      openLogin();
      return;
    }

    const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);
    const cart: Array<CatalogItem & { quantity: number }> = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cart.find((item) => item.id === packageItem.id && item.type === "catering");

    const nextCart = existingItem
      ? cart.map((item) => (item.id === packageItem.id && item.type === "catering" ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { ...packageItem, quantity: 1, type: "catering" }];

    localStorage.setItem(CUSTOMER_CART_KEY, JSON.stringify(nextCart));
		notifyCustomerCartUpdated();
    setCartMessage(`${packageItem.name} ditambahkan ke keranjang.`);
  };

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCartMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [cartMessage]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2C2520]">Paket Catering</h1>
        <p className="mt-2 text-[#2C2520]/65">Pilih paket catering untuk keluarga, rapat, atau acara spesial.</p>
      </header>

      <CartToast message={cartMessage} onClose={() => setCartMessage("")} />

      <div className="grid gap-5 md:grid-cols-2">
        {visiblePackages.map((packageItem) => (
          <article key={packageItem.id} className="overflow-hidden rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] shadow-sm">
            <div className="relative h-48">
              <Image src={packageItem.image} alt={packageItem.name} fill unoptimized={packageItem.image.startsWith("data:")} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>

            <div className="p-5">
              <h2 className="text-lg font-bold text-[#2C2520]">{packageItem.name}</h2>
              <p className="mt-2 text-sm text-[#2C2520]/65">{packageItem.description}</p>
              <p className="mt-3 text-sm font-medium text-[#2C2520]/65">Untuk {packageItem.portions} porsi</p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="font-bold text-[#2C2520]">Rp {packageItem.price.toLocaleString("id-ID")}</p>
                <button type="button" onClick={() => addToCart(packageItem)} className="rounded-xl bg-[#C08A57] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a97142]">
                  Tambah
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage((currentPage) => currentPage - 1)}
          className="rounded-xl border border-[#e2d3c5] bg-[#F4EAE1] px-4 py-2 text-sm font-medium text-[#2C2520] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>

        <span className="text-sm font-medium text-[#2C2520]/65">
          Halaman {page + 1} dari {pageCount}
        </span>

        <button
          type="button"
          disabled={page === pageCount - 1}
          onClick={() => setPage((currentPage) => currentPage + 1)}
          className="rounded-xl bg-[#C08A57] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </section>
  );
}
