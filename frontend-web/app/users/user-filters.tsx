"use client";

export type UserStatusFilter = "all" | "active" | "inactive";

interface Props {
  currentFilter: UserStatusFilter;
  onFilterChange: (status: UserStatusFilter) => void;
}

export function UserFilters({ currentFilter, onFilterChange }: Props) {
  const options: Array<{ label: string; value: UserStatusFilter }> = [
    { label: "Semua", value: "all" },
    { label: "Aktif", value: "active" },
    { label: "Nonaktif", value: "inactive" },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg w-fit">
      <span className="text-xs font-medium text-stone-500 dark:text-stone-400 px-2">Status Akun:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onFilterChange(opt.value)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            currentFilter === opt.value
              ? "bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold"
              : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
