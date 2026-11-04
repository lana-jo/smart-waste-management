import { GENERIC_ERROR_MESSAGE } from "./validation";
import { resolveApiOrigin } from "./api-origin";

const API_BASE_URL = resolveApiOrigin();

// Event internal antar modul: apiFetch tidak boleh mengimport AuthProvider
// (sirkular), jadi kehabisan sesi ditandai lewat event ini dan AuthProvider
// yang membersihkan state lalu mengarahkan ke /login.
export const SESSION_EXPIRED_EVENT = "swm:auth-session-expired";

const CLIENT_SAFE_STATUSES = [400, 401, 403, 404, 409, 422];

// Untuk endpoint auth, 401 berarti kredensial salah (bukan sesi kedaluwarsa),
// jadi tanpa percobaan refresh supaya pesan salah kredensial tetap tampil.
const SESSION_REFRESH_DISABLED_PATHS = new Set<string>([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
]);

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}

// Body login/register dari backend masih memuat access_token, tapi client
// tidak menaruhnya lagi di memori: kredensial jalan lewat cookie HttpOnly.
export interface AuthSession {
  user: AuthUser;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function requestBackend(path: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ApiError(0, "Koneksi ke server sedang tidak stabil. Silakan coba lagi.");
  }
}

async function refreshSession(): Promise<boolean> {
  try {
    const response = await requestBackend("/api/auth/refresh", { method: "POST" });
    return response.ok;
  } catch {
    return false;
  }
}

// Satu refresh dibagi ke semua request 401 yang bersamaan supaya tidak
// menembak endpoint refresh berkali-kali; promise direset setelah selesai.
let refreshInFlight: Promise<boolean> | null = null;

function requestSessionRefresh(): Promise<boolean> {
  refreshInFlight ??= refreshSession().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

function notifySessionExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response = await requestBackend(path, options);
  let refreshAttempted = false;
  if (response.status === 401 && !SESSION_REFRESH_DISABLED_PATHS.has(path)) {
    refreshAttempted = true;
    if (await requestSessionRefresh()) {
      response = await requestBackend(path, options);
    }
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (refreshAttempted) {
      notifySessionExpired();
    }
    throw new ApiError(response.status, resolveErrorMessage(response.status, data));
  }

  // 204 No Content atau body kosong/null yang sukses bukan error.
  if (response.status === 204 || data === null || data === undefined) {
    return undefined as T;
  }

  if (typeof data !== "object") {
    throw new ApiError(response.status, GENERIC_ERROR_MESSAGE);
  }

  return data as T;
}

function resolveErrorMessage(status: number, data: unknown): string {
  if (!CLIENT_SAFE_STATUSES.includes(status)) {
    return GENERIC_ERROR_MESSAGE;
  }
  if (!data || typeof data !== "object") {
    return GENERIC_ERROR_MESSAGE;
  }
  const detail = (data as { detail?: unknown; message?: unknown }).detail ?? (data as { message?: unknown }).message;
  if (typeof detail === "string" && detail.trim().length > 0) {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (first && typeof first === "object") {
      const msg = (first as { msg?: unknown }).msg;
      if (typeof msg === "string" && msg.trim().length > 0) {
        return msg;
      }
    }
  }
  return GENERIC_ERROR_MESSAGE;
}
