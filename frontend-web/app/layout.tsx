import type { Metadata } from "next";
import { AuthProvider } from "./lib/auth-context";
import { ToastProvider } from "./components/toast";
import { AppShell } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { ClientErrorReporter } from "./components/error-reporter";
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
    <html lang="id" suppressHydrationWarning>
      <body className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased font-sans">
        <ClientErrorReporter />
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <ToastProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
