import { apiFetch } from "./api";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  is_deleted: boolean;
}

export type UsersStatus = "idle" | "loading" | "ready" | "error";

export interface UsersSnapshot {
  status: UsersStatus;
  users: UserItem[];
  error: string | null;
}

export const USERS_LOAD_ERROR = "Gagal memuat daftar pengguna.";

// Store modul: daftar pengguna bukan state React, melainkan sistem eksternal
// yang di-subscribe lewat useSyncExternalStore. Dengan ini effect halaman
// memanggil reloadUsers() tanpa menyentuh setState (rule
// react-hooks/set-state-in-effect), dan pembaruan UI datang via subscriber.
let snapshot: UsersSnapshot = { status: "idle", users: [], error: null };
const subscribers = new Set<() => void>();

function publish(next: UsersSnapshot): void {
  snapshot = next;
  for (const notify of subscribers) {
    notify();
  }
}

export function subscribeUsers(notify: () => void): () => void {
  subscribers.add(notify);
  return () => subscribers.delete(notify);
}

export function getUsersSnapshot(): UsersSnapshot {
  return snapshot;
}

// Snapshot lama dipertahankan saat memuat ulang supaya tabel tidak berkedip
// kosong di antara dua publish.
export async function reloadUsers(includeDeleted = false): Promise<void> {
  publish({ status: "loading", users: snapshot.users, error: null });
  try {
    const url = includeDeleted ? "/api/users?include_deleted=true" : "/api/users";
    const users = await apiFetch<UserItem[]>(url);
    publish({ status: "ready", users, error: null });
  } catch (err) {
    publish({ status: "error", users: snapshot.users, error: err instanceof Error ? err.message : USERS_LOAD_ERROR });
  }
}
