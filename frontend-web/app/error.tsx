"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TriangleAlert, RefreshCw } from "lucide-react";
import { reportBoundaryError } from "./components/error-reporter";

// Error boundary UI untuk segmen route di bawah layout. Error boundary tidak
// melewati listener window, jadi laporannya dikirim langsung di sini.
export default function ErrorPage({
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
    // Boundary tidak dirender ulang memakai error yang sama, jadi efek ini
    // cukup jalan sekali per kejadian.
  }, [error]);

  return (
    <div className="w-full max-w-md mx-auto pt-4 sm:pt-8 pb-12">
      <div
        role="alert"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 sm:p-8 shadow-xs relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600" />

        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-md mb-3">
          <TriangleAlert size={24} />
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 text-balance"
        >
          Bagian halaman ini gagal dimuat
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400 break-words text-balance">
          Terjadi kesalahan saat menampilkan isi halaman ini. Klik tombol Coba
          lagi di bawah untuk memuat ulang bagian tersebut tanpa keluar dari
          halaman; kalau masalah tetap muncul, kembali ke beranda lalu buka
          kembali menu yang tadi.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 focus-visible:dark:ring-offset-stone-900"
          >
            <RefreshCw size={18} />
            <span>Coba lagi</span>
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-700 focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            Ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
