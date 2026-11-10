"use client";

import { Calendar, Edit3, Mail, Trash2 } from "lucide-react";
import { formatTime } from "../lib/format";
import type { UserItem } from "../lib/users-resource";
import { userInitial, UserAccountStatusBadge, UserRoleBadge } from "./user-badges";
import { UserCard } from "./user-card";

interface Props {
  users: UserItem[];
  currentUserId?: string;
  onEdit: (user: UserItem) => void;
  onDelete: (id: string, name: string) => void;
}

function sortCurrentUserFirst(users: UserItem[], currentUserId?: string): UserItem[] {
  if (!currentUserId) return users;
  return [...users].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return 0;
  });
}

export function UserTable({ users, currentUserId, onEdit, onDelete }: Props) {
  const sortedUsers = sortCurrentUserFirst(users, currentUserId);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
      <ul className="lg:hidden flex flex-col gap-3 p-4" aria-label="Daftar pengguna">
        {sortedUsers.map((u) => (
          <UserCard key={u.id} user={u} isCurrentUser={currentUserId === u.id} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
      <div className="hidden lg:block overflow-x-auto" tabIndex={0} role="region" aria-label="Daftar Pengguna — tabel">
        <table className="w-full min-w-[640px] text-left border-collapse" aria-label="Daftar Pengguna">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-900/50 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              <th scope="col" className="p-4 whitespace-nowrap">Nama Lengkap</th>
              <th scope="col" className="p-4 whitespace-nowrap">Email</th>
              <th scope="col" className="p-4 whitespace-nowrap">Role</th>
              <th scope="col" className="p-4 whitespace-nowrap">Status</th>
              <th scope="col" className="p-4 whitespace-nowrap">Terdaftar</th>
              <th scope="col" className="p-4 text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-sm">
            {sortedUsers.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="p-4 font-medium text-stone-900 dark:text-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div aria-hidden="true" className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {userInitial(u.name)}
                    </div>
                    <span className="whitespace-nowrap">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-stone-700 dark:text-stone-300 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-stone-400 dark:text-stone-500 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">{u.email}</span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap"><UserRoleBadge role={u.role} /></td>
                <td className="p-4 whitespace-nowrap"><UserAccountStatusBadge isDeleted={u.is_deleted} /></td>
                <td className="p-4 text-stone-500 dark:text-stone-400 text-xs whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-stone-400 dark:text-stone-500 shrink-0" aria-hidden="true" />
                    <span className="whitespace-nowrap">{formatTime(u.created_at)}</span>
                  </div>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  {currentUserId === u.id ? (
                    <span className="text-xs text-stone-500 dark:text-stone-400 italic">Akun Anda</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(u)}
                        title={`Edit pengguna ${u.name}`}
                        aria-label={`Edit pengguna ${u.name}`}
                        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
                      >
                        <Edit3 size={14} aria-hidden="true" />
                        <span className="hidden lg:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(u.id, u.name)}
                        title={`Hapus pengguna ${u.name}`}
                        aria-label={`Hapus pengguna ${u.name}`}
                        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 px-3 py-1.5 border border-rose-300 dark:border-rose-900 rounded-lg text-xs font-medium text-rose-700 dark:text-rose-300 bg-white dark:bg-stone-900 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        <span className="hidden lg:inline">Hapus</span>
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
