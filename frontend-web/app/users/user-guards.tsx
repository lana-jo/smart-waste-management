"use client";

import { Loader2, Shield, AlertCircle } from "lucide-react";

interface Props {
  authLoading: boolean;
  role: string | null;
  usersCount: number;
  status: string;
  error: string | null;
  onReload: () => void;
}

export function UserGuards({ authLoading, role, usersCount, status, error, onReload }: Props) {
  if (authLoading || (role === "admin" && usersCount === 0 && (status === "idle" || status === "loading"))) {
    return (
      <div className="flex items-center justify-center px-4 min-h-[50vh] text-stone-500 dark:text-stone-400 gap-2" role="status">
        <Loader2 className="animate-spin" size={20} />
        <span>Memuat manajemen pengguna...</span>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="max-w-md mx-4 sm:mx-auto mt-12 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Shield size={24} />
        </div>
        <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">Anda tidak memiliki akses ke halaman manajemen pengguna.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-4 sm:mx-auto mt-12 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        <button
          type="button"
          onClick={onReload}
          className="w-full min-h-11 px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return null;
}
