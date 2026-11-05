"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Konfirmasi Hapus</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-full text-rose-600 dark:text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <p className="text-sm">
              Apakah Anda yakin ingin menghapus pengguna <strong className="text-stone-900 dark:text-stone-100">&ldquo;{userName}&rdquo;</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-60 shadow-xs"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{isDeleting ? "Menghapus..." : "Hapus Pengguna"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
