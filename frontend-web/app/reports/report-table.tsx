"use client";

import { type ChangeEvent, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { formatTime } from "../lib/format";
import { confidenceDisplay, REPORT_STATUS_OPTIONS, ReportStatusBadge, type ReportItem } from "./report-status";
import { ReportCard } from "./report-card";
import { ReportDetail, ReportImagePreview } from "./report-modals";

interface ReportTableProps {
  reports: ReportItem[];
  isAdmin: boolean;
  updatingId: string | null;
  onStatusChange: (reportId: string, status: string) => Promise<void>;
}

export function ReportTable({ reports, isAdmin, updatingId, onStatusChange }: ReportTableProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const selectedReport = selectedReportId ? reports.find((report) => report.id === selectedReportId) ?? null : null;

  const handleCardStatusChange = (reportId: string) => (status: string) => {
    void onStatusChange(reportId, status);
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
      <ul className="lg:hidden flex flex-col gap-3 p-4" aria-label="Daftar laporan sampah">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            isAdmin={isAdmin}
            updating={updatingId === report.id}
            onOpenDetail={() => setSelectedReportId(report.id)}
            onOpenImage={() => setPreviewImage(report.image_url)}
            onStatusChange={handleCardStatusChange(report.id)}
          />
        ))}
      </ul>
      <div className="hidden lg:block overflow-x-auto" tabIndex={0} role="region" aria-label="Daftar Laporan Sampah — tabel">
        <table className="w-full min-w-[720px] text-left border-collapse" aria-label="Daftar Laporan Sampah">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-900/50 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              <th scope="col" className="p-4 whitespace-nowrap">Foto</th>
              <th scope="col" className="p-4">Kategori & Kepercayaan AI</th>
              <th scope="col" className="p-4">Deskripsi</th>
              <th scope="col" className="p-4 whitespace-nowrap">Lokasi</th>
              <th scope="col" className="p-4">Pelapor</th>
              <th scope="col" className="p-4">Status</th>
              <th scope="col" className="p-4 whitespace-nowrap">Waktu</th>
              <th scope="col" className="p-4 text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer" onClick={() => setSelectedReportId(report.id)}>
                <td className="p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  {report.image_url ? (
                    <button
                      type="button"
                      onClick={() => setPreviewImage(report.image_url)}
                      className="group relative block w-12 h-12 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 shrink-0"
                      title="Klik untuk memperbesar foto"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={report.image_url} alt={report.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </button>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 text-xs shrink-0">-</div>
                  )}
                </td>
                <td className="p-4 font-medium text-stone-900 dark:text-stone-100">
                  <div className="flex items-center gap-2"><FileText size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" /><span>{report.category}</span></div>
                  <span className="inline-flex items-center gap-1 text-xs font-normal text-stone-500 dark:text-stone-400 mt-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">AI Conf: {confidenceDisplay(report.confidence)}</span>
                </td>
                <td className="p-4 text-stone-700 dark:text-stone-300 max-w-xs truncate" title={report.description || "Tidak ada deskripsi."}>{report.description || "Tidak ada deskripsi."}</td>
                <td className="p-4 text-stone-600 dark:text-stone-400 text-xs whitespace-nowrap font-mono">
                  {report.latitude !== undefined && report.longitude !== undefined ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                  ) : ("—")}
                </td>
                <td className="p-4 text-stone-700 dark:text-stone-300 font-medium">{report.reporter_name || "Warga"}</td>
                <td className="p-4 whitespace-nowrap"><ReportStatusBadge status={report.status} /></td>
                <td className="p-4 text-stone-500 dark:text-stone-400 text-xs whitespace-nowrap">{formatTime(report.created_at)}</td>
                <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button" onClick={() => setSelectedReportId(report.id)}
                      aria-label={`Detail laporan ${report.category}`}
                      className="min-h-11 inline-flex items-center px-2.5 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      Detail
                    </button>
                    {isAdmin ? (
                      <select
                        value={report.status}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => { if (event.target.value) void onStatusChange(report.id, event.target.value); }}
                        disabled={updatingId === report.id}
                        aria-label={`Ubah status laporan ${report.category}`}
                        className="min-h-11 w-auto min-w-24 px-2.5 border border-stone-300 dark:border-stone-700 rounded-lg text-xs bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        {REPORT_STATUS_OPTIONS.map((option) => (<option key={option} value={option}>{option}</option>))}
                      </select>
                    ) : null}
                    {updatingId === report.id ? <Loader2 size={16} className="animate-spin text-emerald-700 dark:text-emerald-400" aria-hidden="true" /> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedReport ? <ReportDetail report={selectedReport} onClose={() => setSelectedReportId(null)} onPreviewImage={setPreviewImage} escapeEnabled={previewImage === null} /> : null}
      {previewImage ? <ReportImagePreview imageUrl={previewImage} onClose={() => setPreviewImage(null)} /> : null}
    </div>
  );
}
