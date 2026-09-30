// File untuk menampilkan dan mengelola menu & paket catering (tersambung ke backend asli)

"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { X } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  ApiError,
  ApiKategori,
  ApiMenu,
  ApiPaketCatering,
  MenuPayload,
  PaketCateringPayload,
  ambilDaftarKategori,
  ambilDaftarMenu,
  ambilDaftarPaketCatering,
  buatMenu,
  buatPaketCatering,
  hapusMenu,
  hapusPaketCatering,
  ubahMenu,
  ubahPaketCatering,
  uploadGambarMenu,
  uploadGambarPaketCatering,
} from "@/lib/api";
import { FALLBACK_IMAGE } from "@/lib/menuCatalog";

type JenisItem = "menu" | "catering";

interface ItemTampilan {
  jenis: JenisItem;
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  tersedia: boolean;
  kategoriId?: number;
  namaKategori?: string;
  porsi?: number;
  apakahLaris?: boolean;
  gambarUrl?: string | null;
}

interface FormState {
  jenis: JenisItem;
  nama: string;
  deskripsi: string;
  harga: string;
  kategoriId: string;
  porsi: string;
  apakahLaris: boolean;
}

const formKosong: FormState = {
  jenis: "menu",
  nama: "",
  deskripsi: "",
  harga: "",
  kategoriId: "",
  porsi: "",
  apakahLaris: false,
};

function ubahMenuJadiItemTampilan(menu: ApiMenu): ItemTampilan {
  return {
    jenis: "menu",
    id: menu.id,
    nama: menu.nama_menu,
    deskripsi: menu.deskripsi ?? "",
    harga: Number(menu.harga),
    tersedia: menu.status_stok === "tersedia",
    kategoriId: menu.kategori_id,
    namaKategori: menu.kategori.nama_kategori,
    apakahLaris: menu.apakah_laris,
    gambarUrl: menu.gambar_url,
  };
}

function ubahPaketJadiItemTampilan(paket: ApiPaketCatering): ItemTampilan {
  return {
    jenis: "catering",
    id: paket.id,
    nama: paket.nama_paket,
    deskripsi: paket.deskripsi ?? "",
    harga: Number(paket.harga_paket),
    tersedia: true, // paket catering belum punya status tersedia/habis di backend
    porsi: paket.porsi,
    gambarUrl: paket.gambar_url,
  };
}

export default function MenuManagement() {
  const { session } = useAuth();

  const [daftarMenu, setDaftarMenu] = useState<ApiMenu[]>([]);
  const [daftarPaket, setDaftarPaket] = useState<ApiPaketCatering[]>([]);
  const [daftarKategori, setDaftarKategori] = useState<ApiKategori[]>([]);
  const [pesanError, setPesanError] = useState("");

  const [pencarian, setPencarian] = useState("");
  const [filterJenis, setFilterJenis] = useState<"semua" | JenisItem>("semua");

  const [form, setForm] = useState<FormState>(formKosong);
  const [sedangEdit, setSedangEdit] = useState<{ jenis: JenisItem; id: number } | null>(null);
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [pesanFormError, setPesanFormError] = useState("");
  const [sedangKirim, setSedangKirim] = useState(false);
  const [fileGambar, setFileGambar] = useState<File | null>(null);
  const [previewGambar, setPreviewGambar] = useState<string | null>(null);

  const muatUlangData = () => {
    Promise.all([ambilDaftarMenu(), ambilDaftarPaketCatering()])
      .then(([menu, paket]) => {
        setDaftarMenu(menu);
        setDaftarPaket(paket);
        setPesanError("");
      })
      .catch((error) => setPesanError(error instanceof ApiError ? error.message : "Gagal memuat data. Coba lagi nanti."));
  };

  useEffect(() => {
    muatUlangData();
    ambilDaftarKategori()
      .then(setDaftarKategori)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!pesanError) {
      return;
    }

    const timeoutId = window.setTimeout(() => setPesanError(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [pesanError]);

  const gabunganItem: ItemTampilan[] = useMemo(() => [...daftarMenu.map(ubahMenuJadiItemTampilan), ...daftarPaket.map(ubahPaketJadiItemTampilan)], [daftarMenu, daftarPaket]);

  const itemTersaring = useMemo(() => {
    const kataKunci = pencarian.trim().toLowerCase();

    return gabunganItem.filter((item) => {
      const cocokJenis = filterJenis === "semua" || item.jenis === filterJenis;
      const cocokPencarian = `${item.nama} ${item.deskripsi}`.toLowerCase().includes(kataKunci);
      return cocokJenis && cocokPencarian;
    });
  }, [gabunganItem, filterJenis, pencarian]);

  const bukaFormTambah = (jenis: JenisItem = "menu") => {
    setSedangEdit(null);
    setPesanFormError("");
    setForm({ ...formKosong, jenis, kategoriId: jenis === "menu" && daftarKategori[0] ? String(daftarKategori[0].id) : "" });
    setFileGambar(null);
    setPreviewGambar(null);
    setFormTerbuka(true);
  };

  const bukaFormEdit = (item: ItemTampilan) => {
    setSedangEdit({ jenis: item.jenis, id: item.id });
    setPesanFormError("");
    setForm({
      jenis: item.jenis,
      nama: item.nama,
      deskripsi: item.deskripsi,
      harga: String(item.harga),
      kategoriId: item.kategoriId ? String(item.kategoriId) : "",
      porsi: item.porsi ? String(item.porsi) : "",
      apakahLaris: item.apakahLaris ?? false,
    });
    setFileGambar(null);
    setPreviewGambar(item.gambarUrl ?? null);
    setFormTerbuka(true);
  };

  const pilihFileGambar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPesanFormError("File harus berupa gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPesanFormError("Ukuran gambar maksimal 2 MB.");
      return;
    }

    setFileGambar(file);
    setPreviewGambar(URL.createObjectURL(file));
  };

  const kirimForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPesanFormError("");

    if (!session) {
      return;
    }

    const nama = form.nama.trim();
    const deskripsi = form.deskripsi.trim();
    const harga = Number(form.harga);

    if (!nama || !deskripsi || !Number.isFinite(harga) || harga <= 0) {
      setPesanFormError("Lengkapi nama, deskripsi, dan harga dengan benar.");
      return;
    }

    setSedangKirim(true);

    try {
      if (form.jenis === "menu") {
        const kategoriId = Number(form.kategoriId);

        if (!kategoriId) {
          setPesanFormError("Pilih kategori menu.");
          setSedangKirim(false);
          return;
        }

        const payload: MenuPayload = {
          kategori_id: kategoriId,
          nama_menu: nama,
          harga,
          deskripsi,
          apakah_laris: form.apakahLaris,
        };

        const menuTersimpan = sedangEdit && sedangEdit.jenis === "menu" ? await ubahMenu(session.token, sedangEdit.id, payload) : await buatMenu(session.token, payload);

        if (fileGambar) {
          await uploadGambarMenu(session.token, menuTersimpan.id, fileGambar);
        }
      } else {
        const porsi = Number(form.porsi);

        if (!Number.isFinite(porsi) || porsi <= 0) {
          setPesanFormError("Isi jumlah porsi dengan benar.");
          setSedangKirim(false);
          return;
        }

        const payload: PaketCateringPayload = {
          nama_paket: nama,
          harga_paket: harga,
          deskripsi,
          porsi,
        };

        const paketTersimpan = sedangEdit && sedangEdit.jenis === "catering" ? await ubahPaketCatering(session.token, sedangEdit.id, payload) : await buatPaketCatering(session.token, payload);

        if (fileGambar) {
          await uploadGambarPaketCatering(session.token, paketTersimpan.id, fileGambar);
        }
      }

      setFormTerbuka(false);
      muatUlangData();
    } catch (error) {
      setPesanFormError(error instanceof ApiError ? error.message : "Gagal menyimpan. Coba lagi nanti.");
    } finally {
      setSedangKirim(false);
    }
  };

  const hapusItem = async (item: ItemTampilan) => {
    if (!session || !window.confirm(`Hapus ${item.nama} dari katalog?`)) {
      return;
    }

    try {
      if (item.jenis === "menu") {
        await hapusMenu(session.token, item.id);
      } else {
        await hapusPaketCatering(session.token, item.id);
      }

      muatUlangData();
    } catch (error) {
      setPesanError(error instanceof ApiError ? error.message : "Gagal menghapus. Coba lagi nanti.");
    }
  };

  const ubahStatusTersedia = async (item: ItemTampilan) => {
    if (!session || item.jenis !== "menu") {
      return;
    }

    try {
      await ubahMenu(session.token, item.id, { status_stok: item.tersedia ? "habis" : "tersedia" });
      muatUlangData();
    } catch (error) {
      setPesanError(error instanceof ApiError ? error.message : "Gagal mengubah status. Coba lagi nanti.");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#E9785F]">Katalog produk</p>
          <h1 className="mt-1 text-3xl font-bold text-[#2C2520]">Menu & Catering</h1>
          <p className="mt-2 text-[#2C2520]/65">Kelola semua produk yang tampil di area pelanggan dan transaksi penjual.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => bukaFormTambah("menu")} className="rounded-xl bg-[#174a43] px-4 py-3 text-sm font-bold text-white hover:bg-[#123c36]">
            + Tambah Item
          </button>
        </div>
      </header>

      {pesanError && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{pesanError}</div>}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-4 md:flex-row md:items-center md:justify-between">
        <input
          value={pencarian}
          onChange={(event) => setPencarian(event.target.value)}
          placeholder="Cari nama atau deskripsi..."
          className="w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C08A57]/30 md:max-w-sm"
        />
        <div className="flex gap-2 overflow-x-auto">
          {(["semua", "menu", "catering"] as const).map((opsi) => (
            <button key={opsi} type="button" onClick={() => setFilterJenis(opsi)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${filterJenis === opsi ? "bg-[#C08A57] text-white" : "bg-[#FCF9F6] text-[#2C2520]"}`}>
              {opsi === "semua" ? "Semua" : opsi}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {itemTersaring.map((item) => (
          <article key={`${item.jenis}-${item.id}`} className="overflow-hidden rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] shadow-sm">
            <div className="relative h-44 bg-[#EAF2ED]">
              <Image src={item.gambarUrl ?? FALLBACK_IMAGE} alt={item.nama} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${item.jenis === "catering" ? "bg-[#E9785F]" : "bg-[#174a43]"}`}>{item.jenis === "catering" ? "Catering" : "Menu"}</span>
              {!item.tersedia && <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Tidak tersedia</span>}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-[#2C2520]">{item.nama}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase text-[#2C2520]/50">{item.jenis === "catering" ? `${item.porsi} porsi` : item.namaKategori}</p>
                </div>
                <p className="font-bold text-[#2C2520]">Rp {item.harga.toLocaleString("id-ID")}</p>
              </div>
              <p className="mt-3 min-h-10 text-sm text-[#2C2520]/65">{item.deskripsi}</p>
              <div className="mt-5 flex gap-2 border-t border-[#e2d3c5] pt-4">
                <button
                  type="button"
                  onClick={() => bukaFormEdit(item)}
                  className="flex-1 rounded-lg border border-[#C08A57] px-3 py-2 text-sm font-bold text-[#C08A57] transition-colors hover:bg-[#C08A57] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C08A57]/50"
                >
                  Edit
                </button>
                {item.jenis === "menu" && (
                  <button
                    type="button"
                    onClick={() => ubahStatusTersedia(item)}
                    className="flex-1 rounded-lg bg-[#174a43] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#123c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174a43]/50"
                  >
                    {item.tersedia ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => hapusItem(item)}
                  aria-label={`Hapus ${item.nama}`}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/50"
                >
                  Hapus
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {itemTersaring.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#C08A57] bg-[#F4EAE1] p-12 text-center">
          <p className="font-bold">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-[#2C2520]/65">Coba kata kunci lain atau tambahkan produk baru.</p>
        </div>
      )}

      {formTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={kirimForm} className="my-8 w-full max-w-2xl rounded-2xl bg-[#F4EAE1] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#E9785F]">{sedangEdit === null ? "Produk baru" : "Perbarui produk"}</p>
                <h2 className="mt-1 text-2xl font-bold">{sedangEdit === null ? "Tambah ke katalog" : "Edit produk"}</h2>
              </div>
              <button type="button" onClick={() => setFormTerbuka(false)} className="text-2xl text-[#2C2520]/60" aria-label="Tutup form">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold">
                Jenis
                <select
                  value={form.jenis}
                  onChange={(event) => setForm({ ...form, jenis: event.target.value as JenisItem })}
                  disabled={sedangEdit !== null}
                  className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal"
                >
                  <option value="menu">Menu</option>
                  <option value="catering">Catering</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Nama
                <input required value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold">
                Harga
                <input required min="1" type="number" value={form.harga} onChange={(event) => setForm({ ...form, harga: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal" />
              </label>
              {form.jenis === "menu" ? (
                <label className="text-sm font-semibold">
                  Kategori
                  <select value={form.kategoriId} onChange={(event) => setForm({ ...form, kategoriId: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal">
                    {daftarKategori.map((kategori) => (
                      <option key={kategori.id} value={kategori.id}>
                        {kategori.nama_kategori}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="text-sm font-semibold">
                  Jumlah porsi
                  <input required min="1" type="number" value={form.porsi} onChange={(event) => setForm({ ...form, porsi: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal" />
                </label>
              )}
              <label className="text-sm font-semibold md:col-span-2">
                Deskripsi
                <textarea
                  required
                  rows={3}
                  value={form.deskripsi}
                  onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
                  className="mt-2 w-full resize-none rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal"
                />
              </label>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">
                  Gambar produk
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pilihFileGambar} className="mt-2 block w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-[#174a43] file:px-3 file:py-2 file:font-semibold file:text-white" />
                </label>
                <p className="mt-1 text-xs text-[#2C2520]/60">PNG, JPG, atau WebP. Maksimal 2 MB.</p>
                {previewGambar && (
                  <div className="relative mt-3 h-36 overflow-hidden rounded-xl bg-[#EAF2ED]">
                    <Image src={previewGambar} alt="Preview gambar produk" fill sizes="100vw" className="object-cover" unoptimized={previewGambar.startsWith("blob:")} />
                  </div>
                )}
              </div>
              {form.jenis === "menu" && (
                <label className="flex items-center gap-3 text-sm font-semibold">
                  <input type="checkbox" checked={form.apakahLaris} onChange={(event) => setForm({ ...form, apakahLaris: event.target.checked })} className="h-4 w-4 accent-[#E9785F]" />
                  Tandai sebagai menu populer
                </label>
              )}
            </div>
            {pesanFormError && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{pesanFormError}</p>}
            <div className="mt-6 flex justify-end gap-3 border-t border-[#e2d3c5] pt-5">
              <button type="button" onClick={() => setFormTerbuka(false)} className="rounded-xl border border-[#e2d3c5] px-5 py-3 font-semibold">
                Batal
              </button>
              <button type="submit" disabled={sedangKirim} className="rounded-xl bg-[#C08A57] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {sedangKirim ? "Menyimpan..." : sedangEdit === null ? "Simpan produk" : "Simpan perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
