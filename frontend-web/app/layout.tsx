import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Waste Management Portal",
  description: "Sistem Manajemen Pengelolaan Sampah Kota",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-stone-50 text-stone-900 antialiased min-h-screen flex flex-col font-sans">
        <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="font-semibold tracking-tight text-emerald-800 text-lg">
              Smart Waste Management
            </a>
            <nav className="flex items-center gap-4 text-sm font-medium text-stone-600">
              <a href="/login" className="hover:text-emerald-800 transition-colors">Masuk</a>
              <a href="/register" className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors">Daftar</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
          Sistem Pengelolaan Sampah Terpadu — Bilcode Technology Assessment
        </footer>
      </body>
    </html>
  );
}
