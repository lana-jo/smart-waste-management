// `next lint` dihapus di Next 16; lint jalan via ESLint CLI dengan flat config.
// Format mengikuti dokumentasi resmi Next.js, bagian "With TypeScript":
// https://nextjs.org/docs/app/api-reference/config/eslint
//
// Catatan versi: proyek memakai TypeScript 6.0.3 (bukan 7) karena
// typescript-eslint 8.72.1 (dep eslint-config-next) melempar error sejak
// module load saat TS >= 7. Naik lagi ke TS 7 hanya setelah
// https://github.com/typescript-eslint/typescript-eslint/issues/10940 selesai.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Default ignores milik eslint-config-next, ditimpa eksplisit.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
