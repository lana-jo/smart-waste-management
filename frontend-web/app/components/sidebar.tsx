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

  const isLandingPage = pathname === "/";

  if (!user || isAuthPage || isLandingPage) {
    if (isLandingPage) {
      return (
        <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
          <header className="border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2.5 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
                <Leaf size={20} />
              </div>
              <span className="font-bold tracking-tight text-stone-900 dark:text-stone-100 text-[15px] sm:text-lg truncate">
                Smart Waste
              </span>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-3 text-sm font-medium shrink-0">
              <ThemeToggle />
              <Link href="#features" className="hidden md:inline-flex items-center px-3 py-2 min-h-11 text-stone-600 dark:text-stone-400 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">Fitur</Link>
              <Link href="#download" className="hidden md:inline-flex items-center px-3 py-2 min-h-11 text-stone-600 dark:text-stone-400 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">Download App</Link>
              <Link href="/login" className="px-2.5 py-2 sm:px-4 min-h-11 inline-flex items-center rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
                Masuk
              </Link>
              <Link href="/register" className="bg-emerald-700 text-white px-2.5 py-2 sm:px-4 min-h-11 inline-flex items-center rounded-lg hover:bg-emerald-800 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
                Daftar
              </Link>
            </div>
          </header>
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-8 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-emerald-600" />
                <span className="font-semibold text-stone-800 dark:text-stone-200">Smart Waste Management Ecosystem</span>
              </div>
              <p>&copy; {new Date().getFullYear()} Kota Bersih & Lestari. Semua hak dilindungi.</p>
            </div>
          </footer>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
        <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Leaf size={20} />
            </div>
            <span className="font-semibold tracking-tight text-stone-900 dark:text-stone-100 text-[15px] sm:text-lg truncate">
              Smart Waste Portal
            </span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3 text-sm font-medium shrink-0">
            <ThemeToggle />
            <Link href="/login" className="px-2.5 py-2 sm:px-4 min-h-11 inline-flex items-center rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
              Masuk
            </Link>
            <Link href="/register" className="bg-emerald-700 text-white px-2.5 py-2 sm:px-4 min-h-11 inline-flex items-center rounded-lg hover:bg-emerald-800 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
              Daftar
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">{children}</div>
        </main>
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
          Sistem Pengelolaan Sampah Terpadu — Solusi Kota Bersih & Lestari
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0 transition-colors">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 fixed inset-y-0 z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              title={sidebarCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
              aria-label={sidebarCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
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
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto">
          <NavLinks pathname={pathname} role={user.role} isCollapsed={sidebarCollapsed} />
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
              <span className="font-bold tracking-tight text-stone-900 dark:text-stone-100 text-sm truncate min-w-0">Smart Waste</span>
            </div>
          </div>

          {/* Account Dropdown & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm font-medium text-stone-700 dark:text-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[10rem]">{user.name}</span>
                <ChevronDown size={14} className="text-stone-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg py-1.5 z-50 animate-menu-enter">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 min-h-11 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
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
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 min-h-11 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
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

        <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 pt-4 pb-4 text-center text-xs text-stone-500 dark:text-stone-400">
          Sistem Pengelolaan Sampah Terpadu — Bilcode Technology Assessment
        </footer>
      </div>

      {/* Tablet & Mobile Bottom Navigation Bar */}
      <BottomNav role={user.role} />
    </div>
  );
}
