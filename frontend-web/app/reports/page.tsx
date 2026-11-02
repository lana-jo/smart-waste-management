"use client";

import { useEffect, useState } from "react";

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    // Simulasi fetch laporan sesuai PRD
    setTimeout(() => {
      setReports([
        {
          id: "rep-1",
          category: "Plastic Waste",
          confidence: 0.95,
          description: "Tumpukan botol plastik di dekat halte bus utama.",
          status: "Pending",
          created_at: "2026-11-01 10:00"
        },
        {
          id: "rep-2",
          category: "Organic Waste",
          confidence: 0.89,
          description: "Sampah sisa sayuran dan daun kering di sudut pasar.",
          status: "In Progress",
          created_at: "2026-11-01 09:30"
        },
        {
          id: "rep-3",
          category: "Paper Waste",
          confidence: 0.92,
          description: "Kardus bekas dan tumpukan kertas berserakan di trotoar.",
          status: "Completed",
          created_at: "2026-10-31 15:20"
        }
      ]);
      setLoading(false);
    }, 200);
  }, []);

  const filteredReports = filterStatus
    ? reports.filter((r) => r.status === filterStatus)
    : reports;

  if (loading) return <div className="p-8 text-stone-500">Memuat daftar laporan...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Manajemen Laporan</h1>
          <p className="text-sm text-stone-600 mt-1">Daftar laporan warga dan pembaruan status penanganan.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter status laporan"
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          >
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-xs font-medium text-stone-500 uppercase tracking-wider">
              <th className="p-4">Kategori & Kepercayaan</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4">Status</th>
              <th className="p-4">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-sm">
            {filteredReports.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50/50">
                <td className="p-4 font-medium text-stone-900">
                  {r.category}
                  <span className="block text-xs font-normal text-stone-500 mt-0.5">
                    AI Conf: {(r.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="p-4 text-stone-700 max-w-xs truncate">{r.description}</td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                      r.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : r.status === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-stone-500 text-xs">{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
