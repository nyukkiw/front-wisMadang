// File untuk fitur search menu item

"use client";

import { Search } from "lucide-react";

interface SearchMenuProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchMenu({ value, onChange }: SearchMenuProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari menu yang kamu mau..."
        className="w-full rounded-xl border border-[#e2d3c5] bg-[#F4EAE1] py-3 pl-11 pr-4 text-sm font-medium text-[#2C2520] outline-none transition placeholder:font-semibold placeholder:text-[#2C2520]/60 focus:border-[#C08A57] focus:ring-2 focus:ring-[#C08A57]/20"
      />
    </div>
  );
}
