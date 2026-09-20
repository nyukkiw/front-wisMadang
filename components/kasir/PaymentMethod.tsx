// File untuk menampilkan metode pembayaran yang tersedia untuk kasir

"use client";

import { Banknote, Building2, QrCode, type LucideIcon } from "lucide-react";

interface PaymentMethodProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const paymentMethods = [
  {
    id: "QRIS",
    name: "QRIS",
    icon: QrCode,
  },
  {
    id: "Tunai",
    name: "Tunai",
    icon: Banknote,
  },
  {
    id: "Transfer",
    name: "Transfer",
    icon: Building2,
  },
] satisfies Array<{ id: string; name: string; icon: LucideIcon }>;

export default function PaymentMethod({ selectedMethod, onChange }: PaymentMethodProps) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-[#2C2520]">Metode Pembayaran</p>

      <div className="grid grid-cols-3 gap-2">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;

          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`rounded-xl border p-3 text-center transition ${isSelected ? "border-[#C08A57] bg-[#C08A57] text-white" : "border-[#e2d3c5] bg-[#FCF9F6] text-[#2C2520] hover:bg-[#C08A57]/20"}`}
            >
              <Icon className="mx-auto h-6 w-6" aria-hidden="true" />

              <p className="mt-1 text-xs font-semibold">{method.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
