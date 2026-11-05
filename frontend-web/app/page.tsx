import Link from "next/link";
import { Leaf, ArrowRight, Smartphone, ShieldCheck, Sparkles } from "lucide-react";
import { DownloadButtons } from "./components/download-buttons";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-36 bg-gradient-to-b from-emerald-50/60 via-stone-50 to-stone-50 dark:from-emerald-950/20 dark:via-stone-950 dark:to-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
                <Leaf size={14} />
                <span>Smart Waste Management Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
                Solusi Modern Pengelolaan Sampah & <span className="text-emerald-700 dark:text-emerald-400">AI Scanner</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Platform terpadu untuk pemantauan kebersihan kota, pelaporan titik sampah, dan pemindaian jenis sampah cerdas berbasis kecerdasan buatan dalam satu genggaman.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#download"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-700 text-white px-7 py-4 rounded-xl font-medium hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20 hover:scale-[1.02]"
                >
                  <span>Download Mobile App</span>
                </a>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 px-7 py-4 rounded-xl font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
                >
                  <span>Masuk Portal Web</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-200 dark:border-stone-800 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">AI Vision</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Scan Sampah Cepat</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">Real-time</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Pelaporan Warga</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">Aman</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Enkripsi & Autentikasi</p>
                </div>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-3xl p-6 shadow-2xl text-white space-y-6 relative">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">
                  Mobile App Ready
                </div>

                <div className="space-y-2 pt-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                    <Smartphone size={24} />
                  </div>
                  <h3 className="text-xl font-bold">SmartWaste Mobile</h3>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    Unduh aplikasi mobile untuk mendeteksi jenis sampah secara otomatis dan melaporkan masalah lingkungan sekitar dengan mudah.
                  </p>
                </div>

                <div className="bg-stone-900/90 rounded-2xl p-4 space-y-3 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <span>Status Scanner AI</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-stone-800 p-3 rounded-xl">
                    <Sparkles size={18} className="text-emerald-400 shrink-0" />
                    <div className="text-left text-xs">
                      <p className="font-semibold text-stone-200">Deteksi Otomatis</p>
                      <p className="text-stone-400">Organik, Anorganik & Residu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
              Fitur Utama
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Mengapa Menggunakan Smart Waste Management?
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg">
              Dirancang untuk memudahkan warga dan petugas kebersihan dalam mengelola kebersihan lingkungan secara digital dan terstruktur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <Sparkles size={24} />
              </div>
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">Scan Sampah dengan AI</h4>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Ambil foto sampah menggunakan kamera ponsel Anda dan biarkan sistem kecerdasan buatan membantu mengklasifikasikan jenisnya secara instan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <Smartphone size={24} />
              </div>
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">Pelaporan Mudah</h4>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Laporkan tumpukan sampah atau masalah kebersihan di lingkungan Anda langsung melalui aplikasi mobile dengan menyertakan foto dan keterangan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">Keamanan & Privasi</h4>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Sistem dilindungi oleh autentikasi yang aman dan pengelolaan akun terstruktur untuk memastikan data laporan Anda terjaga kerahasiaannya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 bg-gradient-to-b from-stone-50 to-emerald-50/40 dark:from-stone-950 dark:to-emerald-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-800/50 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-700/30 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold tracking-wide">
                <Smartphone size={14} />
                <span>Unduh Aplikasi Mobile</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Mulai Kelola Sampah Lebih Cerdas Hari Ini
              </h2>
              <p className="text-emerald-100 text-base sm:text-lg">
                Dapatkan aplikasi mobile SmartWaste di perangkat Anda untuk mulai menggunakan fitur scan AI dan pelaporan kebersihan kota.
              </p>

              {/* Client Component for download buttons */}
              <DownloadButtons />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
