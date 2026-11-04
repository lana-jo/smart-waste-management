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
  if (authLoading || (role === "admin" && usersCount === 0 && status !== "ready")) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-stone-500 gap-2" role="status">
        <Loader2 className="animate-spin" size={20} />
        <span>Memuat manajemen pengguna...</span>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Shield size={24} />
        </div>
        <p className="text-sm text-rose-600 font-medium">Anda tidak memiliki akses ke halaman manajemen pengguna.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <p role="alert" className="text-sm text-rose-600 font-medium">{error}</p>
        <button
          type="button"
          onClick={onReload}
          className="w-full px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return null;
}
