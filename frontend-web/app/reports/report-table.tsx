"use client";

import { type ChangeEvent } from "react";
import { FileText, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { formatTime } from "../lib/format";

export interface ReportItem {
  id: string;
  category: string;
  confidence: number;
  description: string;
  status: string;
  created_at: string;
  reporter_name: string;
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
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Daftar Laporan Sampah">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-900/50 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              <th scope="col" className="p-4">Kategori & Kepercayaan AI</th>
              <th scope="col" className="p-4">Deskripsi</th>
              <th scope="col" className="p-4">Pelapor</th>
              <th scope="col" className="p-4">Status</th>
              <th scope="col" className="p-4">Waktu</th>
              {isAdmin ? <th scope="col" className="p-4 text-right">Aksi</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
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
                <td className="p-4 text-stone-700 dark:text-stone-300 font-medium">{report.reporter_name || "Warga"}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusBadgeClass(report.status)}`}>
                    <StatusIcon status={report.status} />
                    {report.status}
                  </span>
                </td>
                <td className="p-4 text-stone-500 dark:text-stone-400 text-xs whitespace-nowrap">{formatTime(report.created_at)}</td>
                {isAdmin ? (
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                      {updatingId === report.id ? <Loader2 size={16} className="animate-spin text-emerald-700 dark:text-emerald-400" /> : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
