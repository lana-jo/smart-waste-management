"use client";

import { Users } from "lucide-react";
import type { UserStatusFilter } from "./user-filters";

interface UserEmptyStateProps {
  statusFilter: UserStatusFilter;
  searchQuery: string;
}

function emptyStateCopy(statusFilter: UserStatusFilter, searchQuery: string): { title: string; hint: string } {
  if (searchQuery.trim() !== "") {
    return { title: "Tidak ada pengguna yang cocok", hint: "Ubah kata kunci pencarian atau pilih status akun lain." };
  }
  if (statusFilter === "active") {
    return { title: "Belum ada pengguna aktif", hint: "Buka filter Nonaktif untuk melihat akun yang dinonaktifkan." };
  }
  if (statusFilter === "inactive") {
    return { title: "Belum ada pengguna nonaktif", hint: "Pilih filter Semua untuk melihat seluruh akun." };
  }
  return { title: "Belum ada pengguna terdaftar", hint: "Tambahkan akun pertama agar tim dapat mengelola laporan." };
}

export function UserEmptyState({ statusFilter, searchQuery }: UserEmptyStateProps) {
  const { title, hint } = emptyStateCopy(statusFilter, searchQuery);
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 sm:p-12 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center mx-auto" aria-hidden="true">
        <Users size={24} />
      </div>
      <p className="text-base font-semibold text-stone-900 dark:text-stone-100">{title}</p>
      <p className="text-sm text-stone-500 dark:text-stone-400">{hint}</p>
    </div>
  );
}
