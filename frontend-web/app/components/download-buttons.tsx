"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Smartphone, X, Info } from "lucide-react";

export function DownloadButtons() {
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modalMessage) return;
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setModalMessage(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalMessage]);

  function handleIosDownload() {
    setModalMessage(
      "Aplikasi iOS Smart Waste Management akan segera dirilis secara resmi melalui Apple App Store dan TestFlight. Silakan gunakan versi web portal terlebih dahulu."
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch justify-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto">
        <a
          href="/downloads/smart-waste.apk"
          download="smart-waste.apk"
          className="w-full sm:w-auto min-h-[48px] max-w-full inline-flex items-center justify-center gap-3 bg-white text-emerald-900 px-6 sm:px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg sm:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900"
        >
          <Download size={20} className="text-emerald-700" />
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Download untuk Android</p>
            <p className="text-sm font-bold">Installer APK</p>
          </div>
        </a>

        <button
          type="button"
          onClick={handleIosDownload}
          className="w-full sm:w-auto min-h-[48px] max-w-full inline-flex items-center justify-center gap-3 bg-emerald-950/80 border border-emerald-700 text-white px-6 sm:px-8 py-4 rounded-xl font-semibold hover:bg-emerald-950 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900"
        >
          <Smartphone size={20} className="text-emerald-400" />
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Download untuk iOS</p>
            <p className="text-sm font-bold">App Store</p>
          </div>
        </button>
      </div>

      {/* Modal Notification */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-backdrop-fade">
          <div role="dialog" aria-modal="true" aria-labelledby="download-title" className="animate-menu-enter bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-stone-900 dark:text-stone-100 relative">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setModalMessage(null)}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Info size={22} />
              </div>
              <h3 id="download-title" className="font-bold text-lg">Informasi Unduhan</h3>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {modalMessage}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalMessage(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
