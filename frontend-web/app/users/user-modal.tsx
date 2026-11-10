"use client";

import { Loader2, X } from "lucide-react";
import type { FormEvent } from "react";
import type { UserItem } from "../lib/users-resource";
import { ModalShell } from "../components/modal-shell";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (e: FormEvent) => Promise<void>;
  editingUser: UserItem | null;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  userRole: "admin" | "user";
  setUserRole: (v: "admin" | "user") => void;
  submitting: boolean;
  actionError: string | null;
}

export function UserModal({
  show,
  onClose,
  onSave,
  editingUser,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  userRole,
  setUserRole,
  submitting,
  actionError,
}: Props) {
  if (!show) return null;

  return (
    <ModalShell titleId="user-modal-title" onClose={onClose} dialogClassName="p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 id="user-modal-title" className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {editingUser ? "Perbarui informasi akun dan hak akses." : "Masukkan data lengkap untuk membuat akun baru."}
          </p>
        </div>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nama Lengkap</label>
          <input
            id="userName"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-11 px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
          <input
            id="userEmail"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-11 px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div>
          <label htmlFor="userPassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
            Password {editingUser ? "(Kosongkan jika tidak diubah)" : ""}
          </label>
          <input
            id="userPassword"
            type="password"
            required={!editingUser}
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editingUser ? "••••••••" : "Minimal 8 karakter"}
            className="w-full min-h-11 px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div>
          <label htmlFor="userRole" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Role Akses</label>
          <select
            id="userRole"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as "admin" | "user")}
            className="w-full min-h-11 px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="user">Pengguna (User)</option>
            <option value="admin">Administrator (Admin)</option>
          </select>
        </div>

        {actionError ? (
          <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-medium">
            {actionError}
          </div>
        ) : null}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto min-h-11 justify-center flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            <span>{submitting ? "Menyimpan..." : "Simpan Pengguna"}</span>
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
