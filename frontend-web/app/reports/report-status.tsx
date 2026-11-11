"use client";

import { type ReactNode } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export interface ReportItem {
  id: string;
  category: string;
  confidence: number | null;
  description: string;
  status: string;
  created_at: string;
  reporter_name: string;
  image_url: string;
  latitude: number | null;
  longitude: number | null;
}

export const REPORT_STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Rejected"];

function statusBadgeClass(status: string): string {
  if (status === "Completed") return "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800";
  if (status === "In Progress") return "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  if (status === "Pending") return "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  return "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
}

function StatusIcon({ status }: { status: string }): ReactNode {
  if (status === "Completed") return <CheckCircle2 size={14} className="text-teal-700 dark:text-teal-400" />;
  if (status === "In Progress") return <Clock size={14} className="text-blue-700 dark:text-blue-400" />;
  if (status === "Pending") return <Clock size={14} className="text-amber-700 dark:text-amber-400" />;
  return <XCircle size={14} className="text-rose-700 dark:text-rose-400" />;
}

export function ReportStatusBadge({ status, className = "" }: { status: string; className?: string }): ReactNode {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusBadgeClass(status)} ${className}`}>
      <StatusIcon status={status} />
      {status}
    </span>
  );
}

export function confidenceDisplay(confidence: number | null): string {
  if (confidence === null || !Number.isFinite(confidence)) return "—";
  return `${Math.round(confidence * 100)}%`;
}

export function coordinateDisplay(lat: number | null | undefined, lng: number | null | undefined, digits = 4): string {
  if (lat === null || lat === undefined || !Number.isFinite(lat)) return "—";
  if (lng === null || lng === undefined || !Number.isFinite(lng)) return "—";
  return `${lat.toFixed(digits)}, ${lng.toFixed(digits)}`;
}

export function reporterDisplay(name: string): string {
  return name || "Warga";
}

export function descriptionDisplay(description: string): string {
  return description || "Tidak ada deskripsi.";
}
