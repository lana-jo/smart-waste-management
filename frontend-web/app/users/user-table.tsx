"use client";

import { Mail, Shield, Calendar, Edit3, Trash2 } from "lucide-react";
import { formatTime } from "../lib/format";
import type { UserItem } from "../lib/users-resource";

interface Props {
  users: UserItem[];
  currentUserId?: string;
  onEdit: (user: UserItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function UserTable({ users, currentUserId, onEdit, onDelete }: Props) {
  const sortedUsers = [...users].sort((a, b) => {
    if (currentUserId) {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
    }
    return 0;
  });

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" aria-label="Daftar Pengguna">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/75 text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <th scope="col" className="p-4">Nama Lengkap</th>
              <th scope="col" className="p-4">Email</th>
              <th scope="col" className="p-4">Role</th>
              <th scope="col" className="p-4">Status</th>
              <th scope="col" className="p-4">Terdaftar</th>
              <th scope="col" className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 text-sm">
            {sortedUsers.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="p-4 font-medium text-stone-900 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="p-4 text-stone-700">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-stone-400 shrink-0" />
                    <span>{u.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${
                      u.role === "admin"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    <Shield size={12} />
                    {u.role === "admin" ? "Admin" : "Pengguna"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      u.is_deleted
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-teal-50 text-teal-700 border border-teal-200"
                    }`}
                  >
                    {u.is_deleted ? "Nonaktif" : "Aktif"}
                  </span>
                </td>
                <td className="p-4 text-stone-500 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-stone-400 shrink-0" />
                    <span>{formatTime(u.created_at)}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  {currentUserId === u.id ? (
                    <span className="text-xs text-stone-500 italic">Akun Anda</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(u.id, u.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-300 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors shadow-xs"
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
