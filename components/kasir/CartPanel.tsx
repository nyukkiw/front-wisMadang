"use client";
import Image from "next/image";
import AISuggestion from "@/components/kasir/AISuggestion";
import type { MenuItem } from "@/components/kasir/MenuCard";
import PaymentMethod from "@/components/kasir/PaymentMethod";

export interface CartItem extends MenuItem {
  qty: number;
}

interface CartPanelProps {
  cart: CartItem[];
  suggestions: MenuItem[];
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onAddSuggestion: (menu: MenuItem) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onPay: () => void;
}

export default function CartPanel({ cart, suggestions, paymentMethod, onPaymentMethodChange, onAddSuggestion, onIncrease, onDecrease, onRemove, onPay }: CartPanelProps) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#2C2520]">Pesanan</h2>
      <div className="mt-4 space-y-3">
        {cart.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">Belum ada menu dipilih.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <Image src={item.image} alt={item.name} width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#2C2520]">{item.name}</p>
                <p className="text-xs text-gray-500">Rp {item.price.toLocaleString("id-ID")}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={() => onDecrease(item.id)} aria-label={`Kurangi ${item.name}`} className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-lg font-bold leading-none text-gray-800 hover:bg-gray-200">
                    -
                  </button>
                  <span className="min-w-5 text-center text-sm font-bold text-gray-900">{item.qty}</span>
                  <button type="button" onClick={() => onIncrease(item.id)} aria-label={`Tambah ${item.name}`} className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-lg font-bold leading-none text-gray-800 hover:bg-gray-200">
                    +
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => onRemove(item.id)} className="text-xs text-red-500">
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
      <AISuggestion suggestions={suggestions} onAdd={onAddSuggestion} />
      <PaymentMethod selectedMethod={paymentMethod} onChange={onPaymentMethodChange} />
      <div className="mt-5 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between font-semibold text-gray-800">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="mt-2 flex justify-between font-semibold text-gray-800">
          <span>Pajak 10%</span>
          <span>Rp {tax.toLocaleString("id-ID")}</span>
        </div>
        <div className="mt-3 flex justify-between text-base font-bold text-[#2C2520]">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <button type="button" disabled={cart.length === 0} onClick={onPay} className="mt-5 w-full rounded-xl bg-[#C08A57] py-3 font-bold text-white transition hover:bg-[#a97142] disabled:cursor-not-allowed disabled:opacity-50">
        Bayar Sekarang
      </button>
    </div>
  );
}
