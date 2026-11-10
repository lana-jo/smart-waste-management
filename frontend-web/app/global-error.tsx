"use client";

import { useEffect, useRef } from "react";
// Dialog error global menggantikan root layout, jadi ia memuat gaya
// halamannya sendiri (pola yang sama dipakai app/global-not-found.tsx).
import "./globals.css";
import { RefreshCw } from "lucide-react";
import { reportBoundaryError } from "./components/error-reporter";

// Boundary ini menggantikan root layout (tempat ThemeProvider hidup), jadi
// class .dark harus dipasang ulang dari localStorage next-themes agar tampilan
// mengikuti tema yang sudah dipilih user.
const THEME_INIT_SCRIPT =
  "try{var t=localStorage.getItem('theme');" +
  "var d=window.matchMedia('(prefers-color-scheme: dark)').matches;" +
  "if(t==='dark'||((t==null||t==='system')&&d))" +
  "{document.documentElement.classList.add('dark')}}catch(e){}";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    console.error(error);
    reportBoundaryError(error);
    // error.tsx global tidak dirender ulang dengan error yang sama; efek cukup jalan sekali.
  }, [error]);

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased font-sans">
        <main className="min-h-screen flex items-center justify-center p-4 sm:p-6" role="alert">
          <div className="w-full max-w-sm mx-auto text-center">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-bold tracking-tight text-balance"
            >
              Aplikasi gagal dimulai
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400 break-words text-balance">
              Terjadi kesalahan yang membuat seluruh tampilan berhenti sebelum
              selesai dimuat. Klik tombol Coba lagi untuk memuat ulang aplikasi
              dari awal; kalau tetap gagal, muat ulang browser atau tunggu
              beberapa saat lagi.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:dark:ring-offset-stone-900"
            >
              <RefreshCw size={18} aria-hidden="true" />
              <span>Coba lagi</span>
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
