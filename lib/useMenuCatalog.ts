// File untuk mengambil data menu dan paket catering dari backend

"use client";

import { useEffect, useState } from "react";

import { ApiError, ApiMenu, ApiPaketCatering, ambilDaftarMenu, ambilDaftarPaketCatering } from "@/lib/api";
import { CatalogItem, FALLBACK_IMAGE } from "@/lib/menuCatalog";

function ubahMenuBackendJadiCatalogItem(menu: ApiMenu): CatalogItem {
  return {
    id: menu.id,
    type: "menu",
    name: menu.nama_menu,
    description: menu.deskripsi ?? "",
    price: Number(menu.harga),
    image: menu.gambar_url ?? FALLBACK_IMAGE,
    available: menu.status_stok === "tersedia",
    category: menu.kategori.nama_kategori.toLowerCase(),
    rating: menu.ulasan_avg_rating ? Number(menu.ulasan_avg_rating) : 0,
    review_count: menu.ulasan_count ?? 0,
  };
}

function ubahPaketCateringBackendJadiCatalogItem(paket: ApiPaketCatering): CatalogItem {
  return {
    id: paket.id + 1000, // dijauhkan dari rentang id menu supaya gak bentrok pas digabung
    type: "catering",
    name: paket.nama_paket,
    description: paket.deskripsi ?? "",
    price: Number(paket.harga_paket),
    image: paket.gambar_url ?? FALLBACK_IMAGE,
    available: paket.status_stok === "tersedia",
    portions: paket.porsi,
    rating: paket.ulasan_avg_rating ? Number(paket.ulasan_avg_rating) : 0,
    review_count: paket.ulasan_count ?? 0,
  };
}

export function useMenuCatalog() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [pesanError, setPesanError] = useState("");

  useEffect(() => {
    Promise.allSettled([ambilDaftarMenu(), ambilDaftarPaketCatering()]).then(([hasilMenu, hasilCatering]) => {
      const daftarMenu = hasilMenu.status === "fulfilled" ? hasilMenu.value.map(ubahMenuBackendJadiCatalogItem) : [];
      const daftarCatering = hasilCatering.status === "fulfilled" ? hasilCatering.value.map(ubahPaketCateringBackendJadiCatalogItem) : [];

      setCatalog([...daftarMenu, ...daftarCatering]);

      const errorYangGagal = hasilMenu.status === "rejected" ? hasilMenu.reason : hasilCatering.status === "rejected" ? hasilCatering.reason : null;

      setPesanError(errorYangGagal instanceof ApiError ? errorYangGagal.message : errorYangGagal ? "Gagal memuat menu/catering. Coba lagi nanti." : "");
    });
  }, []);

  return {
    catalog: catalog.filter((item) => item.available),
    pesanError,
  };
}
