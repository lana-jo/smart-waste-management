"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, User } from "lucide-react";

interface BottomNavProps {
  role?: string;
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reports", label: "Laporan", icon: FileText },
    ...(role === "admin" ? [{ href: "/users", label: "Pengguna", icon: Users }] : []),
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <nav aria-label="Navigasi utama" className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] min-h-[calc(4rem+env(safe-area-inset-bottom))] flex items-center justify-around px-2 lg:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-11 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              isActive ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            <Icon size={20} className={isActive ? "text-emerald-700 dark:text-emerald-400 mb-0.5" : "text-stone-400 mb-0.5"} />
            <span className="truncate max-w-full leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
