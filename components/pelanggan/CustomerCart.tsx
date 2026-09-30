"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Script from "next/script";
import { ShoppingCart } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import ReceiptModal from "@/components/kasir/ReceiptModal"; // Komponen modal struk pembayaran
import { notifyCustomerCartUpdated } from "@/components/pelanggan/CartNotification";
import { AksiKeranjang, ApiError, ApiIsiKeranjang, ambilKeranjang, checkoutRequest, konfirmasiPembayaranRequest, ubahKeranjang } from "@/lib/api";
import { FALLBACK_IMAGE } from "@/lib/menuCatalog";

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

interface CustomerCartItem {
  id: number; // id asli menu/paket catering di backend
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "menu" | "catering";
  description?: string;
  portions?: number;
}

function ubahIsiKeranjangJadiCartItem(item: ApiIsiKeranjang): CustomerCartItem | null {
  if (item.menu) {
    return {
      id: item.menu.id,
      name: item.menu.nama_menu,
      price: Number(item.menu.harga),
      image: FALLBACK_IMAGE,
      quantity: item.jumlah,
      type: "menu",
      description: item.menu.deskripsi ?? "",
    };
  }

  if (item.paket_catering) {
    return {
      id: item.paket_catering.id,
      name: item.paket_catering.nama_paket,
      price: Number(item.paket_catering.harga_paket),
      image: FALLBACK_IMAGE,
      quantity: item.jumlah,
      type: "catering",
      description: item.paket_catering.deskripsi ?? "",
      portions: item.paket_catering.porsi,
    };
  }

  return null;
}

export default function CustomerCart() {
  const { session, openLogin } = useAuth();
  const [items, setItems] = useState<CustomerCartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [pesanError, setPesanError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  // Salinan isi keranjang, total, & metode pembayaran (dari hasil Midtrans) pas checkout,
  // buat ditampilkan di struk setelah keranjang aslinya dikosongkan server
  const [itemStruk, setItemStruk] = useState<CustomerCartItem[]>([]);
  const [totalStruk, setTotalStruk] = useState({ subtotal: 0, tax: 0, total: 0 });
  const [metodeStruk, setMetodeStruk] = useState("");

  const muatUlangKeranjang = () => {
    if (!session) {
      setItems([]);
      setCartLoaded(true);
      return;
    }

    ambilKeranjang(session.token)
      .then((isiKeranjang) => {
        setItems(isiKeranjang.map(ubahIsiKeranjangJadiCartItem).filter((item): item is CustomerCartItem => item !== null));
        setPesanError("");
      })
      .catch((error) => {
        setPesanError(error instanceof ApiError ? error.message : "Gagal memuat keranjang. Coba lagi nanti.");
      })
      .finally(() => setCartLoaded(true));
  };

  useEffect(muatUlangKeranjang, [session]);

  useEffect(() => {
    if (!pesanError) {
      return;
    }

    const timeoutId = window.setTimeout(() => setPesanError(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [pesanError]);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const kirimAksiKeranjang = async (item: CustomerCartItem, aksi: AksiKeranjang) => {
    if (!session) {
      openLogin();
      return;
    }

    const payload = item.type === "catering" ? { paket_id: item.id, jumlah: 1, aksi } : { menu_id: item.id, jumlah: 1, aksi };

    try {
      await ubahKeranjang(session.token, payload);
      notifyCustomerCartUpdated();
      muatUlangKeranjang();
    } catch (error) {
      setPesanError(error instanceof ApiError ? error.message : "Gagal mengubah keranjang. Coba lagi nanti.");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      return;
    }

    if (!session || session.peran !== "pelanggan") {
      openLogin();
      return;
    }

    if (!window.snap) {
      setPesanError("Layanan pembayaran belum siap, coba lagi sebentar.");
      return;
    }

    try {
      // Langkah 1: cuma hitung total & minta Snap Token, belum ada yang disimpan ke database
      const hasil = await checkoutRequest(session.token);

      // Simpan isi keranjang & total saat ini buat ditampilkan di struk kalau pembayaran sukses
      const salinanItem = items;
      const salinanTotal = { subtotal: hasil.subtotal, tax: hasil.pajak_10, total: hasil.total_akhir };

      // Langkah 2: baru dipanggil kalau popup Midtrans bilang sukses/pending - ini yang
      // beneran menyimpan pesanan ke database & mengosongkan keranjang di server.
      // Metode pembayarannya diambil dari hasil popup (payment_type), bukan pilihan manual.
      const konfirmasiKeServer = async (metodePembayaran: string, status: "diproses" | "menunggu_pembayaran") => {
        try {
          await konfirmasiPembayaranRequest(session.token, hasil.nomor_pesanan, metodePembayaran, status);
          notifyCustomerCartUpdated();
          muatUlangKeranjang();
        } catch (error) {
          setPesanError(error instanceof ApiError ? error.message : "Pembayaran diterima, tapi gagal mencatat pesanan. Hubungi kami.");
        }
      };

      window.snap.pay(hasil.snap_token, {
        onSuccess: (hasilPembayaran) => {
          konfirmasiKeServer(hasilPembayaran.payment_type, "diproses");
          setItemStruk(salinanItem);
          setTotalStruk(salinanTotal);
          setMetodeStruk(hasilPembayaran.payment_type);
          setOrderNumber(hasil.nomor_pesanan);
          setShowReceipt(true);
        },
        onPending: (hasilPembayaran) => {
          konfirmasiKeServer(hasilPembayaran.payment_type, "menunggu_pembayaran");
          setPesanError(`Pembayaran pesanan ${hasil.nomor_pesanan} masih tertunda. Selesaikan pembayaran untuk memproses pesanan.`);
        },
        onError: () => {
          setPesanError(`Pembayaran pesanan ${hasil.nomor_pesanan} gagal. Hubungi kami kalau saldo sudah terpotong.`);
        },
        onClose: () => {
          setPesanError("Jendela pembayaran ditutup. Pesanan belum dibuat, barang tetap ada di keranjang.");
        },
      });
    } catch (error) {
      setPesanError(error instanceof ApiError ? error.message : "Checkout gagal. Coba lagi nanti.");
    }
  };

  const handleNewOrder = () => {
    setShowReceipt(false);
    setOrderNumber("");
  };

  return (
    <section className="space-y-6">
      <Script src={MIDTRANS_SNAP_URL} data-client-key={MIDTRANS_CLIENT_KEY} strategy="afterInteractive" />

      <header>
        <h1 className="text-2xl font-bold text-[#2C2520]">Keranjang Belanja</h1>
        <p className="mt-2 text-[#2C2520]/65">Periksa pesananmu sebelum melakukan pembayaran.</p>
      </header>

      {pesanError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{pesanError}</div>}

      {!cartLoaded ? null : items.length === 0 ? (
        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-10 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-[#C08A57]" aria-hidden="true" />
          <h2 className="mt-3 font-bold text-[#2C2520]">Keranjang masih kosong</h2>
          <p className="mt-1 text-sm text-[#2C2520]/65">Tambahkan menu atau paket catering terlebih dahulu.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {items.map((item) => (
              <article key={`${item.type}-${item.id}`} className="flex gap-4 rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-4 shadow-sm">
                <Image src={item.image} alt={item.name} width={88} height={88} unoptimized={item.image.startsWith("data:")} className="h-22 w-22 rounded-xl object-cover" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#2C2520]">{item.name}</p>
                      <p className="mt-1 text-xs capitalize text-[#2C2520]/60">{item.type === "catering" ? `Catering - ${item.portions} porsi` : "Menu"}</p>
                    </div>

                    <button type="button" onClick={() => kirimAksiKeranjang(item, "hapus")} className="text-sm text-red-600 hover:underline">
                      Hapus
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#2C2520]">Rp {item.price.toLocaleString("id-ID")}</p>

                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => kirimAksiKeranjang(item, "kurangi")} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d3c5] bg-[#FCF9F6] font-bold text-[#2C2520]">
                        -
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold text-[#2C2520]">{item.quantity}</span>
                      <button type="button" onClick={() => kirimAksiKeranjang(item, "tambah")} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C08A57] font-bold text-white">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#2C2520]">Ringkasan Pesanan</h2>

            <div className="mt-5 space-y-3 border-b border-[#e2d3c5] pb-4 text-sm text-[#2C2520]/75">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak 10%</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#2C2520]">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button type="button" onClick={handleCheckout} className="mt-5 w-full rounded-xl bg-[#C08A57] py-3 font-bold text-white transition hover:bg-[#a97142]">
              Bayar Sekarang
            </button>
          </aside>
        </div>
      )}

      {showReceipt && (
        <ReceiptModal
          orderNumber={orderNumber}
          items={itemStruk.map((item) => ({ ...item, qty: item.quantity }))}
          subtotal={totalStruk.subtotal}
          tax={totalStruk.tax}
          total={totalStruk.total}
          paymentMethod={metodeStruk}
          onClose={handleNewOrder}
        />
      )}
    </section>
  );
}
