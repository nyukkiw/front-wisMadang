// File untuk menampilkan struk digital setelah pembayaran berhasil di kasir

"use client";

import Image from "next/image";

interface ReceiptItem {
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface ReceiptModalProps {
  orderNumber: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  onNewOrder: () => void;
}

export default function ReceiptModal({ orderNumber, items, subtotal, tax, total, paymentMethod, onNewOrder }: ReceiptModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal */}
      <div className="w-full max-w-md rounded-2xl bg-[#f8f5ed] p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6efe9] text-2xl">✓</div>

          <h2 className="mt-3 text-xl font-bold text-[#174a43]">Pembayaran Berhasil</h2>

          <p className="mt-1 text-sm text-gray-500">Struk digital transaksi</p>
        </div>

        {/* Nomor pesanan */}
        <div className="mt-5 rounded-xl bg-[#e6efe9] p-4 text-center">
          <p className="text-xs text-gray-500">Nomor Pesanan</p>

          <p className="mt-1 font-mono text-lg font-bold text-[#174a43]">{orderNumber}</p>
        </div>

        {/* Daftar item */}
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image src={item.image} alt={item.name} width={32} height={32} className="h-8 w-8 rounded object-cover" />

                <div>
                  <p className="text-sm font-medium text-[#174a43]">{item.name}</p>

                  <p className="text-xs text-gray-500">
                    {item.qty} × Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold">Rp {(item.price * item.qty).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </div>

        {/* Ringkasan */}
        <div className="mt-5 border-t border-[#dce8e2] pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>

            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>

          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-600">Pajak 10%</span>

            <span>Rp {tax.toLocaleString("id-ID")}</span>
          </div>

          <div className="mt-3 flex justify-between border-t border-[#dce8e2] pt-3">
            <span className="font-bold text-[#174a43]">Total</span>

            <span className="font-bold text-[#174a43]">Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Metode pembayaran */}
        <div className="mt-4 flex justify-between rounded-xl bg-white p-3 text-sm">
          <span className="text-gray-600">Pembayaran</span>

          <span className="font-semibold text-[#174a43]">{paymentMethod}</span>
        </div>

        {/* Tombol Pesanan Baru */}
        <button onClick={onNewOrder} className="mt-5 w-full rounded-xl bg-[#e98272] py-3 font-bold text-white transition hover:opacity-90">
          Pesanan Baru
        </button>
      </div>
    </div>
  );
}
