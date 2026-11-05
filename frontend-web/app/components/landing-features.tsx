import { Cpu, FileText, Users, Smartphone, BarChart3, Shield } from "lucide-react";

export function LandingFeatures() {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
      title: "Klasifikasi Sampah AI (Keras Model)",
      description: "Endpoint `/api/ml/predict` menggunakan model TensorFlow/Keras (`waste_model.keras`) untuk menganalisis dan mengklasifikasikan foto sampah secara otomatis."
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
      title: "Pelaporan & Manajemen Laporan",
      description: "Modul pelaporan insiden sampah lengkap dengan unggah foto bukti, pelacakan status, dan filter data laporan yang terintegrasi dengan backend FastAPI."
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
      title: "Manajemen Pengguna & RBAC",
      description: "Pengelolaan akun pengguna dengan kontrol peran (Admin & User) untuk membatasi hak akses serta menjaga keamanan data operasional portal."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
      title: "Aplikasi Mobile (React Native)",
      description: "Aplikasi seluler terintegrasi yang menyediakan fitur login, registrasi, dashboard ringkasan, dan pemindaian sampah AI dalam genggaman."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
      title: "Dashboard & Visualisasi Data",
      description: "Widget statistik interaktif dan grafik menggunakan Recharts untuk memantau aktivitas sistem, laporan masuk, dan data pengguna."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
      title: "Autentikasi JWT & Rate Limiting",
      description: "Keamanan berbasis JSON Web Token (JWT), pemblokiran token terstruktur, serta pembatasan rate limit untuk mencegah penyalahgunaan API."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
            Fitur Utama Sistem
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Kapabilitas & Modul Terimplementasi
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg">
            Sesuai dengan implementasi nyata pada repositori backend FastAPI, frontend Next.js, dan aplikasi mobile React Native.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                {feature.title}
              </h4>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
