"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useToast } from "../components/toast";
import { GENERIC_ERROR_MESSAGE, isValidEmail, PASSWORD_MIN_LENGTH } from "../lib/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("email") || "";
    }
    return "";
  });
  const [password, setPassword] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("password") || "";
    }
    return "";
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("email") || params.get("password")) {
        window.history.replaceState({}, "", "/login");
      }
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      const msg = "Email wajib diisi. Silakan masukkan email Anda.";
      setError(msg);
      showToast("error", msg);
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      const msg = "Format email tidak valid. Silakan periksa kembali isian Anda.";
      setError(msg);
      showToast("error", msg);
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      const msg = "Password minimal 8 karakter. Silakan perbaiki password Anda.";
      setError(msg);
      showToast("error", msg);
      return;
    }

    setIsLoading(true);
    try {
      await login(trimmedEmail, password);
      showToast("success", "Berhasil masuk! Mengarahkan ke beranda...");
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE;
      setError(msg);
      showToast("error", msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto pt-8 pb-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md mb-3">
          <Leaf size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Masuk ke Portal</h1>
        <p className="text-sm text-stone-600 mt-1">Sistem Pengelolaan Sampah Kota Terpadu</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-700" />

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-2">
              <Mail size={16} className="text-stone-400" />
              <span>Email</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-2">
              <Lock size={16} className="text-stone-400" />
              <span>Password</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {error ? (
            <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-800 transition-colors disabled:opacity-60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 mt-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{isLoading ? "Sedang Masuk..." : "Masuk"}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600 pt-6 border-t border-stone-100">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
