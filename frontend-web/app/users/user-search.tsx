import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function UserSearch({ value, onChange }: Props) {
  return (
    <div className="relative min-w-0 flex-1 w-full sm:max-w-sm">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" aria-hidden="true" />
      <label htmlFor="user-search-input" className="sr-only">Cari nama atau email pengguna</label>
      <input
        id="user-search-input"
        type="search"
        placeholder="Cari nama atau email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full min-h-11 pl-9 pr-3 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 transition-colors shadow-xs"
      />
    </div>
  );
}
