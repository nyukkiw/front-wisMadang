// File untuk filtering menu item berdasarkan kategori

"use client";

interface Category {
  id: string;
  name: string;
}

interface MenuFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function MenuFilter({ categories, selectedCategory, onCategoryChange }: MenuFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const active = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`
              whitespace-nowrap rounded-full px-4 py-2
              text-sm font-medium transition
              ${active ? "bg-[#C08A57] text-white" : "bg-[#F4EAE1] text-[#2C2520] hover:bg-[#C08A57]/20"}
            `}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
