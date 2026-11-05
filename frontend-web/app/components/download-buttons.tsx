"use client";

import { useState } from "react";
import { Download, Smartphone, X, Info } from "lucide-react";

export function DownloadButtons() {
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  function handleIosDownload() {
    setModalMessage(
      "Aplikasi iOS Smart Waste Management akan segera dirilis secara resmi melalui Apple App Store dan TestFlight. Silakan gunakan versi web portal terlebih dahulu."
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <a
          href="/downloads/smart-waste.apk"
          download="smart-waste.apk"
          className="inline-flex items-center gap-3 bg-white text-emerald-900 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:scale-105"
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
          className="inline-flex items-center gap-3 bg-emerald-950/80 border border-emerald-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-950 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-stone-900 dark:text-stone-100 relative">
            <button
              type="button"
              onClick={() => setModalMessage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Info size={22} />
              </div>
              <h3 className="font-bold text-lg">Informasi Unduhan</h3>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {modalMessage}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalMessage(null)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
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
