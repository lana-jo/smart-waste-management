"use client";

import { Shield } from "lucide-react";
import type { UserItem } from "../lib/users-resource";

export function userInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function roleBadgeClass(role: UserItem["role"]): string {
  return role === "admin"
    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
    : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700";
}

export function UserRoleBadge({ role, className = "" }: { role: UserItem["role"]; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border shrink-0 ${roleBadgeClass(role)} ${className}`}>
      <Shield size={12} aria-hidden="true" />
      {role === "admin" ? "Admin" : "Pengguna"}
    </span>
  );
}

export function UserAccountStatusBadge({ isDeleted, className = "" }: { isDeleted: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${
        isDeleted
          ? "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
          : "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
      } ${className}`}
    >
      {isDeleted ? "Nonaktif" : "Aktif"}
    </span>
  );
}
