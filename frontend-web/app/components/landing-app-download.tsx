"use client";

import { Smartphone, Download, CheckCircle2, QrCode, Shield } from "lucide-react";

export function LandingAppDownload() {
  function handleDownload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    alert("Source code mobile app tersedia pada direktori `mobile-app/` di repositori ini. Silakan build menggunakan React Native / Expo.");
  }

  return (
    <section id="download" className="py-20 bg-gradient-to-b from-stone-50 to-emerald-50/30 dark:from-stone-950 dark:to-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          {/* Background decorative elements */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-800/50 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-700/30 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold tracking-wide">
                <Smartphone size={14} />
                <span>Aplikasi Mobile React Native</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Download Mobile App & Uji Fitur Scan AI
              </h2>

              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-xl">
                Aplikasi seluler pendamping untuk melakukan autentikasi, melihat dashboard, dan mengirim foto sampah ke endpoint klasifikasi AI FastAPI.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-emerald-100 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Autentikasi pengguna terintegrasi dengan endpoint `/api/auth/login`</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-100 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Pemindaian gambar sampah langsung ke model AI Keras `/api/ml/predict`</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-100 text-sm">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0`" />
                  <span>Navigasi mobile interaktif dengan tema gelap/terang adaptif</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-3 bg-white text-emerald-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:scale-105 cursor-pointer"
                >
                  <Download size={20} className="text-emerald-700" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Source Code Mobile App</p>
                    <p className="text-sm font-bold">Direktori `mobile-app/`</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right QR Code / Card Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xs w-full text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <QrCode size={36} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-stone-900">React Native Mobile App</h3>
                  <p className="text-xs text-stone-500">Tersedia dalam direktori `mobile-app` untuk pengembangan dan pengujian lokal.</p>
                </div>

                <div className="bg-stone-100 border border-stone-200 rounded-2xl p-4 flex items-center justify-center">
                  {/* Simulated QR code grid */}
                  <div className="grid grid-cols-5 gap-1.5 w-36 h-36 bg-white p-2 rounded-xl shadow-xs">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-xs ${i % 2 === 0 || i % 7 === 0 || i === 0 || i === 4 || i === 20 || i === 24 ? "bg-stone-900" : "bg-white"}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
                  <Shield size={14} className="text-emerald-700" />
                  <span>Akses API FastAPI & Keras AI</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
