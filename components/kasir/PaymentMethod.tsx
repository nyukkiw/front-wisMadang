// File untuk menampilkan metode pembayaran yang tersedia untuk kasir

"use client";

interface PaymentMethodProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

const paymentMethods = [
  {
    id: "QRIS",
    name: "QRIS",
    icon: "📱",
  },
  {
    id: "Tunai",
    name: "Tunai",
    icon: "💵",
  },
  {
    id: "Transfer",
    name: "Transfer",
    icon: "🏦",
  },
];

export default function PaymentMethod({ selectedMethod, onChange }: PaymentMethodProps) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold text-[#174a43]">Metode Pembayaran</p>

      <div className="grid grid-cols-3 gap-2">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`rounded-xl border p-3 text-center transition ${isSelected ? "border-[#174a43] bg-[#174a43] text-white" : "border-[#dce8e2] bg-white text-[#174a43] hover:bg-[#e6efe9]"}`}
            >
              <div className="text-xl">{method.icon}</div>

              <p className="mt-1 text-xs font-semibold">{method.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
