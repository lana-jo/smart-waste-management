"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const value = useMemo(() => ({ showToast }), [showToast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] lg:bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-50 flex flex-col gap-2 max-w-sm w-auto sm:w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium animate-toast-enter ${
              t.type === "success"
                ? "bg-emerald-900/95 text-emerald-50 border-emerald-700/50 shadow-emerald-950/20"
                : t.type === "error"
                ? "bg-rose-900/95 text-rose-50 border-rose-700/50 shadow-rose-950/20"
                : "bg-stone-900/95 text-stone-50 border-stone-700/50 shadow-stone-950/20"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />}
            <div className="flex-1 leading-relaxed">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-stone-400 hover:text-stone-200 transition-colors min-h-11 min-w-11 flex items-center justify-center shrink-0 rounded-lg -mr-2"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider");
  }
  return context;
}
