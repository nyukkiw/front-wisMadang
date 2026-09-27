// File untuk halaman ulasan pelanggan, menampilkan daftar ulasan yang telah dibuat dan form untuk membuat ulasan baru
"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Star, Trash2 } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import ReviewForm, { CUSTOMER_REVIEWS_KEY, CustomerReview } from "@/components/pelanggan/ReviewForm";

export default function CustomerReviewsPage() {
  const { session, openLogin } = useAuth();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [isNewReview, setIsNewReview] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [itemNames, setItemNames] = useState("");

  useEffect(() => {
    const savedReviews = localStorage.getItem(CUSTOMER_REVIEWS_KEY);

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {
        localStorage.removeItem(CUSTOMER_REVIEWS_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  const saveReviews = (nextReviews: CustomerReview[]) => {
    setReviews(nextReviews);
    localStorage.setItem(CUSTOMER_REVIEWS_KEY, JSON.stringify(nextReviews));
  };

  const handleCreateReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session || session.peran !== "pelanggan") {
      openLogin();
      return;
    }

    const review: CustomerReview = {
      id: `${orderNumber || "ulasan"}-${Date.now()}`,
      orderNumber: orderNumber.trim() || "Tanpa nomor pesanan",
      itemNames: itemNames
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      rating: 5,
      comment: "",
      createdAt: new Date().toISOString(),
    };

    setEditingReview(review);
    setIsNewReview(true);
    setOrderNumber("");
    setItemNames("");
  };

  const handleReviewUpdate = ({ rating, comment }: Pick<CustomerReview, "rating" | "comment">) => {
    if (!editingReview) return;

    const nextReview = { ...editingReview, rating, comment };
    saveReviews([nextReview, ...reviews.filter((review) => review.id !== editingReview.id)]);
    setEditingReview(null);
    setIsNewReview(false);
  };

  const handleReviewDelete = (id: string) => {
    if (!session || session.peran !== "pelanggan") {
      openLogin();
      return;
    }

    saveReviews(reviews.filter((review) => review.id !== id));
  };

  if (!isLoaded) return null;

  return (
    <section className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <MessageCircle className="h-7 w-7 text-[#E9785F]" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-[#2C2520]">Ulasan Pelanggan</h1>
        </div>
        <p className="mt-2 text-[#2C2520]/65">Bagikan pengalamanmu kapan saja dari menu ulasan ini.</p>
      </header>

      {editingReview ? (
        <div className="max-w-xl rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5">
          <ReviewForm
            orderNumber={editingReview.orderNumber}
            itemNames={editingReview.itemNames}
            initialReview={editingReview}
            isDraft={isNewReview}
            onSubmit={handleReviewUpdate}
            onCancel={() => {
              setEditingReview(null);
              setIsNewReview(false);
            }}
          />
        </div>
      ) : (
        <form onSubmit={handleCreateReview} className="max-w-xl space-y-4 rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5">
          <div>
            <h2 className="text-lg font-bold text-[#2C2520]">Tulis ulasan baru</h2>
            <p className="mt-1 text-sm text-[#2C2520]/65">Masukkan detail pesanan, lalu berikan rating dan komentar.</p>
          </div>
          <label className="block text-sm font-semibold text-[#2C2520]">
            Nomor pesanan
            <input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="Contoh: MADANG-2026-1024"
              className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#C08A57]/40"
            />
          </label>
          <label className="block text-sm font-semibold text-[#2C2520]">
            Menu yang dipesan
            <input
              value={itemNames}
              onChange={(event) => setItemNames(event.target.value)}
              placeholder="Pisahkan dengan koma"
              className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#C08A57]/40"
            />
          </label>
          <button type="submit" className="w-full rounded-xl bg-[#C08A57] px-4 py-3 font-bold text-white transition hover:bg-[#a97142]">
            Lanjutkan ke ulasan
          </button>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#2C2520]">Ulasan saya</h2>
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C08A57]/50 bg-[#F4EAE1] p-8 text-center">
            <p className="font-semibold text-[#2C2520]">Belum ada ulasan</p>
            <p className="mt-1 text-sm text-[#2C2520]/65">Ulasan yang kamu kirim akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex gap-1" aria-label={`Rating ${review.rating} dari 5`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-[#E9785F] text-[#E9785F]" : "text-[#d8c5b5]"}`} aria-hidden="true" />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-[#2C2520]/65">Pesanan {review.orderNumber}</p>
                  </div>
                  <div className="flex gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReview(review);
                        setIsNewReview(false);
                      }}
                      className="text-[#C08A57] hover:underline"
                    >
                      Edit
                    </button>
                    <button type="button" onClick={() => handleReviewDelete(review.id)} className="inline-flex items-center gap-1 text-red-600 hover:underline">
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Hapus
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm">{review.comment || "Tidak ada komentar."}</p>
                {review.itemNames.length > 0 && <p className="mt-2 text-xs text-[#2C2520]/60">{review.itemNames.join(", ")}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
