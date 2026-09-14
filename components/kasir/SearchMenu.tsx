// File untuk fitur search menu item

"use client";

interface SearchMenuProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchMenu({ value, onChange }: SearchMenuProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari menu yang kamu mau..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:font-semibold placeholder:text-gray-600 focus:border-[#174C4F] focus:ring-2 focus:ring-[#174C4F]/10"
      />
    </div>
  );
}
