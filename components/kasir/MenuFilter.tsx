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
              ${active ? "bg-[#174C4F] text-white" : "bg-white text-gray-600 hover:bg-[#EAF2ED]"}
            `}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
