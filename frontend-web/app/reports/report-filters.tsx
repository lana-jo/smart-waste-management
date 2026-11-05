"use client";

import { type ChangeEvent, type FormEvent } from "react";
import { Search, Filter } from "lucide-react";

const STATUS_OPTIONS = ["", "Pending", "In Progress", "Completed", "Rejected"];

interface ReportFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
}

export function ReportFilters({
  searchInput,
  setSearchInput,
  filterStatus,
  setFilterStatus,
  onSearchSubmit,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-xl shadow-xs">
      <form onSubmit={onSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari laporan atau pelapor..."
            aria-label="Cari laporan"
            className="w-full pl-9 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-sm bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs shrink-0"
        >
          Cari
        </button>
      </form>

      <div className="flex items-center gap-2">
        <Filter size={16} className="text-stone-500 dark:text-stone-400 hidden sm:block" />
        <select
          value={filterStatus}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilterStatus(event.target.value)}
          aria-label="Filter status laporan"
          className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-sm bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "" ? "Semua Status" : option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
