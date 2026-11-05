import Link from "next/link";
import { Leaf, ArrowRight, Download, Cpu, ShieldCheck } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-emerald-50/50 via-stone-50 to-stone-50 dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
              <Leaf size={14} />
              <span>Smart Waste Management System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
              Sistem Pengelolaan Sampah dengan <span className="text-emerald-700 dark:text-emerald-400">Klasifikasi AI</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Platform terpadu berbasis FastAPI dan Next.js untuk pelaporan sampah, manajemen pengguna, serta klasifikasi gambar sampah menggunakan model AI Keras.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="#download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-emerald-800 transition-all shadow-md shadow-emerald-700/20 hover:scale-[1.02]"
              >
                <Download size={18} />
                <span>Download Mobile App</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 px-6 py-3.5 rounded-xl font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
              >
                <span>Masuk Portal Web</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Metrics Trust Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-200 dark:border-stone-800 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">FastAPI</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">REST Backend</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">Keras AI</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Model Klasifikasi</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">Next.js</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Web Portal</p>
              </div>
            </div>
          </div>

          {/* Right Visual Column / App Preview Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-3xl p-3 shadow-2xl shadow-emerald-900/30 text-white">
              <div className="absolute -top-4 -right-4 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 px-4 py-2 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 text-xs font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>API Endpoint Ready</span>
              </div>

              {/* Phone screen simulation */}
              <div className="bg-stone-900 rounded-2xl p-5 space-y-4 text-stone-100 border border-stone-800">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center">
                      <Leaf size={14} />
                    </div>
                    <span className="font-bold text-sm">SmartWaste Mobile</span>
                  </div>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full font-medium">v1.0</span>
                </div>

                <div className="bg-stone-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Endpoint AI Prediction</span>
                    <span className="text-emerald-400 font-semibold">POST /api/ml/predict</span>
                  </div>
                  <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                  <p className="text-[11px] text-stone-400 pt-1">Analisis foto sampah menggunakan `waste_model.keras`</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-stone-800/80 rounded-xl p-3 space-y-1">
                    <div className="text-emerald-400"><Cpu size={18} /></div>
                    <p className="text-xs font-semibold">AI Predict</p>
                    <p className="text-[10px] text-stone-400">Klasifikasi foto</p>
                  </div>
                  <div className="bg-stone-800/80 rounded-xl p-3 space-y-1">
                    <div className="text-emerald-400"><ShieldCheck size={18} /></div>
                    <p className="text-xs font-semibold">JWT Auth</p>
                    <p className="text-[10px] text-stone-400">Keamanan akses</p>
                  </div>
                </div>

                <div className="bg-emerald-700 text-white rounded-xl p-3 text-center text-xs font-medium shadow-sm">
                  Uji Coba Mobile App
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
