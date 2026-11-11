"use client";

import { X } from "lucide-react";
import { formatTime } from "../lib/format";
import { confidenceDisplay, coordinateDisplay, descriptionDisplay, reporterDisplay, ReportStatusBadge, type ReportItem } from "./report-status";
import { ModalShell } from "../components/modal-shell";

interface ReportImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
}

export function ReportImagePreview({ imageUrl, onClose }: ReportImagePreviewProps) {
  return (
    <ModalShell titleId="preview-title" onClose={onClose} dialogClassName="p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
        <h3 id="preview-title" className="text-sm font-semibold text-stone-900 dark:text-stone-100">Pratinjau Foto Laporan</h3>
        <button
          type="button" onClick={onClose}
          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          aria-label="Tutup pratinjau"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex items-center justify-center bg-stone-950/5 dark:bg-stone-950/40 rounded-xl overflow-hidden p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Pratinjau Laporan" className="max-w-full max-h-[70vh] w-auto object-contain rounded-lg shadow-sm" />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button" onClick={onClose}
          className="min-h-11 px-4 inline-flex items-center bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          Tutup
        </button>
      </div>
    </ModalShell>
  );
}

interface ReportDetailProps {
  report: ReportItem;
  onClose: () => void;
  onPreviewImage: (imageUrl: string) => void;
  escapeEnabled?: boolean;
}

export function ReportDetail({ report, onClose, onPreviewImage, escapeEnabled = true }: ReportDetailProps) {
  return (
    <ModalShell titleId="detail-title" onClose={onClose} escapeEnabled={escapeEnabled} dialogClassName="p-4 sm:p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h3 id="detail-title" className="text-lg font-bold text-stone-900 dark:text-stone-100">Detail Laporan Sampah</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">ID: {report.id}</p>
        </div>
        <button
          type="button" onClick={onClose}
          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
          aria-label="Tutup detail"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {report.image_url ? (
          <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
            <button type="button" onClick={() => onPreviewImage(report.image_url)} aria-label={`Perbesar foto laporan ${report.category}`} className="block w-full rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-700" title="Klik untuk memperbesar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={report.image_url} alt={report.category} className="max-h-64 w-full object-cover hover:opacity-95 transition-opacity" />
            </button>
          </div>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Kategori</span><span className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 block">{report.category}</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Kepercayaan AI</span><span className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 block">{confidenceDisplay(report.confidence)}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Status Penanganan</span><div className="mt-1"><ReportStatusBadge status={report.status} /></div>
          </div>
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Pelapor</span><span className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1 block">{reporterDisplay(report.reporter_name)}</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Deskripsi</span>
          <p className="text-sm text-stone-800 dark:text-stone-200 mt-1 whitespace-pre-wrap">{descriptionDisplay(report.description)}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Koordinat GPS</span><span className="text-xs font-mono text-stone-800 dark:text-stone-200 mt-1 block">{coordinateDisplay(report.latitude, report.longitude, 6)}</span>
          </div>
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block">Waktu Dibuat</span><span className="text-xs text-stone-800 dark:text-stone-200 mt-1 block">{formatTime(report.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
        <button
          type="button" onClick={onClose}
          className="min-h-11 px-4 inline-flex items-center justify-center bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm font-medium rounded-lg hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
        >
          Tutup
        </button>
      </div>
    </ModalShell>
  );
}
