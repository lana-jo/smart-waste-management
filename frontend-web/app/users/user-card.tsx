"use client";

import { Calendar, Edit3, Mail, Trash2 } from "lucide-react";
import { formatTime } from "../lib/format";
import type { UserItem } from "../lib/users-resource";
import { userInitial, UserAccountStatusBadge, UserRoleBadge } from "./user-badges";

interface UserCardProps {
  user: UserItem;
  isCurrentUser: boolean;
  onEdit: (user: UserItem) => void;
  onDelete: (id: string, name: string) => void;
}

export function UserCard({ user, isCurrentUser, onEdit, onDelete }: UserCardProps) {
  return (
    <li className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div aria-hidden="true" className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
          {userInitial(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
        </div>
        <UserRoleBadge role={user.role} />
      </div>

      <div className="flex flex-col gap-2 text-xs text-stone-600 dark:text-stone-400">
        <span className="inline-flex items-center gap-1.5">
          <Mail size={14} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{user.email}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={14} className="shrink-0" aria-hidden="true" />
          Terdaftar {formatTime(user.created_at)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          Status: <UserAccountStatusBadge isDeleted={user.is_deleted} />
        </span>
      </div>

      <div className="flex items-center gap-2 w-full pt-2 border-t border-stone-100 dark:border-stone-800">
        {isCurrentUser ? (
          <p className="flex-1 text-center text-xs text-stone-500 dark:text-stone-400 italic">Akun Anda</p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(user)}
              aria-label={`Edit pengguna ${user.name}`}
              className="min-h-11 flex-1 inline-flex items-center justify-center gap-1.5 px-3 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
            >
              <Edit3 size={14} aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(user.id, user.name)}
              aria-label={`Hapus pengguna ${user.name}`}
              className="min-h-11 flex-1 inline-flex items-center justify-center gap-1.5 px-3 border border-rose-300 dark:border-rose-900 rounded-lg text-sm font-medium text-rose-700 dark:text-rose-300 bg-white dark:bg-stone-900 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
            >
              <Trash2 size={14} aria-hidden="true" />
              Hapus
            </button>
          </>
        )}
      </div>
    </li>
  );
}
