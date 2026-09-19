// File untuk form ulasan pelanggan, digunakan di halaman kasir setelah pembayaran selesai

"use client";

import { FormEvent, useState } from "react";

export const CUSTOMER_REVIEWS_KEY = "wis-madang-customer-reviews";

export interface CustomerReview {
  id: string;
  orderNumber: string;
  itemNames: string[];
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewFormProps {
  orderNumber?: string;
  itemNames?: string[];
  initialReview?: CustomerReview;
  onSubmit: (review: Pick<CustomerReview, "rating" | "comment">) => void;
  onCancel?: () => void;
}

export default function ReviewForm({ orderNumber, itemNames = [], initialReview, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating ?? 5);
  const [comment, setComment] = useState(initialReview?.comment ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#2C2520]">{initialReview ? "Edit ulasan" : "Bagikan pengalamanmu"}</h2>
        {!initialReview && orderNumber && <p className="mt-1 text-sm text-[#2C2520]/65">Pesanan {orderNumber}</p>}
        {!initialReview && itemNames.length > 0 && <p className="mt-1 text-sm text-[#2C2520]/65">{itemNames.join(", ")}</p>}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-[#2C2520]">Rating</p>
        <div className="flex gap-2" aria-label="Pilih rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" aria-label={`${value} bintang`} aria-pressed={rating === value} onClick={() => setRating(value)} className={`text-3xl transition ${value <= rating ? "text-[#E9785F]" : "text-[#d8c5b5]"}`}>
              ★
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-semibold text-[#2C2520]">
        Ceritakan pengalamanmu
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Apa yang paling kamu sukai?"
          className="mt-2 w-full resize-none rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#C08A57]/40"
        />
      </label>

      <div className="flex gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-[#e2d3c5] px-4 py-3 font-semibold text-[#2C2520]">
            Batal
          </button>
        )}
        <button type="submit" className="flex-1 rounded-xl bg-[#C08A57] px-4 py-3 font-bold text-white transition hover:bg-[#a97142]">
          {initialReview ? "Simpan perubahan" : "Kirim ulasan"}
        </button>
      </div>
    </form>
  );
}
