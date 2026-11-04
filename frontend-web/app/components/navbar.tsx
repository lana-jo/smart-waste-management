"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, FileText, Users, User, LogOut, Leaf, ChevronDown } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    logout();
  };

  const handleToggleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/reports", label: "Laporan", icon: FileText },
        ...(user.role === "admin" ? [{ href: "/users", label: "Pengguna", icon: Users }] : []),
      ]
    : [];

  return (
    <header className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition-colors">
              <Leaf size={20} />
            </div>
            <span className="font-semibold tracking-tight text-stone-900 dark:text-stone-100 text-base sm:text-lg">
              Smart Waste Portal
            </span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-600 dark:text-stone-300">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold"
                        : "hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-2 min-h-11 min-w-11 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                onClick={() => setMenuOpen(!menuOpen)}
                onKeyDown={handleToggleKey}
                aria-label="Buka menu navigasi"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                <Menu size={20} />
              </button>

              {/* Desktop User Dropdown */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 leading-tight">{user.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 capitalize leading-tight mt-0.5">{user.role}</p>
                  </div>
                  <ChevronDown size={14} className="text-stone-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg py-1.5 z-50 divide-y divide-stone-100 dark:divide-stone-800">
                    <div className="px-4 py-2">
                      <p className="text-xs text-stone-500 dark:text-stone-400">Masuk sebagai</p>
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        <User size={16} className="text-stone-500" />
                        Profil
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left"
                      >
                        <LogOut size={16} className="text-rose-500" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      {menuOpen && user ? (
        <nav id="mobile-nav" className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-3 flex flex-col gap-1.5 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold"
                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-stone-200 dark:border-stone-800 mt-2 pt-3 flex flex-col gap-1 px-2">
            <div className="mb-2">
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{user?.name}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">{user?.role}</p>
            </div>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <User size={16} className="text-stone-500" />
              Profil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left"
            >
              <LogOut size={16} className="text-rose-500" />
              Keluar
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
