"use client";

import { type ChangeEvent, useState } from "react";
import { FileText, CheckCircle2, Clock, XCircle, Loader2, X } from "lucide-react";
import { formatTime } from "../lib/format";

export interface ReportItem {
  id: string;
  category: string;
  confidence: number;
  description: string;
  status: string;
  created_at: string;
  reporter_name: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

const STATUS_FILTER_OPTIONS = ["Pending", "In Progress", "Completed", "Rejected"];

function statusBadgeClass(status: string): string {
  if (status === "Completed") return "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800";
  if (status === "In Progress") return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  if (status === "Pending") return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
}

function StatusIcon({ status }: { status: string }) {
  if (status === "Completed") return <CheckCircle2 size={14} className="text-teal-700 dark:text-teal-400" />;
  if (status === "In Progress") return <Clock size={14} className="text-blue-700 dark:text-blue-400" />;
  if (status === "Pending") return <Clock size={14} className="text-amber-700 dark:text-amber-400" />;
  return <XCircle size={14} className="text-rose-700 dark:text-rose-400" />;
}

interface ReportTableProps {
  reports: ReportItem[];
  isAdmin: boolean;
  updatingId: string | null;
  onStatusChange: (reportId: string, status: string) => Promise<void>;
}

export function ReportTable({ reports, isAdmin, updatingId, onStatusChange }: ReportTableProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Daftar Laporan Sampah">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-900/50 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              <th scope="col" className="p-4">Foto</th>
              <th scope="col" className="p-4">Kategori & Kepercayaan AI</th>
              <th scope="col" className="p-4">Deskripsi</th>
              <th scope="col" className="p-4">Lokasi</th>
              <th scope="col" className="p-4">Pelapor</th>
              <th scope="col" className="p-4">Status</th>
              <th scope="col" className="p-4">Waktu</th>
              <th scope="col" className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer" onClick={() => setSelectedReport(report)}>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                    <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 text-xs shrink-0">
                      -
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium text-stone-900 dark:text-stone-100">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>{report.category}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-normal text-stone-500 dark:text-stone-400 mt-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                    AI Conf: {Math.round(report.confidence * 100)}%
                  </span>
                </td>
                <td className="p-4 text-stone-700 dark:text-stone-300 max-w-xs truncate" title={report.description}>
                  {report.description}
                </td>
                <td className="p-4 text-stone-600 dark:text-stone-400 text-xs whitespace-nowrap font-mono">
                  {report.latitude !== undefined && report.longitude !== undefined ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-4 text-stone-700 dark:text-stone-300 font-medium">{report.reporter_name || "Warga"}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusBadgeClass(report.status)}`}>
                    <StatusIcon status={report.status} />
                    {report.status}
                  </span>
                </td>
                <td className="p-4 text-stone-500 dark:text-stone-400 text-xs whitespace-nowrap">{formatTime(report.created_at)}</td>
                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="px-2.5 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      Detail
                    </button>
                    {isAdmin ? (
                      <select
                        value={report.status}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                          const nextStatus = event.target.value;
                          if (nextStatus) void onStatusChange(report.id, nextStatus);
                        }}
                        disabled={updatingId === report.id}
                        aria-label="Ubah status laporan"
                        className="px-2.5 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-xs bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        {STATUS_FILTER_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    {updatingId === report.id ? <Loader2 size={16} className="animate-spin text-emerald-700 dark:text-emerald-400" /> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewImage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-4 max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Pratinjau Foto Laporan</h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
                aria-label="Tutup pratinjau"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center bg-stone-950/5 dark:bg-stone-950/40 rounded-xl overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewImage} alt="Pratinjau Laporan" className="max-h-[70vh] w-auto object-contain rounded-lg shadow-sm" />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedReport ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Detail Laporan Sampah</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">ID: {selectedReport.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
                aria-label="Tutup detail"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedReport.image_url ? (
                <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedReport.image_url}
                    alt={selectedReport.category}
                    className="max-h-64 w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setPreviewImage(selectedReport.image_url)}
                    title="Klik untuk memperbesar"
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Kategori</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 block">{selectedReport.category}</span>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Kepercayaan AI</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 block">{Math.round(selectedReport.confidence * 100)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Status Penanganan</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusBadgeClass(selectedReport.status)}`}>
                      <StatusIcon status={selectedReport.status} />
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Pelapor</span>
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1 block">{selectedReport.reporter_name || "Warga"}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Deskripsi</span>
                <p className="text-sm text-stone-800 dark:text-stone-200 mt-1 whitespace-pre-wrap">{selectedReport.description || "Tidak ada deskripsi."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Koordinat GPS</span>
                  <span className="text-xs font-mono text-stone-800 dark:text-stone-200 mt-1 block">
                    {selectedReport.latitude !== undefined ? `${selectedReport.latitude.toFixed(6)}, ${selectedReport.longitude.toFixed(6)}` : "—"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Waktu Dibuat</span>
                  <span className="text-xs text-stone-800 dark:text-stone-200 mt-1 block">{formatTime(selectedReport.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-medium rounded-lg hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
