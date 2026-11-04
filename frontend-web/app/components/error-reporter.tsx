"use client";

// Pelapor error sisi klien. Menyimpan error yang lolos sampai ke window
// (event "error" dan "unhandledrejection") ke endpoint same-origin
// POST /api/client-errors. Kontrak backend: status 204, body JSON maksimal
// 10KB, tanpa PII (cookie, token, email, userAgent tidak ikut dikirim).

import { useEffect } from "react";

const CLIENT_ERROR_ENDPOINT = "/api/client-errors";

export type ClientErrorType = "error" | "unhandledrejection" | "error-boundary";

export interface ClientErrorReport {
  type: ClientErrorType;
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  path: string;
}

const MAX_MESSAGE_CHARS = 300;
const MAX_SOURCE_CHARS = 200;
const MAX_PATH_CHARS = 200;
const MAX_STACK_CHARS = 1200;

// Jendela geser 60 detik, maksimal 20 event; sisanya di-drop diam. Tujuannya
// menahan banjir error (mis. "Script error." tanpa detail cross-origin yang
// bisa berulang setiap frame) agar tidak jadi traffic outlier ke backend.
const RATE_WINDOW_MS = 60_000;
const MAX_REPORTS_PER_WINDOW = 20;

let acceptedReportsAt: number[] = [];

function clipText(value: string, maxChars: number): string {
  return value.length > maxChars ? value.slice(0, maxChars) : value;
}

function stackOf(thrownValue: unknown): string | undefined {
  if (!(thrownValue instanceof Error)) return undefined;
  return typeof thrownValue.stack === "string" && thrownValue.stack.length > 0
    ? clipText(thrownValue.stack, MAX_STACK_CHARS)
    : undefined;
}

// Mengembalikan true bila slot rate pada jendela aktif masih tersedia.
function consumeRateSlot(): boolean {
  const now = Date.now();
  acceptedReportsAt = acceptedReportsAt.filter((acceptedAt) => now - acceptedAt < RATE_WINDOW_MS);
  if (acceptedReportsAt.length >= MAX_REPORTS_PER_WINDOW) return false;
  acceptedReportsAt.push(now);
  return true;
}

export function reportClientError(report: ClientErrorReport): void {
  if (typeof window === "undefined") return;
  try {
    // Path dipangkas di satu titik ini sehingga ketiga jenis laporan
    // (error, unhandledrejection, error-boundary) lewat trim yang sama.
    // Field dengan nilai undefined dibuang sendiri oleh JSON.stringify.
    const body = JSON.stringify({ ...report, path: clipText(report.path, MAX_PATH_CHARS) });
    const beaconPayload = new Blob([body], { type: "application/json" });
    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(CLIENT_ERROR_ENDPOINT, beaconPayload)) {
      return;
    }
    // Fallback untuk browser tanpa sendBeacon; keepalive supaya request tetap
    // jalan walau halaman ditutup seusai setengah jalan.
    void fetch(CLIENT_ERROR_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Gagal kirim dibiarkan senyap: reporternya sendiri tidak boleh error.
    });
  } catch {
    // Senyap juga untuk persiapan payload yang tanpa sengaja melempar.
  }
}

// Dipanggil langsung dari app/error.tsx dan app/global-error.tsx karena error
// boundary TIDAK melewati listener window. Tanpa rate window supaya crash
// seperti ini tetap terkirim setiap kali memang terjadi.
export function reportBoundaryError(thrownValue: unknown): void {
  if (typeof window === "undefined") return;
  const message = thrownValue instanceof Error ? thrownValue.message : String(thrownValue);
  reportClientError({
    type: "error-boundary",
    message: clipText(message || "", MAX_MESSAGE_CHARS),
    stack: stackOf(thrownValue),
    path: window.location.pathname,
  });
}

function messageOfRejection(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === "string") return reason;
  return "Unhandled promise rejection";
}

function handleWindowError(event: ErrorEvent): void {
  if (!consumeRateSlot()) return;
  reportClientError({
    type: "error",
    message: clipText(event.message || "", MAX_MESSAGE_CHARS),
    source: event.filename ? clipText(event.filename, MAX_SOURCE_CHARS) : undefined,
    lineno: event.lineno > 0 ? event.lineno : undefined,
    colno: event.colno > 0 ? event.colno : undefined,
    stack: stackOf(event.error),
    path: window.location.pathname,
  });
}

function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  if (!consumeRateSlot()) return;
  reportClientError({
    type: "unhandledrejection",
    message: clipText(messageOfRejection(event.reason) || "", MAX_MESSAGE_CHARS),
    stack: stackOf(event.reason),
    path: window.location.pathname,
  });
}

// Guard module-level: StrictMode meng-mount komponen ini dua kali di dev, dan
// listener hanya boleh terpasang satu kali per halaman.
let installedGlobalListeners = false;

function installGlobalErrorListeners(): void {
  if (installedGlobalListeners) return;
  installedGlobalListeners = true;
  window.addEventListener("error", handleWindowError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
}

export function ClientErrorReporter(): null {
  useEffect(() => {
    installGlobalErrorListeners();
  }, []);
  return null;
}
