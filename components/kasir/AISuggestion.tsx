// File untuk menampilkan rekomendasi AI untuk kasir

"use client";

import type { MenuItem } from "@/components/kasir/MenuCard";

interface AISuggestionProps {
  suggestions: MenuItem[];
  onAdd: (menu: MenuItem) => void;
}

export default function AISuggestion({ suggestions, onAdd }: AISuggestionProps) {
  // Jangan tampilkan apa-apa
  // jika tidak ada rekomendasi
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#dce8e2] bg-[#e6efe9] p-4">
      {/* Header AI */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#174a43] text-lg">✨</div>

        <div>
          <h3 className="font-bold text-[#174a43]">Saran AI</h3>

          <p className="text-xs text-gray-600">Pelanggan yang memesan menu ini mungkin juga menyukai:</p>
        </div>
      </div>

      {/* Daftar rekomendasi */}
      <div className="mt-3 space-y-2">
        {suggestions.map((menu) => (
          <div key={menu.id} className="flex items-center justify-between rounded-xl bg-white p-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{menu.image}</span>

              <div>
                <p className="text-sm font-semibold text-[#174a43]">{menu.name}</p>

                <p className="text-xs text-gray-500">Rp {menu.price.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <button onClick={() => onAdd(menu)} className="rounded-lg bg-[#174a43] px-3 py-2 text-xs font-semibold text-white hover:bg-[#123c36]">
              + Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
