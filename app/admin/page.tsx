// File untuk halaman dashboard admin, menampilkan ringkasan bisnis WIS MADANG

"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError, RingkasanDashboard, ambilRingkasanDashboard } from "@/lib/api";
import { useMenuCatalog } from "@/lib/useMenuCatalog";

export default function AdminDashboard() {
  const { session } = useAuth();
  const { catalog } = useMenuCatalog();
  const [ringkasan, setRingkasan] = useState<RingkasanDashboard | null>(null);
  const [pesanError, setPesanError] = useState("");

  useEffect(() => {
    if (!session) {
      return;
    }

    ambilRingkasanDashboard(session.token)
      .then(setRingkasan)
      .catch((error) => setPesanError(error instanceof ApiError ? error.message : "Gagal memuat ringkasan dashboard."));
  }, [session]);

  useEffect(() => {
    if (!pesanError) {
      return;
    }

    const timeoutId = window.setTimeout(() => setPesanError(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [pesanError]);

  const ratedMenus = useMemo(() => catalog.filter((item) => (item.review_count ?? 0) > 0), [catalog]);
  const averageMenuRating = ratedMenus.length === 0 ? 0 : ratedMenus.reduce((total, item) => total + (item.rating ?? 0), 0) / ratedMenus.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2C2520]">Dashboard</h1>

      <p className="mt-2 text-[#2C2520]/65">Ringkasan bisnis WIS MADANG hari ini.</p>

      {pesanError && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pesanError}</p>}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-6 shadow-sm">
          <p className="text-sm text-[#2C2520]/65">Omzet Hari Ini</p>

          <h2 className="mt-2 text-2xl font-bold">Rp{(ringkasan?.omzet_hari_ini ?? 0).toLocaleString("id-ID")}</h2>
        </div>

        <div className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-6 shadow-sm">
          <p className="text-sm text-[#2C2520]/65">Total Pesanan Hari Ini</p>

          <h2 className="mt-2 text-2xl font-bold">{ringkasan?.total_pesanan_hari_ini ?? 0}</h2>
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
          {catalog.map((item) => (
            <article key={`${item.type}-${item.id}`} className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2C2520]/50">{item.type === "catering" ? "Catering" : "Menu"}</p>
                  <h3 className="mt-1 font-bold text-[#2C2520]">{item.name}</h3>
                </div>
                <div className="flex items-center gap-1 font-bold text-[#2C2520]">
                  <Star className="h-4 w-4 fill-[#E9785F] text-[#E9785F]" aria-hidden="true" />
                  {(item.rating ?? 0).toFixed(1)}
                </div>
              </div>
              <p className="mt-3 text-sm text-[#2C2520]/60">{item.review_count ?? 0} ulasan pelanggan</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
