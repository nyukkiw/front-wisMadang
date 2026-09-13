// File untuk menampilkan panel keranjang belanja

"use client";

import { MenuItem } from "./MenuCard";

export interface CartItem extends MenuItem {
  qty: number;
}

interface CartPanelProps { 
  cart: CartItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function CartPanel({ cart, onIncrease, onDecrease, onRemove }: CartPanelProps) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const tax = subtotal * 0.1;

  const total = subtotal + tax;

  return (
    <aside className="flex h-full flex-col rounded-2xl bg-white shadow-sm">
      {/* Header */}
      <div className="border-b px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#174C4F]">Pesanan Aktif</h2>

            <p className="mt-1 text-xs text-gray-500">Pesanan #{String(1).padStart(4, "0")}</p>
          </div>

          <span className="rounded-full bg-[#EAF2ED] px-3 py-1 text-xs font-medium text-[#174C4F]">{cart.length} item</span>
        </div>
      </div>

      {/* Item */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {cart.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <div className="text-5xl">🛒</div>

            <h3 className="mt-4 font-semibold text-gray-700">Keranjang masih kosong</h3>

            <p className="mt-1 text-sm text-gray-400">Pilih menu untuk membuat pesanan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="rounded-xl bg-[#F7F7F2] p-3">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF2ED] text-2xl">{item.image}</div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-gray-800">{item.name}</h3>

                      <button type="button" onClick={() => onRemove(item.id)} className="text-xs text-red-500 hover:underline">
                        Hapus
                      </button>
                    </div>

                    <p className="mt-1 text-sm font-semibold text-[#174C4F]">
                      Rp
                      {item.price.toLocaleString("id-ID")}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border bg-white">
                        <button type="button" onClick={() => onDecrease(item.id)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm font-semibold">{item.qty}</span>

                        <button type="button" onClick={() => onIncrease(item.id)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold">
                        Rp
                        {(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t p-5">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>

            <span>Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Pajak 10%</span>

            <span>Rp{tax.toLocaleString("id-ID")}</span>
          </div>

          <div className="my-3 border-t" />

          <div className="flex justify-between text-base font-bold text-[#174C4F]">
            <span>Total</span>

            <span>Rp{total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          className="mt-5 w-full rounded-xl bg-[#E9785F] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          Bayar Rp
          {total.toLocaleString("id-ID")}
        </button>
      </div>
    </aside>
  );
}
