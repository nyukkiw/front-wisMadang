// File untuk halaman kasir, menampilkan daftar menu dan keranjang belanja

"use client";

import { useEffect, useMemo, useState } from "react";

import { dummyCategories, dummyMenus } from "@/data/dummyData";

import MenuCard, { MenuItem } from "@/components/kasir/MenuCard";

import MenuFilter from "@/components/kasir/MenuFilter";

import SearchMenu from "@/components/kasir/SearchMenu";

import CartPanel, { CartItem } from "@/components/kasir/CartPanel";

import ReceiptModal from "@/components/kasir/ReceiptModal";

export default function KasirPage() {
  // =========================
  // STATE
  // =========================

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("semua");

  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false); // Menandai apakah keranjang sudah dimuat dari localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("wis-madang-cart");

    if (savedCart) {
      // Jika ada data keranjang yang tersimpan, muat ke state
      setCart(JSON.parse(savedCart));
    }
    // Menandakan bahwa proses mengambil cart sudah selesai
    setCartLoaded(true);
  }, []);

  // Menyimpan keranjang ke localStorage setiap kali cart berubah
  useEffect(() => {
    // Jangan simpan sebelum data awal selesai dimuat
    if (!cartLoaded) {
      return;
    }

    localStorage.setItem("wis-madang-cart", JSON.stringify(cart));
  }, [cart, cartLoaded]);

  // Metode pembayaran
  const [paymentMethod, setPaymentMethod] = useState("QRIS");

  // Menampilkan struk
  const [showReceipt, setShowReceipt] = useState(false);

  // Nomor pesanan
  const [orderNumber, setOrderNumber] = useState("");

  // =========================
  // FILTER MENU
  // =========================

  const filteredMenus = useMemo(() => {
    return dummyMenus.filter((menu) => {
      const matchesSearch = menu.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "semua" || menu.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  // =========================
  // TAMBAH MENU
  // =========================

  const handleAddMenu = (menu: MenuItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === menu.id);

      if (existingItem) {
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

  // =========================
  // TAMBAH QUANTITY
  // =========================

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

  // =========================
  // KURANGI QUANTITY
  // =========================

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

  // =========================
  // HAPUS ITEM
  // =========================

  const handleRemove = (id: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  // =========================
  // AI SUGGESTION
  // =========================

  const suggestions = useMemo(() => {
    // AI suggestion hanya muncul
    // jika ada Nasi atau Lauk
    const hasNasiOrLauk = cart.some((item) => item.category === "nasi" || item.category === "lauk");

    if (!hasNasiOrLauk) {
      return [];
    }

    // Ambil menu yang belum ada
    // di keranjang
    const cartIds = cart.map((item) => item.id);

    return dummyMenus.filter((menu) => menu.available && !cartIds.includes(menu.id) && (menu.category === "lauk" || menu.category === "minuman")).slice(0, 2);
  }, [cart]);

  // =========================
  // TAMBAH DARI AI
  // =========================

  const handleAddSuggestion = (menu: MenuItem) => {
    handleAddMenu(menu);
  };

  // =========================
  // BAYAR
  // =========================

  const handlePay = () => {
    if (cart.length === 0) {
      return;
    }

    // Buat nomor order dummy
    // Contoh:
    // MADANG-2026-00001
    const number = `MADANG-${new Date().getFullYear()}-` + `${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

    setOrderNumber(number);

    // Tampilkan struk
    setShowReceipt(true);
  };

  // =========================
  // HITUNG TOTAL
  // =========================

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const tax = subtotal * 0.1;

  const total = subtotal + tax;

  // =========================
  // PESANAN BARU
  // =========================

  const handleNewOrder = () => {
    // Kosongkan keranjang
    setCart([]);

    // Reset metode pembayaran
    setPaymentMethod("QRIS");

    // Tutup struk
    setShowReceipt(false);

    // Reset nomor order
    setOrderNumber("");
  };

  // =========================
  // TAMPILAN
  // =========================

  return (
    <main className="min-h-screen bg-[#f5f1e8] p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#174a43]">Kasir</h1>

          <p className="mt-1 text-sm text-gray-600">Kelola pesanan pelanggan dengan cepat</p>
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* MENU */}
          <section>
            {/* Search */}
            <SearchMenu value={search} onChange={setSearch} />

            {/* Filter */}
            <div className="mt-4">
              <MenuFilter categories={dummyCategories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            {/* Menu Grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMenus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} onAdd={handleAddMenu} />
              ))}
            </div>

            {/* Tidak ditemukan */}
            {filteredMenus.length === 0 && (
              <div className="mt-6 rounded-2xl bg-[#e6efe9] p-10 text-center">
                <div className="text-4xl">🔍</div>

                <p className="mt-3 font-semibold text-[#174a43]">Menu tidak ditemukan</p>

                <p className="mt-1 text-sm text-gray-500">Coba gunakan kata kunci atau kategori lain.</p>
              </div>
            )}
          </section>

          {/* PESANAN */}
          <aside>
            <CartPanel
              cart={cart}
              suggestions={suggestions}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onAddSuggestion={handleAddSuggestion}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onPay={handlePay}
            />
          </aside>
        </div>
      </div>

      {/* =========================
          STRUK DIGITAL
      ========================= */}

      {showReceipt && <ReceiptModal orderNumber={orderNumber} items={cart} subtotal={subtotal} tax={tax} total={total} paymentMethod={paymentMethod} onNewOrder={handleNewOrder} />}
    </main>
  );
}
