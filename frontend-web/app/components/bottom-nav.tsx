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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 h-16 flex items-center justify-around px-2 lg:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-medium transition-colors ${
              isActive ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-stone-500 dark:text-stone-400 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            <Icon size={20} className={isActive ? "text-emerald-700 dark:text-emerald-400 mb-0.5" : "text-stone-400 dark:text-stone-600 mb-0.5"} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
