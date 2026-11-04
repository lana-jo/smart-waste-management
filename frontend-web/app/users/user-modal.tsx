"use client";

import { X, Loader2 } from "lucide-react";
import { type FormEvent } from "react";
import type { UserItem } from "../lib/users-resource";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {editingUser ? "Perbarui informasi akun dan hak akses." : "Masukkan data lengkap untuk membuat akun baru."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-stone-700 mb-1">Nama Lengkap</label>
            <input
              id="userName"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              id="userEmail"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="userPassword" className="block text-sm font-medium text-stone-700 mb-1">
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
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="userRole" className="block text-sm font-medium text-stone-700 mb-1">Role Akses</label>
            <select
              id="userRole"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as "admin" | "user")}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="user">Pengguna (User)</option>
              <option value="admin">Administrator (Admin)</option>
            </select>
          </div>

          {actionError ? (
            <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {actionError}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-60 shadow-xs"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>{submitting ? "Menyimpan..." : "Simpan Pengguna"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
