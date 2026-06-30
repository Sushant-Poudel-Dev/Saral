"use client";

import { Search } from "lucide-react";

interface TopSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function TopSearchBar({
  value,
  onChange,
  placeholder = "Search documents...",
}: TopSearchBarProps) {
  return (
    <div className="relative max-w-2xl w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white border border-[var(--darkblue)]/15 focus:border-honey rounded-2xl text-sm text-[var(--darkblue)] placeholder:text-[var(--darkblue)]/50 outline-none transition-all shadow-sm"
      />
    </div>
  );
}
