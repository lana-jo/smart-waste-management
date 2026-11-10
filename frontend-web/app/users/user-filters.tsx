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
    <div className="flex w-full sm:w-fit flex-wrap items-center justify-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
      <span className="text-xs font-medium text-stone-600 dark:text-stone-400 px-2 whitespace-nowrap shrink-0">Status Akun:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onFilterChange(opt.value)}
          aria-pressed={currentFilter === opt.value}
          className={`min-h-11 px-3 py-1 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:outline-none ${
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
