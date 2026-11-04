"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { apiFetch } from "../lib/api";
import { type ReportStats } from "../lib/types";
import { useAuth } from "../lib/auth-context";
import { DashboardStatsGrid, DashboardCharts } from "./dashboard-widgets";

export default function AdminDashboard() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data: ReportStats = await apiFetch<ReportStats>("/api/reports/stats");
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat ringkasan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {
    if (isLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState terjadi setelah await, bukan sinkron.
    void loadStats();
  }, [isLoading, loadStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-stone-500 gap-2" role="status">
        <RefreshCcw className="animate-spin" size={20} />
        <span>Memuat data ringkasan operasional...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white border border-stone-200 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900">Gagal Memuat Dashboard</h2>
          <p role="alert" className="text-sm text-stone-600 mt-1">{error ?? "Data ringkasan belum tersedia."}</p>
        </div>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="w-full px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 uppercase tracking-wide">
              Ringkasan Sistem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-2">
            Dashboard Utama Operasional
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Analisis waktu nyata aliran laporan sampah dan performa penanganan tim lapangan.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => void loadStats()}
            className="flex items-center gap-2 px-3.5 py-2 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-950 transition-colors shadow-xs"
          >
            <RefreshCcw size={16} />
            Muat Ulang
          </button>
        </div>
      </div>

      <DashboardStatsGrid stats={stats} />
      <DashboardCharts stats={stats} />
    </div>
  );
}
