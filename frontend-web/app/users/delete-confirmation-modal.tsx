"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { ModalShell } from "../components/modal-shell";

interface Props {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  show,
  onClose,
  onConfirm,
  userName,
  isDeleting,
}: Props) {
  if (!show) return null;

  return (
    <ModalShell titleId="delete-title" onClose={onClose} dialogClassName="w-full max-w-sm">
      <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800">
        <h2 id="delete-title" className="text-lg font-semibold text-stone-900 dark:text-stone-100">Konfirmasi Hapus</h2>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none -mr-2"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-4 text-stone-600 dark:text-stone-400">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-full text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle size={20} aria-hidden="true" />
          </div>
          <p className="text-sm">
            Apakah Anda yakin ingin menghapus pengguna <strong className="text-stone-900 dark:text-stone-100">&ldquo;{userName}&rdquo;</strong>? Akun akan menjadi nonaktif dan tidak dapat dibatalkan dari halaman ini.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="w-full sm:w-auto min-h-11 px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="w-full sm:w-auto min-h-11 justify-center flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-60 shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950 focus-visible:outline-none"
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
          <span>{isDeleting ? "Menghapus..." : "Hapus Pengguna"}</span>
        </button>
      </div>
    </ModalShell>
  );
}
