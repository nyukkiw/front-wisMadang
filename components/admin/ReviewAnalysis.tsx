// File untuk halaman analisis ulasan admin, menampilkan ringkasan ulasan pelanggan dan insight berbasis AI

"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Sparkles, Star } from "lucide-react";

import { CUSTOMER_REVIEWS_KEY, CustomerReview } from "@/components/pelanggan/ReviewForm";

const simulatedReviews: CustomerReview[] = [
  {
    id: "simulasi-1",
    orderNumber: "MADANG-2026-1024",
    itemNames: ["Nasi Goreng", "Es Teh"],
    rating: 5,
    comment: "Nasi gorengnya enak dan porsinya pas. Es tehnya segar, pasti pesan lagi!",
    createdAt: "2026-09-19T10:30:00.000Z",
  },
  {
    id: "simulasi-2",
    orderNumber: "MADANG-2026-1021",
    itemNames: ["Gurame Goreng", "Nasi Putih"],
    rating: 4,
    comment: "Rasanya enak dan guramenya renyah. Waktu tunggunya agak lama saat ramai.",
    createdAt: "2026-09-18T07:15:00.000Z",
  },
  {
    id: "simulasi-3",
    orderNumber: "MADANG-2026-1018",
    itemNames: ["Tahu Goreng", "Kopi Hitam"],
    rating: 3,
    comment: "Menu cukup enak, tetapi minumannya kurang dingin. Semoga bisa diperbaiki.",
    createdAt: "2026-09-17T04:45:00.000Z",
  },
];

type Sentiment = "Positif" | "Netral" | "Perlu perhatian";

function getSentiment(review: CustomerReview): Sentiment {
  if (review.rating >= 3) return "Positif";
  if (review.rating <= 2) return "Perlu perhatian";
  return "Netral";
}

interface MenuReviewSummary {
  name: string;
  reviewCount: number;
  averageRating: number;
  positivePercentage: number;
  poorPercentage: number;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export default function ReviewAnalysis() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingSimulation, setUsingSimulation] = useState(false);
  const [filter, setFilter] = useState<"Semua" | Sentiment>("Semua");

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

  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return { average: "0.0", positive: 0, needsAttention: 0, topTopic: "Belum ada data" };
    }

    const average = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
    const positive = reviews.filter((review) => getSentiment(review) === "Positif").length;
    const needsAttention = reviews.filter((review) => getSentiment(review) === "Perlu perhatian").length;
    const topicWords = ["rasa", "porsi", "pelayanan", "waktu", "minuman"];
    const topTopic = topicWords.map((topic) => ({ topic, count: reviews.filter((review) => review.comment.toLowerCase().includes(topic)).length })).sort((first, second) => second.count - first.count)[0];

    return { average: average.toFixed(1), positive, needsAttention, topTopic: topTopic.count > 0 ? topTopic.topic : "Kualitas menu" };
  }, [reviews]);

  const menuSummaries = useMemo(() => {
    const menuReviews = new Map<string, CustomerReview[]>();

    reviews.forEach((review) => {
      review.itemNames.forEach((itemName) => {
        const name = itemName.trim();

        if (!name) {
          return;
        }

        const existingReviews = menuReviews.get(name) ?? [];
        menuReviews.set(name, [...existingReviews, review]);
      });
    });

    return Array.from(menuReviews.entries())
      .map(([name, itemReviews]): MenuReviewSummary => {
        const positiveCount = itemReviews.filter((review) => review.rating >= 3).length;
        const poorCount = itemReviews.filter((review) => review.rating <= 2).length;
        const averageRating = itemReviews.reduce((total, review) => total + review.rating, 0) / itemReviews.length;

        return {
          name,
          reviewCount: itemReviews.length,
          averageRating,
          positivePercentage: (positiveCount / itemReviews.length) * 100,
          poorPercentage: (poorCount / itemReviews.length) * 100,
        };
      })
      .sort((first, second) => second.averageRating - first.averageRating);
  }, [reviews]);

  const highestRatedMenu = menuSummaries[0] ?? null;
  const lowestRatedMenu = menuSummaries[menuSummaries.length - 1] ?? null;

  const filteredReviews = reviews.filter((review) => filter === "Semua" || getSentiment(review) === filter);

  const loadSimulation = () => {
    setReviews(simulatedReviews);
    setUsingSimulation(true);
    setFilter("Semua");
  };

  if (!isLoaded) return null;

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E9785F]">Customer voice</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2C2520]">Review & Analisis AI</h1>
          <p className="mt-2 max-w-2xl text-[#2C2520]/65">Pantau ulasan yang masuk dan dapatkan rangkuman otomatis untuk membantu menentukan prioritas perbaikan.</p>
        </div>
        <button type="button" onClick={loadSimulation} className="rounded-xl bg-[#174C4F] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#103d3f]">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Muat simulasi AI
          </span>
        </button>
      </header>

      {usingSimulation && <p className="rounded-xl border border-[#C08A57]/40 bg-[#fff7ec] px-4 py-3 text-sm text-[#79502e]">Mode simulasi aktif. Data ini tidak disimpan ke ulasan pelanggan.</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total ulasan", reviews.length.toString(), "ulasan masuk"],
          ["Rating rata-rata", summary.average, "dari 5 bintang"],
          ["Sentimen positif", `${summary.positive}`, "ulasan positif"],
          ["Topik utama", summary.topTopic, "paling sering dibahas"],
        ].map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 shadow-sm">
            <p className="text-sm text-[#2C2520]/60">{label}</p>
            <p className="mt-2 truncate text-2xl font-bold text-[#2C2520]">{value}</p>
            <p className="mt-1 text-xs text-[#2C2520]/55">{detail}</p>
          </div>
        ))}
      </div>

      <section>
        <div>
          <h2 className="text-xl font-bold text-[#2C2520]">Performa Menu</h2>
          <p className="mt-1 text-sm text-[#2C2520]/60">Perbandingan menu berdasarkan rating dari ulasan pelanggan.</p>
        </div>

        {highestRatedMenu && lowestRatedMenu ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {[
              { label: "Rating tertinggi", menu: highestRatedMenu, accent: "border-[#8fc9aa]" },
              { label: "Rating terendah", menu: lowestRatedMenu, accent: "border-[#e8a398]" },
            ].map(({ label, menu, accent }) => (
              <article key={label} className={`rounded-2xl border-2 ${accent} bg-[#F4EAE1] p-5 shadow-sm`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#2C2520]/60">{label}</p>
                    <h3 className="mt-1 text-xl font-bold text-[#2C2520]">{menu.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#2C2520]">{menu.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-[#2C2520]/55">dari 5 bintang</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#FCF9F6] p-3">
                    <p className="text-lg font-bold text-[#2C2520]">{menu.reviewCount}</p>
                    <p className="text-xs text-[#2C2520]/55">Ulasan</p>
                  </div>
                  <div className="rounded-xl bg-[#dcefe7] p-3">
                    <p className="text-lg font-bold text-[#27664e]">{menu.positivePercentage.toFixed(0)}%</p>
                    <p className="text-xs text-[#27664e]">Positif (≥3)</p>
                  </div>
                  <div className="rounded-xl bg-[#fde2dc] p-3">
                    <p className="text-lg font-bold text-[#a5483b]">{menu.poorPercentage.toFixed(0)}%</p>
                    <p className="text-xs text-[#a5483b]">Jelek (≤2)</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-[#C08A57]/50 bg-[#F4EAE1] p-6 text-sm text-[#2C2520]/60">Belum ada ulasan menu untuk dianalisis.</div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#2C2520]">Ulasan terbaru</h2>
              <p className="mt-1 text-sm text-[#2C2520]/60">Klik filter untuk memprioritaskan respons admin.</p>
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as "Semua" | Sentiment)}
              className="rounded-lg border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-2 text-sm text-[#2C2520] outline-none focus:ring-2 focus:ring-[#C08A57]/40"
            >
              <option>Semua</option>
              <option>Positif</option>
              <option>Netral</option>
              <option>Perlu perhatian</option>
            </select>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#C08A57]/50 bg-[#FCF9F6] p-8 text-center">
              <MessageCircle className="mx-auto h-9 w-9 text-[#C08A57]" aria-hidden="true" />
              <p className="mt-2 font-semibold text-[#2C2520]">Belum ada ulasan untuk ditampilkan</p>
              <p className="mt-1 text-sm text-[#2C2520]/60">Gunakan simulasi AI untuk mencoba alur analisis.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {filteredReviews.map((review) => {
                const sentiment = getSentiment(review);
                return (
                  <article key={review.id} className="rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                      <div>
                        <p className="font-semibold text-[#2C2520]">{review.itemNames.join(", ")}</p>
                        <p className="mt-1 text-xs text-[#2C2520]/55">
                          {review.orderNumber} · {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${sentiment === "Positif" ? "bg-[#dcefe7] text-[#27664e]" : sentiment === "Netral" ? "bg-[#fff1d8] text-[#946b2c]" : "bg-[#fde2dc] text-[#a5483b]"}`}
                      >
                        {sentiment}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#2C2520]/80">{review.comment || "Tidak ada komentar tertulis."}</p>
                    <div className="mt-3 flex gap-1" aria-label={`Rating ${review.rating} dari 5`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-[#E9785F] text-[#E9785F]" : "text-[#d8c5b5]"}`} aria-hidden="true" />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-[#174C4F] p-5 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9785F]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-bold">Insight AI</h2>
              <p className="text-xs text-white/65">Simulasi berbasis rating dan kata kunci</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-6 text-white/80">
            <p>
              <strong className="text-white">Ringkasan:</strong> {summary.positive > summary.needsAttention ? "Pelanggan cenderung puas dengan pengalaman makan." : "Ada beberapa ulasan yang perlu segera ditindaklanjuti."}
            </p>
            <p>
              <strong className="text-white">Sinyal utama:</strong> Topik “{summary.topTopic}” paling sering muncul dalam ulasan yang dianalisis.
            </p>
            <p>
              <strong className="text-white">Saran aksi:</strong>{" "}
              {summary.needsAttention > 0 ? "Tinjau ulasan dengan sentimen perlu perhatian dan siapkan respons pelanggan." : "Pertahankan kualitas menu dan minta pelanggan memberikan ulasan setelah transaksi."}
            </p>
          </div>
          <div className="mt-6 border-t border-white/15 pt-4 text-xs text-white/55">Insight ini adalah simulasi lokal, bukan hasil model AI eksternal.</div>
        </aside>
      </div>
    </section>
  );
}
