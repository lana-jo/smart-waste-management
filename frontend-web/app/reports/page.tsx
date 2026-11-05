"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, AlertCircle, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import { ReportTable, type ReportItem } from "./report-table";
import { ReportFilters } from "./report-filters";

interface ReportPage {
  items: ReportItem[];
  total: number;
  limit: number;
  offset: number;
}

export default function ReportsManagementPage() {
  const { token, role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (search) params.set("search", search);
      params.set("limit", "50");
      params.set("offset", "0");

      const data: ReportPage = await apiFetch<ReportPage>(`/api/reports?${params.toString()}`);
      setReports(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat daftar laporan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus, search, router]);

  useEffect(() => {
    if (authLoading) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; setState terjadi setelah await, bukan sinkron.
    void loadReports();
  }, [authLoading, loadReports]);

  const handleStatusChange = async (reportId: string, status: string) => {
    setUpdatingId(reportId);
    setStatusError(null);
    setStatusMessage(null);
    try {
      await apiFetch<ReportItem>(`/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setStatusMessage("Status laporan berhasil diperbarui.");
      await loadReports();
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Gagal memperbarui status laporan. Silakan coba lagi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const isAdmin = role === "admin";

  if (authLoading || (loading && reports.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-stone-500 gap-2" role="status">
        <Loader2 className="animate-spin" size={20} />
        <span>Memuat daftar laporan warga...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Gagal Memuat Laporan</h2>
          <p role="alert" className="text-sm text-stone-600 dark:text-stone-400 mt-1">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => void loadReports()}
          className="w-full px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors shadow-xs"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Manajemen Laporan</h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Daftar laporan warga, hasil klasifikasi AI, dan pembaruan status penanganan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadReports()}
            className="flex items-center gap-2 px-3.5 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-xs"
          >
            <RefreshCcw size={16} />
            Segarkan
          </button>
        </div>
      </div>

      <ReportFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onSearchSubmit={(e: FormEvent) => {
          e.preventDefault();
          setSearch(searchInput.trim());
        }}
      />

      {statusMessage ? (
        <div role="status" className="p-4 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={16} className="text-teal-700 dark:text-teal-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      ) : null}
      {statusError ? (
        <div role="alert" className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-lg text-sm font-medium flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{statusError}</span>
        </div>
      ) : null}

      <ReportTable
        reports={reports}
        isAdmin={isAdmin}
        updatingId={updatingId}
        onStatusChange={handleStatusChange}
      />

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center mx-auto">
            <FileText size={24} />
          </div>
          <p className="text-base font-semibold text-stone-900 dark:text-stone-100">Belum ada laporan ditemukan</p>
          <p className="text-sm text-stone-500 dark:text-stone-400">Coba ubah kata kunci pencarian atau filter status.</p>
        </div>
      ) : null}
    </div>
  );
}
