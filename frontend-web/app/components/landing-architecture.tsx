import { Database, Cpu, Server, Layers, Code2 } from "lucide-react";

export function LandingArchitecture() {
  const stack = [
    {
      icon: <Server className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      title: "Next.js & Tailwind CSS",
      desc: "Frontend web portal modern & SSR berkinerja tinggi dengan antarmuka responsif."
    },
    {
      icon: <Code2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      title: "FastAPI & SQLAlchemy",
      desc: "Backend REST API berkecepatan tinggi berbasis Python dengan ORM relasional tangguh."
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      title: "PostgreSQL Database",
      desc: "Penyimpanan data relasional aman dengan isolasi multi-tenant dan indeks performa tinggi."
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
      title: "Python Keras ML Engine",
      desc: "Model deep learning (`waste_model.keras`) untuk klasifikasi gambar sampah secara otomatis."
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
            <Layers size={14} />
            <span>Arsitektur Kelas Enterprise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Dibangun dengan Teknologi Modern & Skalabel
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg">
            Dirancang untuk keandalan tinggi, latensi rendah, dan keamanan data tingkat lanjut dalam menangani operasional kebersihan perkotaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stack.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">{item.title}</h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
