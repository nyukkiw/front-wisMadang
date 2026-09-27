// File untuk halaman dashboard admin, menampilkan ringkasan bisnis WIS MADANG

"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

import { CUSTOMER_REVIEWS_KEY, CustomerReview } from "@/components/pelanggan/ReviewForm";
import { useMenuCatalog } from "@/lib/useMenuCatalog";

// File untuk halaman dashboard admin, menampilkan ringkasan bisnis WIS MADANG

export default function AdminDashboard() {
  const catalog = useMenuCatalog();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    const savedReviews = localStorage.getItem(CUSTOMER_REVIEWS_KEY);

    if (!savedReviews) {
      return;
    }

    try {
      setReviews(JSON.parse(savedReviews));
    } catch {
      localStorage.removeItem(CUSTOMER_REVIEWS_KEY);
    }
  }, []);

  const menuRatings = useMemo(
    () =>
      catalog.map((item) => {
        const itemReviews = reviews.filter((review) => review.itemNames.some((itemName) => itemName.trim().toLowerCase() === item.name.trim().toLowerCase()));
        const rating = itemReviews.length === 0 ? 0 : itemReviews.reduce((total, review) => total + review.rating, 0) / itemReviews.length;

        return { ...item, rating, reviewCount: itemReviews.length };
      }),
    [catalog, reviews],
  );

  const ratedMenus = menuRatings.filter((item) => item.reviewCount > 0);
  const averageMenuRating = ratedMenus.length === 0 ? 0 : ratedMenus.reduce((total, item) => total + item.rating, 0) / ratedMenus.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2C2520]">Dashboard</h1>

      <p className="mt-2 text-[#2C2520]/65">Ringkasan bisnis WIS MADANG hari ini.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-6 shadow-sm">
          <p className="text-sm text-[#2C2520]/65">Omzet Hari Ini</p>

          <h2 className="mt-2 text-2xl font-bold">Rp2.450.000</h2>
        </div>

        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-6 shadow-sm">
          <p className="text-sm text-[#2C2520]/65">Total Pesanan</p>

          <h2 className="mt-2 text-2xl font-bold">48</h2>
        </div>

        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-6 shadow-sm">
          <p className="text-sm text-[#2C2520]/65">Rating Rata-rata Menu</p>

          <h2 className="mt-2 flex items-center gap-1 text-2xl font-bold">
            <Star className="h-6 w-6 fill-[#E9785F] text-[#E9785F]" aria-hidden="true" />
            {averageMenuRating.toFixed(1)}
          </h2>
          <p className="mt-1 text-xs text-[#2C2520]/55">Dari {ratedMenus.length} menu yang sudah dinilai</p>
        </div>
      </div>

      <section className="mt-8">
        <div>
          <h2 className="text-xl font-bold text-[#2C2520]">Rating Menu dan Catering</h2>
          <p className="mt-1 text-sm text-[#2C2520]/65">Produk tanpa ulasan pelanggan ditampilkan dengan rating 0.0.</p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuRatings.map((item) => (
            <article key={`${item.type}-${item.id}`} className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2C2520]/50">{item.type === "catering" ? "Catering" : "Menu"}</p>
                  <h3 className="mt-1 font-bold text-[#2C2520]">{item.name}</h3>
                </div>
                <div className="flex items-center gap-1 font-bold text-[#2C2520]">
                  <Star className="h-4 w-4 fill-[#E9785F] text-[#E9785F]" aria-hidden="true" />
                  {item.rating.toFixed(1)}
                </div>
              </div>
              <p className="mt-3 text-sm text-[#2C2520]/60">{item.reviewCount} ulasan pelanggan</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
