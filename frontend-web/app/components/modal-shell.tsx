"use client";

import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject } from "react";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shell modal reusable (R74): satu sumber logika scroll-lock + restore fokus,
// Escape (opsional, untuk modal teratas), penjebakan Tab, dan anti-klik backdrop.
// Dipakai oleh modul reports dan users (warna/ring tetap di layer fitur via dialogClassName).
function useModalBehavior(onClose: () => void, escapeEnabled: boolean, dialogContainerRef: RefObject<HTMLDivElement | null>): void {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogContainerRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [dialogContainerRef]);

  useEffect(() => {
    if (!escapeEnabled) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, escapeEnabled]);
}

interface ModalShellProps {
  titleId: string;
  onClose: () => void;
  escapeEnabled?: boolean;
  dialogClassName: string;
  children: ReactNode;
}

export function ModalShell({ titleId, onClose, escapeEnabled = true, dialogClassName, children }: ModalShellProps) {
  const dialogContainerRef = useRef<HTMLDivElement>(null);
  const backdropPointerDown = useRef(false);
  useModalBehavior(onClose, escapeEnabled, dialogContainerRef);

  const handleTabKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const container = dialogContainerRef.current;
    if (!container) return;
    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const last = focusable[focusable.length - 1];
    if (focusable.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }
    if (!container.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? last : focusable[0]).focus();
      return;
    }
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      focusable[0].focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-backdrop-fade"
      onPointerDown={(event) => { backdropPointerDown.current = event.target === event.currentTarget; }}
      onClick={() => { if (backdropPointerDown.current) onClose(); }}
    >
      <div
        ref={dialogContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleTabKey}
        onClick={(event) => event.stopPropagation()}
        className={`relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl focus:outline-none animate-modal-enter ${dialogClassName}`}
      >
        {children}
      </div>
    </div>
  );
}