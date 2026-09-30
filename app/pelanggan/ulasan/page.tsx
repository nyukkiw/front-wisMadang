// File untuk halaman ulasan pelanggan - pilih pesanan yang pernah dibuat, beri rating & ulasan per item

"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Star } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ApiDetailPesanan, ApiError, ApiPesanan, UlasanItemPayload, ambilRiwayatPesanan, kirimUlasanRequest } from "@/lib/api";

interface FormUlasanItem {
  menuId?: number;
  paketId?: number;
  nama: string;
  rating: number;
  komentar: string;
}

function namaItemDariDetail(detail: ApiDetailPesanan) {
  return detail.menu?.nama_menu ?? detail.paket_catering?.nama_paket ?? "Item";
}

export default function CustomerReviewsPage() {
  const { session } = useAuth();
  const [riwayat, setRiwayat] = useState<ApiPesanan[]>([]);
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");
  const [pesananDipilih, setPesananDipilih] = useState<ApiPesanan | null>(null);
  const [formUlasan, setFormUlasan] = useState<FormUlasanItem[]>([]);
  const [sedangMengirim, setSedangMengirim] = useState(false);

  const muatRiwayat = () => {
    if (!session) {
      setRiwayat([]);
      return;
    }

    ambilRiwayatPesanan(session.token)
      .then(setRiwayat)
      .catch((error) => setPesanError(error instanceof ApiError ? error.message : "Gagal memuat riwayat pesanan."));
  };

  useEffect(muatRiwayat, [session]);

  useEffect(() => {
    if (!pesanError) {
      return;
    }

    const timeoutId = window.setTimeout(() => setPesanError(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [pesanError]);

  useEffect(() => {
    if (!pesanSukses) {
      return;
    }

    const timeoutId = window.setTimeout(() => setPesanSukses(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [pesanSukses]);

  const pilihPesanan = (pesanan: ApiPesanan) => {
    setPesananDipilih(pesanan);

    const form: FormUlasanItem[] = pesanan.detail_pesanan.map((detail) => {
      const ulasanLama = pesanan.ulasan.find((ulasan) => (detail.menu_id ? ulasan.menu_id === detail.menu_id : ulasan.paket_id === detail.paket_id));

      return {
        menuId: detail.menu_id ?? undefined,
        paketId: detail.paket_id ?? undefined,
        nama: namaItemDariDetail(detail),
        rating: ulasanLama?.rating ?? 5,
        komentar: ulasanLama?.komentar ?? "",
      };
    });

    setFormUlasan(form);
  };

  const batalPilihPesanan = () => {
    setPesananDipilih(null);
    setFormUlasan([]);
  };

  const ubahRatingItem = (index: number, rating: number) => {
    setFormUlasan((current) => current.map((item, i) => (i === index ? { ...item, rating } : item)));
  };

  const ubahKomentarItem = (index: number, komentar: string) => {
    setFormUlasan((current) => current.map((item, i) => (i === index ? { ...item, komentar } : item)));
  };

  const kirimSemuaUlasan = async () => {
    if (!session || !pesananDipilih) {
      return;
    }

    setSedangMengirim(true);

    const payload: UlasanItemPayload[] = formUlasan.map((item) => ({
      menu_id: item.menuId,
      paket_id: item.paketId,
      rating: item.rating,
      komentar: item.komentar.trim() || undefined,
    }));

    try {
      await kirimUlasanRequest(session.token, pesananDipilih.id, payload);
      setPesanSukses("Ulasan berhasil dikirim, terima kasih!");
      batalPilihPesanan();
      muatRiwayat();
    } catch (error) {
      setPesanError(error instanceof ApiError ? error.message : "Gagal mengirim ulasan.");
    } finally {
      setSedangMengirim(false);
    }
  };

  const semuaUlasan = riwayat
    .flatMap((pesanan) =>
      pesanan.ulasan.map((ulasan) => {
        const detail = pesanan.detail_pesanan.find((item) => (ulasan.menu_id ? item.menu_id === ulasan.menu_id : item.paket_id === ulasan.paket_id));

        return {
          ...ulasan,
          namaItem: detail ? namaItemDariDetail(detail) : "Item",
        };
      }),
    )
    .sort((a, b) => new Date(b.dibuat_pada).getTime() - new Date(a.dibuat_pada).getTime());

  if (!session) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-[#2C2520]">Ulasan Pelanggan</h1>
        <p className="text-[#2C2520]/65">Masuk dulu buat lihat dan memberi ulasan pesananmu.</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <MessageCircle className="h-7 w-7 text-[#E9785F]" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-[#2C2520]">Ulasan Pelanggan</h1>
        </div>
        <p className="mt-2 text-[#2C2520]/65">Pilih pesanan yang pernah kamu buat, lalu beri rating dan ulasan tiap item-nya.</p>
      </header>

      {pesanError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{pesanError}</div>}
      {pesanSukses && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{pesanSukses}</div>}

      <div>
        <h2 className="text-lg font-bold text-[#2C2520]">Pesanan Saya</h2>

        {riwayat.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-[#C08A57]/50 bg-[#F4EAE1] p-8 text-center">
            <p className="font-semibold text-[#2C2520]">Belum ada pesanan</p>
            <p className="mt-1 text-sm text-[#2C2520]/65">Pesanan yang kamu buat akan muncul di sini.</p>
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {riwayat.map((pesanan) => (
              <button
                key={pesanan.id}
                type="button"
                onClick={() => pilihPesanan(pesanan)}
                className={`rounded-2xl border p-4 text-left transition ${pesananDipilih?.id === pesanan.id ? "border-[#C08A57] bg-[#F4EAE1]" : "border-[#e2d3c5] bg-[#FCF9F6] hover:border-[#C08A57]/60"}`}
              >
                <p className="font-bold text-[#2C2520]">{pesanan.id}</p>
                <p className="mt-2 text-sm text-[#2C2520]/65">{pesanan.detail_pesanan.map((detail) => namaItemDariDetail(detail)).join(", ")}</p>
                <p className="mt-2 text-sm font-semibold text-[#2C2520]">Rp {Number(pesanan.total_bayar).toLocaleString("id-ID")}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {pesananDipilih && (
        <div className="space-y-4 rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5">
          <div>
            <h2 className="text-lg font-bold text-[#2C2520]">Beri ulasan - {pesananDipilih.id}</h2>
            <p className="mt-1 text-sm text-[#2C2520]/65">Kasih rating & komentar buat tiap item di pesanan ini.</p>
          </div>

          <div className="space-y-4">
            {formUlasan.map((item, index) => (
              <div key={`${item.menuId ?? "paket"}-${item.paketId ?? index}`} className="rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] p-4">
                <p className="font-semibold text-[#2C2520]">{item.nama}</p>

                <div className="mt-2 flex gap-1" aria-label={`Pilih rating untuk ${item.nama}`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" aria-label={`${value} bintang`} aria-pressed={item.rating === value} onClick={() => ubahRatingItem(index, value)}>
                      <Star className={`h-6 w-6 ${value <= item.rating ? "fill-[#E9785F] text-[#E9785F]" : "text-[#d8c5b5]"}`} aria-hidden="true" />
                    </button>
                  ))}
                </div>

                <textarea
                  value={item.komentar}
                  onChange={(event) => ubahKomentarItem(index, event.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Ceritakan pengalamanmu (opsional)"
                  className="mt-3 w-full resize-none rounded-xl border border-[#e2d3c5] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C08A57]/40"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={batalPilihPesanan} className="flex-1 rounded-xl border border-[#e2d3c5] px-4 py-3 font-semibold text-[#2C2520]">
              Batal
            </button>
            <button
              type="button"
              disabled={sedangMengirim}
              onClick={kirimSemuaUlasan}
              className="flex-1 rounded-xl bg-[#C08A57] px-4 py-3 font-bold text-white transition hover:bg-[#a97142] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sedangMengirim ? "Mengirim..." : "Kirim Semua Ulasan"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#2C2520]">Ulasan saya</h2>
        {semuaUlasan.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C08A57]/50 bg-[#F4EAE1] p-8 text-center">
            <p className="font-semibold text-[#2C2520]">Belum ada ulasan</p>
            <p className="mt-1 text-sm text-[#2C2520]/65">Ulasan yang kamu kirim akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {semuaUlasan.map((ulasan) => (
              <article key={ulasan.id} className="rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-5">
                <div className="flex gap-1" aria-label={`Rating ${ulasan.rating} dari 5`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < ulasan.rating ? "fill-[#E9785F] text-[#E9785F]" : "text-[#d8c5b5]"}`} aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-1 text-sm text-[#2C2520]/65">
                  {ulasan.namaItem} - Pesanan {ulasan.pesanan_id}
                </p>
                <p className="mt-3 text-sm">{ulasan.komentar || "Tidak ada komentar."}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
