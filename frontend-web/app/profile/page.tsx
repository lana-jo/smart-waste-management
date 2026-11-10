"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, CheckCircle2, AlertCircle, Loader2, Save, Shield, LogOut } from "lucide-react";
import { apiFetch, type AuthUser } from "../lib/api";
import { useAuth } from "../lib/auth-context";

export default function ProfilePage() {
  const { user, isLoading: authLoading, updateUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-stone-500 dark:text-stone-400 gap-2" role="status">
        <Loader2 className="animate-spin" size={20} />
        <span>Memuat profil akun...</span>
      </div>
    );
  }

  return <ProfileForm key={user.id} authUser={user} updateUser={updateUser} logout={logout} />;
}

function ProfileForm({
  authUser,
  updateUser,
  logout,
}: {
  authUser: AuthUser;
  updateUser: (updated: AuthUser) => void;
  logout: () => void;
}) {
  const [name, setName] = useState(authUser.name);
  const [email, setEmail] = useState(authUser.email);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Nama dan email wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: trimmedName,
        email: trimmedEmail,
      };
      if (password) {
        if (password.length < 8) {
          setError("Password baru minimal 8 karakter.");
          setSubmitting(false);
          return;
        }
        body.password = password;
      }

      const updatedUser = await apiFetch<AuthUser>("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      updateUser(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setSuccessMessage("Profil berhasil diperbarui.");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui profil.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 text-balance">Profil Saya</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Kelola informasi akun, kredensial, dan keamanan sandi Anda.</p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-700" />

        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6 pb-6 border-b border-stone-100 dark:border-stone-800 text-center sm:text-left">
          <div aria-hidden="true" className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-2xl font-bold shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 max-w-full">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 break-words text-balance">{name}</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 break-all text-balance">{email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 capitalize">
                <Shield size={12} />
                {authUser.role}
              </span>
            </div>
          </div>
        </div>

        {successMessage ? (
          <div role="status" className="mb-6 p-4 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-lg text-sm font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="text-teal-700 dark:text-teal-400 shrink-0" />
            <span className="break-words">{successMessage}</span>
          </div>
        ) : null}
        {error ? (
          <div role="alert" className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-lg text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="profileName" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-2">
              <User size={16} className="text-stone-400" />
              <span>Nama Lengkap</span>
            </label>
            <input
              id="profileName"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-11 px-3.5 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="profileEmail" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-2">
              <Mail size={16} className="text-stone-400" />
              <span>Email</span>
            </label>
            <input
              id="profileEmail"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-11 px-3.5 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div>
            <label htmlFor="profilePassword" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-2">
              <Lock size={16} className="text-stone-400" />
              <span>Password Baru (Opsional)</span>
            </label>
            <input
              id="profilePassword"
              type="password"
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak ingin mengubah password"
              className="w-full min-h-11 px-3.5 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg text-base bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 min-h-[44px] bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{submitting ? "Menyimpan Perubahan..." : "Simpan Perubahan"}</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 min-h-[44px] bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
            >
              <LogOut size={16} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
