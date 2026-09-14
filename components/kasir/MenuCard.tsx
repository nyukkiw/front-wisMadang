// File untuk menampilkan menu item dalam bentuk kartu

"use client";

import Image from "next/image";

export interface MenuItem {
  // Interface untuk menu item
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  review_count: number;
  available: boolean;
  apakah_laris: boolean;
  image: string;
  description: string;
}

interface MenuCardProps {
  // Interface untuk props MenuCard
  menu: MenuItem;
  onAdd: (menu: MenuItem) => void;
}

export default function MenuCard({ menu, onAdd }: MenuCardProps) {
  // Component MenuCard untuk menampilkan menu item
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border
        bg-white p-4 shadow-sm transition
        ${!menu.available ? "cursor-not-allowed opacity-50 grayscale" : "hover:-translate-y-0.5 hover:shadow-md"} 
      `} // Jika menu habis kartu buram dan button tidak bisa diklik, jika tersedia kartu bisa di hover
    >
      {/* Badge Laris */}
      {menu.apakah_laris && menu.available && <span className="absolute right-3 top-3 rounded-full bg-[#E9785F] px-2.5 py-1 text-xs font-semibold text-white">Laris</span>}

      {/* Visual */}
      <div className="relative mb-4 h-32 overflow-hidden rounded-xl bg-[#EAF2ED]">
        <Image src={menu.image} alt={menu.name} fill sizes="(max-width: 1280px) 33vw, 300px" className="object-cover" />
      </div>

      {/* Nama */}
      <h3 className="font-semibold text-[#174C4F]">{menu.name}</h3>

      {/* Rating */}
      <div className="mt-1 flex items-center gap-1 text-sm">
        <span className="text-yellow-500">★</span>

        <span className="font-medium">{menu.rating}</span>

        <span className="text-gray-400">({menu.review_count})</span>
      </div>

      {/* Harga + tombol */}
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-gray-900">Rp{menu.price.toLocaleString("id-ID")}</span>

        <button
          type="button"
          disabled={!menu.available}
          onClick={() => onAdd(menu)}
          className={`
            flex h-9 w-9 items-center justify-center
            rounded-full text-xl font-semibold
            transition
            ${menu.available ? "bg-[#E9785F] text-white hover:opacity-90" : "cursor-not-allowed bg-gray-200 text-gray-400"}
          `}
        >
          +
        </button>
      </div>

      {/* Habis */}
      {!menu.available && <div className="mt-3 text-center text-xs font-semibold uppercase tracking-wide text-red-500">Habis</div>}
    </div>
  );
}
