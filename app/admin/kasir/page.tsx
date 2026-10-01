// File untuk halaman kasir - transaksi langsung, keranjang & pembayaran tersambung ke backend + Midtrans (sama kayak alur pelanggan)

"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { Search } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError, ApiIsiKeranjang, ambilKeranjang, checkoutRequest, konfirmasiPembayaranRequest, ubahKeranjang } from "@/lib/api";
import { dummyCategories } from "@/data/dummyData";
import { FALLBACK_IMAGE } from "@/lib/menuCatalog";
import { useMenuCatalog } from "@/lib/useMenuCatalog";

import MenuCard, { MenuItem } from "@/components/kasir/MenuCard";
import MenuFilter from "@/components/kasir/MenuFilter";
import SearchMenu from "@/components/kasir/SearchMenu";
import CartPanel, { CartItem } from "@/components/kasir/CartPanel";
import ReceiptModal from "@/components/kasir/ReceiptModal";

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
const MIDTRANS_SNAP_URL = "https://app.sandbox.midtrans.com/snap/snap.js";

interface HasilPembayaranMidtrans {
  payment_type: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        snapToken: string,
        options?: {
          onSuccess?: (hasil: HasilPembayaranMidtrans) => void;
          onPending?: (hasil: HasilPembayaranMidtrans) => void;
          onError?: () => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

function ubahIsiKeranjangJadiCartItem(item: ApiIsiKeranjang): CartItem | null {
  if (item.menu) {
    return {
      id: item.menu.id,
      name: item.menu.nama_menu,
      category: item.menu.kategori.nama_kategori.toLowerCase(),
      price: Number(item.menu.harga),
      rating: item.menu.ulasan_avg_rating ? Number(item.menu.ulasan_avg_rating) : 0,
      review_count: item.menu.ulasan_count ?? 0,
      available: item.menu.status_stok === "tersedia",
      image: item.menu.gambar_url ?? FALLBACK_IMAGE,
      description: item.menu.deskripsi ?? "",
      qty: item.jumlah,
    };
  }

  if (item.paket_catering) {
    return {
      id: item.paket_catering.id + 1000, // dijauhkan dari rentang id menu, konsisten sama pola di useMenuCatalog.ts
      name: item.paket_catering.nama_paket,
      category: "catering",
      price: Number(item.paket_catering.harga_paket),
      rating: item.paket_catering.ulasan_avg_rating ? Number(item.paket_catering.ulasan_avg_rating) : 0,
      review_count: item.paket_catering.ulasan_count ?? 0,
      available: true,
      image: item.paket_catering.gambar_url ?? FALLBACK_IMAGE,
      description: item.paket_catering.deskripsi ?? "",
      qty: item.jumlah,
    };
  }

  return null;
}

export default function KasirPage() {
  const { session } = useAuth();

  // =========================
  // STATE
  // =========================

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("semua");
  const { catalog, pesanError } = useMenuCatalog();
  const [pesanErrorTampil, setPesanErrorTampil] = useState("");
  const availableMenus = catalog.map((item) => ({
    ...item,
    category: item.type === "catering" ? "catering" : (item.category ?? "lainnya"),
    rating: item.rating ?? 0,
    review_count: item.review_count ?? 0,
  }));
  const kategoriFilter = [...dummyCategories, { id: "catering", name: "Catering" }];

  const [cart, setCart] = useState<CartItem[]>([]);

  const muatUlangKeranjang = () => {
    if (!session) {
      setCart([]);
      return;
    }

    ambilKeranjang(session.token)
      .then((isiKeranjang) => setCart(isiKeranjang.map(ubahIsiKeranjangJadiCartItem).filter((item): item is CartItem => item !== null)))
      .catch((error) => setPesanErrorTampil(error instanceof ApiError ? error.message : "Gagal memuat keranjang."));
  };

  useEffect(muatUlangKeranjang, [session]);

  useEffect(() => {
    setPesanErrorTampil(pesanError);
  }, [pesanError]);

  useEffect(() => {
    if (!pesanErrorTampil) {
      return;
    }

    const timeoutId = window.setTimeout(() => setPesanErrorTampil(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [pesanErrorTampil]);

  // Menampilkan struk
  const [showReceipt, setShowReceipt] = useState(false);

  // Nomor pesanan & metode pembayaran, diisi dari hasil Midtrans setelah bayar sukses
  const [orderNumber, setOrderNumber] = useState("");
  const [metodeStruk, setMetodeStruk] = useState("Tunai");
  const [itemStruk, setItemStruk] = useState<CartItem[]>([]);

  // =========================
  // FILTER MENU
  // =========================

  const filteredMenus = useMemo(() => {
    return availableMenus.filter((menu) => {
      const matchesSearch = menu.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "semua" || menu.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [availableMenus, search, selectedCategory]);

  // =========================
  // UBAH ISI KERANJANG (tambah/kurangi/hapus, semuanya lewat backend)
  // =========================

  const kirimAksiKeranjang = async (id: number, kategori: string, aksi: "tambah" | "kurangi" | "hapus") => {
    if (!session) {
      return;
    }

    const payload = kategori === "catering" ? { paket_id: id - 1000, jumlah: 1, aksi } : { menu_id: id, jumlah: 1, aksi };

    try {
      await ubahKeranjang(session.token, payload);
      muatUlangKeranjang();
    } catch (error) {
      setPesanErrorTampil(error instanceof ApiError ? error.message : "Gagal mengubah keranjang.");
    }
  };

  const handleAddMenu = (menu: MenuItem) => {
    kirimAksiKeranjang(menu.id, menu.category, "tambah");
  };

  const handleIncrease = (id: number) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item) {
      kirimAksiKeranjang(id, item.category, "tambah");
    }
  };

  const handleDecrease = (id: number) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item) {
      kirimAksiKeranjang(id, item.category, "kurangi");
    }
  };

  const handleRemove = (id: number) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (item) {
      kirimAksiKeranjang(id, item.category, "hapus");
    }
  };

  // =========================
  // BAYAR (checkout -> popup Midtrans -> konfirmasi), sama persis kayak alur pelanggan
  // =========================

  const handlePay = async () => {
    if (cart.length === 0 || !session) {
      return;
    }

    if (!window.snap) {
      setPesanErrorTampil("Layanan pembayaran belum siap, coba lagi sebentar.");
      return;
    }

    try {
      const hasil = await checkoutRequest(session.token);
      const salinanItem = cart;

      const konfirmasiKeServer = async (metodePembayaran: string, status: "diproses" | "menunggu_pembayaran") => {
        try {
          await konfirmasiPembayaranRequest(session.token, hasil.nomor_pesanan, metodePembayaran, status);
          muatUlangKeranjang();
        } catch (error) {
          setPesanErrorTampil(error instanceof ApiError ? error.message : "Pembayaran diterima, tapi gagal mencatat pesanan.");
        }
      };

      window.snap.pay(hasil.snap_token, {
        onSuccess: (hasilPembayaran) => {
          konfirmasiKeServer(hasilPembayaran.payment_type, "diproses");
          setItemStruk(salinanItem);
          setMetodeStruk(hasilPembayaran.payment_type);
          setOrderNumber(hasil.nomor_pesanan);
          setShowReceipt(true);
        },
        onPending: (hasilPembayaran) => {
          konfirmasiKeServer(hasilPembayaran.payment_type, "menunggu_pembayaran");
          setPesanErrorTampil(`Pembayaran pesanan ${hasil.nomor_pesanan} masih tertunda.`);
        },
        onError: () => {
          setPesanErrorTampil(`Pembayaran pesanan ${hasil.nomor_pesanan} gagal.`);
        },
        onClose: () => {
          setPesanErrorTampil("Jendela pembayaran ditutup. Pesanan belum dibuat, barang tetap ada di keranjang.");
        },
      });
    } catch (error) {
      setPesanErrorTampil(error instanceof ApiError ? error.message : "Checkout gagal. Coba lagi nanti.");
    }
  };

  // =========================
  // HITUNG TOTAL STRUK
  // =========================

  const totalStruk = itemStruk.reduce((total, item) => total + item.price * item.qty, 0);
  const taxStruk = totalStruk * 0.1;

  // =========================
  // PESANAN BARU
  // =========================

  const handleNewOrder = () => {
    setShowReceipt(false);
    setOrderNumber("");
    setItemStruk([]);
  };

  // =========================
  // TAMPILAN
  // =========================

  return (
    <main className="min-h-screen bg-[#FCF9F6] p-6">
      <Script src={MIDTRANS_SNAP_URL} data-client-key={MIDTRANS_CLIENT_KEY} strategy="afterInteractive" />

      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2C2520]">Transaksi Penjual</h1>

          <p className="mt-1 text-sm text-[#2C2520]/65">Kelola pesanan pelanggan dengan cepat</p>
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* MENU */}
          <section>
            {/* Search */}
            <SearchMenu value={search} onChange={setSearch} />

            {/* Filter */}
            <div className="mt-4">
              <MenuFilter categories={kategoriFilter} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            {/* Pesan error kalau ada masalah keranjang/menu/pembayaran */}
            {pesanErrorTampil && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{pesanErrorTampil}</div>
            )}

            {/* Menu Grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMenus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} onAdd={handleAddMenu} />
              ))}
            </div>

            {/* Tidak ditemukan */}
            {filteredMenus.length === 0 && (
              <div className="mt-6 rounded-2xl bg-[#e6efe9] p-10 text-center">
                <Search className="mx-auto h-10 w-10 text-[#174a43]" aria-hidden="true" />

                <p className="mt-3 font-semibold text-[#174a43]">Menu tidak ditemukan</p>

                <p className="mt-1 text-sm text-gray-500">Coba gunakan kata kunci atau kategori lain.</p>
              </div>
            )}
          </section>

          {/* PESANAN */}
          <aside>
            <CartPanel cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove} onPay={handlePay} />
          </aside>
        </div>
      </div>

      {/* =========================
          STRUK DIGITAL
      ========================= */}

      {showReceipt && (
        <ReceiptModal orderNumber={orderNumber} items={itemStruk} subtotal={totalStruk} tax={taxStruk} total={totalStruk + taxStruk} paymentMethod={metodeStruk} onClose={handleNewOrder} />
      )}
    </main>
  );
}
