"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch, SESSION_EXPIRED_EVENT, type AuthSession, type AuthUser } from "./api";

export interface AuthContextValue {
  user: AuthUser | null;
  // Sesi bukan lagi string token: kredensial diset backend lewat cookie
  // HttpOnly, jadi field ini jadi penanda keberadaan sesi. Nama dipertahankan
  // supaya pemakai lama (dashboard, reports) yang hanya mengecek keberadaan
  // tidak perlu ikut berubah.
  token: boolean;
  role: AuthUser["role"] | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  // Sinkron state user setelah PUT /api/auth/me berhasil.
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Ref dibaca listener event supaya keputusan redirect pakai nilai terakhir,
  // bukan nilai dari closure render awal.
  const hasSessionRef = useRef(false);
  // Guard agar dispatch/redirect session-expired hanya terjadi sekali, reset saat
  // login/startSession.
  const sessionExpiredHandledRef = useRef(false);

  const endSession = useCallback(() => {
    hasSessionRef.current = false;
    setHasSession(false);
    setUser(null);
  }, []);

  const startSession = useCallback((me: AuthUser) => {
    hasSessionRef.current = true;
    sessionExpiredHandledRef.current = false;
    setHasSession(true);
    setUser(me);
  }, []);

  useEffect(() => {
    // Sesi tidak pernah dibaca dari storage klien: setiap mount validasi ulang
    // lewat /api/auth/me (cookie HttpOnly dikirim otomatis oleh browser).
    apiFetch<AuthUser>("/api/auth/me")
      .then((me: AuthUser) => {
        startSession(me);
      })
      .catch(() => {
        endSession();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [startSession, endSession]);

  useEffect(() => {
    const onSessionExpired = () => {
      // Tamu tanpa sesi yang kebetulan menabrak 401 cukup dibersihkan:
      // redirect biar dipegang guard keberadaan sesi di tiap halaman.
      const hadSession = hasSessionRef.current;
      endSession();
      if (hadSession) {
        router.push("/login");
      }
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, [endSession, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<AuthSession>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }).toString(),
      });
      startSession(data.user);
    },
    [startSession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiFetch<AuthSession>("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      startSession(data.user);
    },
    [startSession],
  );

  const updateUser = useCallback((updated: AuthUser) => {
    setUser(updated);
  }, []);

  const logout = useCallback(() => {
    // Blacklist jti di backend (cookie HttpOnly) agar token tidak bisa direplay;
    // kegagalan jaringan tidak menghalangi pembuangan sesi klien (fail-open UX).
    void apiFetch<unknown>("/api/auth/logout", { method: "POST" }).catch((err) => {
      console.error("logout backend gagal:", err);
    }).finally(() => {
      endSession();
      router.push("/login");
    });
  }, [endSession, router]);

  const value: AuthContextValue = {
    user,
    token: hasSession,
    role: user?.role ?? null,
    isLoading,
    login,
    register,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
