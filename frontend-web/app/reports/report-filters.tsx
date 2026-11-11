"use client";

import { type ChangeEvent, type FormEvent } from "react";
import { Search, Filter } from "lucide-react";
import { REPORT_STATUS_OPTIONS } from "./report-status";

const STATUS_OPTIONS = ["", ...REPORT_STATUS_OPTIONS];

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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-xl shadow-xs">
      <form onSubmit={onSearchSubmit} className="flex items-center gap-2 flex-1 min-w-0 w-full sm:max-w-md">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" aria-hidden="true" />
          <label htmlFor="report-search-input" className="sr-only">Cari laporan atau pelapor</label>
          <input
            id="report-search-input"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari laporan..."
            className="w-full min-h-11 pl-9 pr-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-sm sm:text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="min-h-11 px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:ring-offset-stone-900"
        >
          Cari
        </button>
      </form>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter size={16} className="text-stone-500 dark:text-stone-400 hidden sm:block" aria-hidden="true" />
        <label htmlFor="report-status-filter" className="sr-only">Filter status laporan</label>
        <select
          id="report-status-filter"
          value={filterStatus}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilterStatus(event.target.value)}
          className="w-full sm:w-auto min-h-11 px-3.5 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:ring-offset-stone-900"
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
