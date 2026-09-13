// File untuk halaman kasir, menampilkan daftar menu dan keranjang belanja

"use client";

import { useMemo, useState } from "react";

import {dummyCategories} from "@/data/dummyData";
import {dummyMenus} from "@/data/dummyData";

import MenuCard, { MenuItem } from "@/components/kasir/MenuCard";

import MenuFilter from "@/components/kasir/MenuFilter";

import SearchMenu from "@/components/kasir/SearchMenu";

import CartPanel, { CartItem } from "@/components/kasir/CartPanel";

export default function KasirPage() {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("semua");

  const [cart, setCart] = useState<CartItem[]>([]);

  /*
   * Filter menu berdasarkan:
   *
   * 1. Search
   * 2. Kategori
   */

  const filteredMenus = useMemo(() => {
    return dummyMenus.filter((menu) => {
      const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === "semua" || menu.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  /*
   * Tambahkan menu ke keranjang
   */

  const handleAddToCart = (menu: MenuItem) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === menu.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === menu.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...menu,
          qty: 1,
        },
      ];
    });
  };

  /*
   * Tambah quantity
   */

  const handleIncrease = (id: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item,
      ),
    );
  };

  /*
   * Kurangi quantity
   */

  const handleDecrease = (id: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  /*
   * Hapus item
   */

  const handleRemove = (id: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-[#E9785F]">Point of Sale</p>

        <h1 className="mt-1 text-2xl font-bold text-[#174C4F]">Kasir</h1>

        <p className="mt-1 text-sm text-gray-500">Kelola pesanan pelanggan dengan cepat.</p>
      </div>

      {/* Main POS */}
      <div className="grid min-h-[calc(100vh-220px)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* LEFT — MENU */}
        <section className="min-w-0">
          {/* Search */}
          <div className="mb-4">
            <SearchMenu value={search} onChange={setSearch} />
          </div>

          {/* Category */}
          <div className="mb-5">
            <MenuFilter categories={dummyCategories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>

          {/* Result info */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Daftar Menu</h2>

            <span className="text-sm text-gray-400">{filteredMenus.length} menu</span>
          </div>

          {/* Menu Grid */}
          {filteredMenus.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <div className="text-4xl">🔍</div>

              <h3 className="mt-3 font-semibold text-gray-700">Menu tidak ditemukan</h3>

              <p className="mt-1 text-sm text-gray-400">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMenus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} onAdd={handleAddToCart} />
              ))}
            </div>
          )}
        </section>

        {/* RIGHT — CART */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
          <CartPanel cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove} />
        </div>
      </div>
    </div>
  );
}
