"use client";

import { type ChangeEvent } from "react";
import { Clock, FileText, Loader2, MapPin, User } from "lucide-react";
import { formatTime } from "../lib/format";
import { confidenceDisplay, REPORT_STATUS_OPTIONS, ReportStatusBadge, type ReportItem } from "./report-status";

interface ReportCardProps {
  report: ReportItem;
  isAdmin: boolean;
  updating: boolean;
  onOpenDetail: () => void;
  onOpenImage: () => void;
  onStatusChange: (status: string) => void;
}

export function ReportCard({ report, isAdmin, updating, onOpenDetail, onOpenImage, onStatusChange }: ReportCardProps) {
  const hasCoordinates = report.latitude !== undefined && report.longitude !== undefined;
  return (
    <li className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {report.image_url ? (
          <button
            type="button"
            onClick={onOpenImage}
            className="group relative block w-14 h-14 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 shrink-0"
            aria-label="Perbesar foto laporan"
            title="Klik untuk memperbesar foto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={report.image_url} alt={report.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          </button>
        ) : (
          <div className="w-14 h-14 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 text-xs shrink-0" aria-hidden="true">-</div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="font-medium text-stone-900 dark:text-stone-100 truncate">{report.category}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-1 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">AI Conf: {confidenceDisplay(report.confidence)}</span>
        </div>
        <ReportStatusBadge status={report.status} className="shrink-0" />
      </div>

      <p className="text-sm text-stone-700 dark:text-stone-300 line-clamp-2">{report.description || "Tidak ada deskripsi."}</p>

      <div className="flex flex-col gap-1.5 text-xs text-stone-600 dark:text-stone-400">
        <span className="inline-flex items-center gap-1.5">
          <User size={14} className="shrink-0" aria-hidden="true" />
          {report.reporter_name || "Warga"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} className="shrink-0" aria-hidden="true" />
          {formatTime(report.created_at)}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono">
          <MapPin size={14} className="shrink-0" aria-hidden="true" />
          {hasCoordinates ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}` : "—"}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          type="button"
          onClick={onOpenDetail}
          aria-label={`Detail laporan ${report.category}`}
          className="min-h-11 flex-1 inline-flex items-center justify-center px-3 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          Detail
        </button>
        {isAdmin ? (
          <select
            value={report.status}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => { if (event.target.value) onStatusChange(event.target.value); }}
            disabled={updating}
            aria-label={`Ubah status laporan ${report.category}`}
            className="min-h-11 flex-1 px-2.5 border border-stone-300 dark:border-stone-700 rounded-lg text-sm sm:text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-700 truncate"
          >
            {REPORT_STATUS_OPTIONS.map((option) => (<option key={option} value={option}>{option}</option>))}
          </select>
        ) : null}
        {updating ? <Loader2 size={16} className="animate-spin text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" /> : null}
      </div>
    </li>
  );
}
