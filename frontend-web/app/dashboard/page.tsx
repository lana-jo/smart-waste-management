"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi data fetch sesuai skema PRD stats
    setTimeout(() => {
      setStats({
        total: 6,
        by_status: { Pending: 2, InProgress: 1, Completed: 2, Rejected: 1 },
        by_category: { OrganicWaste: 2, PlasticWaste: 2, PaperWaste: 2 }
      });
      setLoading(false);
    }, 200);
  }, []);

  if (loading) return <div className="p-8 text-stone-500">Memuat data ringkasan...</div>;

  const chartData = [
    { name: "Organic Waste", count: stats.by_category.OrganicWaste },
    { name: "Plastic Waste", count: stats.by_category.PlasticWaste },
    { name: "Paper Waste", count: stats.by_category.PaperWaste },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Dashboard Utama</h1>
        <p className="text-sm text-stone-600 mt-1">Ringkasan data operasional pengelolaan sampah.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-lg shadow-xs">
          <p className="text-sm text-stone-500">Total Laporan</p>
          <p className="text-3xl font-semibold text-stone-900 mt-2">{stats.total}</p>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-lg shadow-xs">
          <p className="text-sm text-stone-500">Menunggu (Pending)</p>
          <p className="text-3xl font-semibold text-amber-600 mt-2">{stats.by_status.Pending}</p>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-lg shadow-xs">
          <p className="text-sm text-stone-500">Selesai (Completed)</p>
          <p className="text-3xl font-semibold text-emerald-700 mt-2">{stats.by_status.Completed}</p>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-lg shadow-xs">
          <p className="text-sm text-stone-500">Ditolak (Rejected)</p>
          <p className="text-3xl font-semibold text-rose-600 mt-2">{stats.by_status.Rejected}</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs">
        <h2 className="text-base font-medium text-stone-900 mb-4">Distribusi Kategori Sampah</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#78716c" fontSize={12} />
              <YAxis stroke="#78716c" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#047857" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
