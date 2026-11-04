"use client";

import Link from "next/link";
import { LayoutDashboard, FileText, Users } from "lucide-react";

interface NavLinksProps {
  pathname: string;
  role?: string;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export function NavLinks({ pathname, role, isCollapsed = false, onItemClick }: NavLinksProps) {
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reports", label: "Laporan", icon: FileText },
    ...(role === "admin" ? [{ href: "/users", label: "Pengguna", icon: Users }] : []),
  ];

  return (
    <div className="space-y-1.5">
      {!isCollapsed && (
        <p className="px-3 text-xs font-semibold text-stone-400 dark:text-stone-500 dark:text-stone-500 uppercase tracking-wider mb-3">
          Menu Utama
        </p>
      )}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            title={isCollapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold shadow-xs"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
            } ${isCollapsed ? "justify-center px-2" : ""}`}
          >
            <Icon size={18} className={isActive ? "text-emerald-700 dark:text-emerald-400 shrink-0" : "text-stone-400 dark:text-stone-500 shrink-0"} />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}
