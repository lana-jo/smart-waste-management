"use client";

import { FileText, Clock, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { type ReportStats } from "../lib/types";

export function DashboardStatsGrid({ stats }: { stats: ReportStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Total Laporan</p>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-stone-900 dark:text-stone-100 mt-4">{stats.total}</p>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
          <TrendingUp size={14} />
          <span>Semua laporan terdaftar</span>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Menunggu (Pending)</p>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-4">{stats.by_status.Pending}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">Menunggu verifikasi awal</p>
      </div>

      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-teal-600" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Selesai (Completed)</p>
          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-teal-700 dark:text-teal-300 mt-4">{stats.by_status.Completed}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">Berhasil ditangani petugas</p>
      </div>

      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Ditolak / Batal</p>
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <XCircle size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-4">{stats.by_status.Rejected}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">Tidak memenuhi syarat / spam</p>
      </div>
    </div>
  );
}

export function DashboardCharts({ stats }: { stats: ReportStats }) {
  const chartData = [
    { name: "Organik", count: stats.by_category["Organic Waste"], color: "#10b981" },
    { name: "Plastik", count: stats.by_category["Plastic Waste"], color: "#14b8a6" },
    { name: "Kertas", count: stats.by_category["Paper Waste"], color: "#0ea5e9" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Distribusi Jenis Sampah</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">Jumlah laporan berdasarkan kategori sampah terkumpul</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716c" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.5)" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Status Operasional</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">Rincian status penanganan laporan kota</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Dalam Proses</span>
              <span className="text-sm font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md">
                {stats.by_status["In Progress"]}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Selesai Ditangani</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                {stats.by_status.Completed}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800">
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Menunggu Verifikasi</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md">
                {stats.by_status.Pending}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 text-center">
          Pembaruan waktu nyata otomatis aktif
        </div>
      </div>
    </div>
  );
}
