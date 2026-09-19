"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import PaymentMethod from "@/components/kasir/PaymentMethod"; // Komponen untuk memilih metode pembayaran
import ReceiptModal from "@/components/kasir/ReceiptModal"; // Komponen modal struk pembayaran
import ReviewForm, { CUSTOMER_REVIEWS_KEY, CustomerReview } from "@/components/pelanggan/ReviewForm";
import { notifyCustomerCartUpdated } from "@/components/pelanggan/CartNotification";

const CUSTOMER_CART_KEY = "wis-madang-customer-cart";

interface CustomerCartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "menu" | "catering";
  description?: string;
  portions?: number;
}

export default function CustomerCart() {
  const [items, setItems] = useState<CustomerCartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [showReceipt, setShowReceipt] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem(CUSTOMER_CART_KEY);

    if (!savedCart) {
      setCartLoaded(true);
      return;
    }

    try {
      setItems(JSON.parse(savedCart));
    } catch {
      localStorage.removeItem(CUSTOMER_CART_KEY);
    }

    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (!cartLoaded) {
      return;
    }

    localStorage.setItem(CUSTOMER_CART_KEY, JSON.stringify(items));
    notifyCustomerCartUpdated();
  }, [items, cartLoaded]);

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const updateQuantity = (id: number, type: CustomerCartItem["type"], change: number) => {
    setItems((currentItems) => currentItems.map((item) => (item.id === id && item.type === type ? { ...item, quantity: item.quantity + change } : item)).filter((item) => item.quantity > 0));
  };

  const removeItem = (id: number, type: CustomerCartItem["type"]) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id || item.type !== type));
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    const number = `MADANG-${new Date().getFullYear()}-` + `${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

    setOrderNumber(number);
    setShowReceipt(true);
  };

  const handleNewOrder = () => {
    setItems([]);
    setPaymentMethod("QRIS");
    setShowReview(false);
    setShowReceipt(false);
    setOrderNumber("");
  };

  const handleReviewSubmit = ({ rating, comment }: Pick<CustomerReview, "rating" | "comment">) => { // event handler untuk submit ulasan pelanggan
    const savedReviews = localStorage.getItem(CUSTOMER_REVIEWS_KEY);
    let reviews: CustomerReview[] = [];

    if (savedReviews) {
      try {
        reviews = JSON.parse(savedReviews);
      } catch {
        localStorage.removeItem(CUSTOMER_REVIEWS_KEY);
      }
    }

    const review: CustomerReview = { // membuat objek ulasan baru dengan informasi yang diberikan
      id: `${orderNumber}-${Date.now()}`,
      orderNumber,
      itemNames: items.map((item) => item.name),
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(CUSTOMER_REVIEWS_KEY, JSON.stringify([review, ...reviews])); // menyimpan ulasan baru ke localStorage, menambahkan di awal array ulasan yang sudah ada
    setShowReview(false);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#2C2520]">Keranjang Belanja</h1>
        <p className="mt-2 text-[#2C2520]/65">Periksa pesananmu sebelum melakukan pembayaran.</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-10 text-center">
          <p className="text-4xl">🛒</p>
          <h2 className="mt-3 font-bold text-[#2C2520]">Keranjang masih kosong</h2>
          <p className="mt-1 text-sm text-[#2C2520]/65">Tambahkan menu atau paket catering terlebih dahulu.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            {items.map((item) => (
              <article key={`${item.type}-${item.id}`} className="flex gap-4 rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-4 shadow-sm">
                <Image src={item.image} alt={item.name} width={88} height={88} className="h-22 w-22 rounded-xl object-cover" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#2C2520]">{item.name}</p>
                      <p className="mt-1 text-xs capitalize text-[#2C2520]/60">{item.type === "catering" ? `Catering - ${item.portions} porsi` : "Menu"}</p>
                    </div>

                    <button type="button" onClick={() => removeItem(item.id, item.type)} className="text-sm text-red-600 hover:underline">
                      Hapus
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#2C2520]">Rp {item.price.toLocaleString("id-ID")}</p>

                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(item.id, item.type, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e2d3c5] bg-[#FCF9F6] font-bold text-[#2C2520]">
                        -
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold text-[#2C2520]">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.type, 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C08A57] font-bold text-white">
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

            <PaymentMethod selectedMethod={paymentMethod} onChange={setPaymentMethod} />

            <button type="button" onClick={handleCheckout} className="mt-5 w-full rounded-xl bg-[#C08A57] py-3 font-bold text-white transition hover:bg-[#a97142]">
              Bayar Sekarang
            </button>
          </aside>
        </div>
      )}

      {showReceipt && (
        <ReceiptModal
          orderNumber={orderNumber}
          items={items.map((item) => ({ ...item, qty: item.quantity }))}
          subtotal={subtotal}
          tax={tax}
          total={total}
          paymentMethod={paymentMethod}
          onNewOrder={handleNewOrder}
          onReview={() => setShowReview(true)}
        />
      )}

      {showReview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#F4EAE1] p-6 shadow-2xl">
            <ReviewForm orderNumber={orderNumber} itemNames={items.map((item) => item.name)} onSubmit={handleReviewSubmit} onCancel={() => setShowReview(false)} />
          </div>
        </div>
      )}
    </section>
  );
}
