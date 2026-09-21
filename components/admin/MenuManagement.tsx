// File untuk menampilkan dan mengelola menu item dalam bentuk daftar

"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { X } from "lucide-react";

import { CatalogItem, CatalogItemType, defaultCatalog, FALLBACK_IMAGE, getNextCatalogId, MENU_CATALOG_KEY, normalizeCatalogImage } from "@/lib/menuCatalog";

const emptyForm = {
  type: "menu" as CatalogItemType,
  name: "",
  description: "",
  price: "",
  image: "/IMG Wis Madang/Nasi Goreng.jpg",
  category: "nasi",
  portions: "",
  available: true,
  apakah_laris: false,
};

type MenuForm = typeof emptyForm;
type FilterType = "semua" | CatalogItemType;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
function normalizeImageSrc(src: unknown) {
  return normalizeCatalogImage(src);
}

function CatalogImage({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className: string }) {
  const safeSrc = normalizeImageSrc(src);
  const isExternalImage = safeSrc.startsWith("http://") || safeSrc.startsWith("https://");
  const isDataImage = safeSrc.startsWith("data:image/");

  if (isExternalImage || isDataImage) {
    return <img src={safeSrc} alt={alt} sizes={sizes} className={className} />;
  }

  return <Image src={safeSrc} alt={alt} fill sizes={sizes} className={className} />;
}

function loadCatalog() {
  const savedCatalog = localStorage.getItem(MENU_CATALOG_KEY);

  if (!savedCatalog) {
    return defaultCatalog;
  }

  try {
    const parsedCatalog = JSON.parse(savedCatalog);
    return Array.isArray(parsedCatalog) ? parsedCatalog.map((item) => ({ ...item, image: normalizeImageSrc(item?.image) })) : defaultCatalog;
  } catch {
    localStorage.removeItem(MENU_CATALOG_KEY);
    return defaultCatalog;
  }
}

export default function MenuManagement() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("semua");
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setCatalog(loadCatalog());
  }, []);

  const filteredCatalog = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return catalog.filter((item) => {
      const matchesFilter = filter === "semua" || item.type === filter;
      const matchesSearch = `${item.name} ${item.description}`.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [catalog, filter, search]);

  const persistCatalog = (nextCatalog: CatalogItem[]) => {
    try {
      localStorage.setItem(MENU_CATALOG_KEY, JSON.stringify(nextCatalog));
      setCatalog(nextCatalog);
      return true;
    } catch {
      setFormError("Gambar terlalu besar untuk disimpan di browser. Pilih gambar maksimal 2 MB.");
      return false;
    }
  };

  const openCreateForm = (type: CatalogItemType = "menu") => {
    setEditingId(null);
    setFormError("");
    setForm({ ...emptyForm, type, image: type === "catering" ? "/IMG Wis Madang/Nasi Box.jpg" : emptyForm.image });
    setShowForm(true);
  };

  const openEditForm = (item: CatalogItem) => {
    setEditingId(item.id);
    setFormError("");
    setForm({
      type: item.type,
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: normalizeImageSrc(item.image),
      category: item.category ?? "nasi",
      portions: item.portions ? String(item.portions) : "",
      available: item.available,
      apakah_laris: item.apakah_laris ?? false,
    });
    setShowForm(true);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError("File harus berupa gambar.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("Ukuran gambar maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((currentForm) => ({ ...currentForm, image: reader.result as string }));
        setFormError("");
      }
    };
    reader.onerror = () => setFormError("Gambar tidak dapat dibaca. Silakan pilih file lain.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const portions = Number(form.portions);

    if (!name || !description || !Number.isFinite(price) || price <= 0 || (form.type === "catering" && (!Number.isFinite(portions) || portions <= 0))) {
      setFormError("Lengkapi nama, deskripsi, harga, dan jumlah porsi catering dengan benar.");
      return;
    }

    const item: CatalogItem = {
      id: editingId ?? getNextCatalogId(catalog),
      type: form.type,
      name,
      description,
      price,
      image: normalizeImageSrc(form.image),
      available: form.available,
      ...(form.type === "menu" ? { category: form.category, rating: 0, review_count: 0, apakah_laris: form.apakah_laris } : { portions }),
    };

    const nextCatalog = editingId === null ? [item, ...catalog] : catalog.map((currentItem) => (currentItem.id === editingId ? item : currentItem));
    if (!persistCatalog(nextCatalog)) {
      return;
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Hapus item ini dari katalog?")) {
      return;
    }

    persistCatalog(catalog.filter((item) => item.id !== id));
  };

  const toggleAvailability = (id: number) => {
    persistCatalog(catalog.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#E9785F]">Katalog produk</p>
          <h1 className="mt-1 text-3xl font-bold text-[#2C2520]">Menu & Catering</h1>
          <p className="mt-2 text-[#2C2520]/65">Kelola semua produk yang tampil di area pelanggan dan kasir.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openCreateForm()} className="rounded-xl bg-[#174a43] px-4 py-3 text-sm font-bold text-white hover:bg-[#123c36]">
            + Tambah Produk
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] p-4 md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama atau deskripsi..."
          className="w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C08A57]/30 md:max-w-sm"
        />
        <div className="flex gap-2 overflow-x-auto">
          {(["semua", "menu", "catering"] as FilterType[]).map((option) => (
            <button key={option} type="button" onClick={() => setFilter(option)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${filter === option ? "bg-[#C08A57] text-white" : "bg-[#FCF9F6] text-[#2C2520]"}`}>
              {option === "semua" ? "Semua" : option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCatalog.map((item) => (
          <article key={`${item.type}-${item.id}`} className="overflow-hidden rounded-2xl border border-[#e2d3c5] bg-[#F4EAE1] shadow-sm">
            <div className="relative h-44 bg-[#EAF2ED]">
              <CatalogImage src={item.image} alt={item.name} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="absolute inset-0 h-full w-full object-cover" />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white ${item.type === "catering" ? "bg-[#E9785F]" : "bg-[#174a43]"}`}>{item.type === "catering" ? "Catering" : "Menu"}</span>
              {!item.available && <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Tidak tersedia</span>}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-[#2C2520]">{item.name}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase text-[#2C2520]/50">{item.type === "catering" ? `${item.portions} porsi` : item.category}</p>
                </div>
                <p className="font-bold text-[#2C2520]">Rp {item.price.toLocaleString("id-ID")}</p>
              </div>
              <p className="mt-3 min-h-10 text-sm text-[#2C2520]/65">{item.description}</p>
              <div className="mt-5 flex gap-2 border-t border-[#e2d3c5] pt-4">
                <button
                  type="button"
                  onClick={() => openEditForm(item)}
                  className="flex-1 rounded-lg border border-[#C08A57] px-3 py-2 text-sm font-bold text-[#C08A57] transition-colors hover:bg-[#C08A57] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C08A57]/50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggleAvailability(item.id)}
                  className="flex-1 rounded-lg bg-[#174a43] px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#123c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#174a43]/50"
                >
                  {item.available ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Hapus ${item.name}`}
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/50"
                >
                  Hapus
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredCatalog.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#C08A57] bg-[#F4EAE1] p-12 text-center">
          <p className="font-bold">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-[#2C2520]/65">Coba kata kunci lain atau tambahkan produk baru.</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="my-8 w-full max-w-2xl rounded-2xl bg-[#F4EAE1] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#E9785F]">{editingId === null ? "Produk baru" : "Perbarui produk"}</p>
                <h2 className="mt-1 text-2xl font-bold">{editingId === null ? "Tambah ke katalog" : "Edit produk"}</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="text-2xl text-[#2C2520]/60" aria-label="Tutup form">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold">
                Jenis
                <select
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value as CatalogItemType })}
                  disabled={editingId !== null}
                  className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal"
                >
                  <option value="menu">Menu</option>
                  <option value="catering">Catering</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                Nama
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal" />
              </label>
              <label className="text-sm font-semibold">
                Harga
                <input required min="1" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal" />
              </label>
              {form.type === "menu" ? (
                <label className="text-sm font-semibold">
                  Kategori
                  <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal">
                    <option value="nasi">Nasi</option>
                    <option value="lauk">Lauk</option>
                    <option value="sayur">Sayur</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </label>
              ) : (
                <label className="text-sm font-semibold">
                  Jumlah porsi
                  <input
                    required
                    min="1"
                    type="number"
                    value={form.portions}
                    onChange={(event) => setForm({ ...form, portions: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal"
                  />
                </label>
              )}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">
                  Gambar produk
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="mt-2 block w-full rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-[#174a43] file:px-3 file:py-2 file:font-semibold file:text-white"
                  />
                </label>
                <p className="mt-1 text-xs text-[#2C2520]/60">PNG, JPG, atau WebP. Maksimal 2 MB.</p>
                <div className="relative mt-3 h-36 overflow-hidden rounded-xl bg-[#EAF2ED]">
                  <CatalogImage src={form.image} alt="Preview gambar produk" sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </div>
              <label className="text-sm font-semibold md:col-span-2">
                Deskripsi
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="mt-2 w-full resize-none rounded-xl border border-[#e2d3c5] bg-[#FCF9F6] px-3 py-3 font-normal"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input type="checkbox" checked={form.available} onChange={(event) => setForm({ ...form, available: event.target.checked })} className="h-4 w-4 accent-[#174a43]" />
                Tersedia untuk dijual
              </label>
              {form.type === "menu" && (
                <label className="flex items-center gap-3 text-sm font-semibold">
                  <input type="checkbox" checked={form.apakah_laris} onChange={(event) => setForm({ ...form, apakah_laris: event.target.checked })} className="h-4 w-4 accent-[#E9785F]" />
                  Tandai sebagai menu populer
                </label>
              )}
            </div>
            {formError && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{formError}</p>}
            <div className="mt-6 flex justify-end gap-3 border-t border-[#e2d3c5] pt-5">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-[#e2d3c5] px-5 py-3 font-semibold">
                Batal
              </button>
              <button type="submit" className="rounded-xl bg-[#C08A57] px-5 py-3 font-bold text-white">
                {editingId === null ? "Simpan produk" : "Simpan perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
