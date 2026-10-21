// File untuk filtering menu item berdasarkan kategori

"use client";

interface Kategori {
  id: string;
  name: string;
}

interface MenuFilterProps {
  categories: Kategori[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function MenuFilter({ categories, selectedCategory, onCategoryChange }: MenuFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((kategori) => {
        const aktif = selectedCategory === kategori.id;

        return (
          <button
            key={kategori.id}
            type="button"
            onClick={() => onCategoryChange(kategori.id)}
            className={`
              whitespace-nowrap rounded-full px-4 py-2
              text-sm font-medium transition
              ${aktif ? "bg-[#C08A57] text-white" : "bg-[#F4EAE1] text-[#2C2520] hover:bg-[#C08A57]/20"}
            `}
          >
            {kategori.name}
          </button>
        );
      })}
    </div>
  );
}
