import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function UserSearch({ value, onChange }: Props) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-stone-400" />
      </div>
      <input
        type="text"
        placeholder="Cari pengguna..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-stone-200 rounded-lg text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-xs"
      />
    </div>
  );
}