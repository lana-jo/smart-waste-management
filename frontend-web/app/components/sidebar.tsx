"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, LogOut, Leaf, 
  ChevronDown, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { NavLinks } from "./nav-links";
import { BottomNav } from "./bottom-nav";
import { ThemeToggle } from "./theme-toggle";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user || isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
        <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Leaf size={20} />
            </div>
            <span className="font-semibold tracking-tight text-stone-900 dark:text-stone-100 text-base sm:text-lg">
              Smart Waste Portal
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <ThemeToggle />
            <Link href="/login" className="px-4 py-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs">
              Daftar
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">{children}</div>
        </main>
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
          Sistem Pengelolaan Sampah Terpadu — Bilcode Technology Assessment
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-16 lg:pb-0 transition-colors">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 fixed inset-y-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`h-16 px-4 flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} border-b border-stone-200 dark:border-stone-800`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Leaf size={20} />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold tracking-tight text-stone-900 dark:text-stone-100 text-base truncate">
                Smart Waste
              </span>
            )}
          </Link>
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto">
          <NavLinks pathname={pathname} role={user.role} isCollapsed={sidebarCollapsed} />
        </div>

        <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Tema</span>
              <ThemeToggle />
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center py-1">
              <ThemeToggle />
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors text-sm font-medium"
            title={sidebarCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
            aria-label={sidebarCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs">Kecilkan</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Layout with Top Header & Dropdown Profile / Keluar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"} pl-0`}>
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Leaf size={18} />
              </div>
              <span className="font-bold tracking-tight text-stone-900 dark:text-stone-100 text-sm">Smart Waste</span>
            </div>
          </div>

          {/* Account Dropdown & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm font-medium text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <User size={16} className="text-stone-400" />
                    <span>Profil</span>
                  </Link>
                  <div className="border-t border-stone-100 dark:border-stone-800 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Theme toggle for mobile header */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 text-center text-xs text-stone-500 dark:text-stone-400 mb-16 lg:mb-0">
          Sistem Pengelolaan Sampah Terpadu — Bilcode Technology Assessment
        </footer>
      </div>

      {/* Tablet & Mobile Bottom Navigation Bar */}
      <BottomNav role={user.role} />
    </div>
  );
}
