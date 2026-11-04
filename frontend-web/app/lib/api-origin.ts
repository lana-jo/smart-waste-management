// Satu sumber kebenaran origin backend untuk CLIENT bundle. Dipakai app/lib/api.ts
// dan proxy.ts (CSP connect-src). next.config.ts punya var server terpisah
// (NEXT_API_PROXY_ORIGIN, default localhost:8000) — sinkronkan manual bila berubah.
const DEV_FALLBACK_ORIGIN = "http://localhost:8000";

// Semantik env (disamakan dengan next.config.ts):
// - undefined              -> dev: fallback localhost:8000; produksi: dilarang
//                             pakai fallback http://, jadi fetch relatif
//                             same-origin + diagnostik khusus log server (bukan
//                             console browser pengguna — lihat R4).
// - ""                     -> fetch relatif same-origin (deployment ber-proxy).
// - selain itu             -> pakai nilainya, buang trailing slash.
export function resolveApiOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw === undefined) {
    if (process.env.NODE_ENV === "production") {
      if (typeof window === "undefined") {
        console.info(
          "[api-origin] NEXT_PUBLIC_API_URL tidak diset saat build produksi. " +
            "Fallback http://localhost tidak dipakai di produksi; request API " +
            "jalan relatif (same-origin). Set NEXT_PUBLIC_API_URL saat build " +
            "kalau backend tidak berada di origin yang sama.",
        );
      }
      return "";
    }
    return DEV_FALLBACK_ORIGIN;
  }
  return raw.replace(/\/+$/, "");
}
