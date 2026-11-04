import { NextRequest, NextResponse } from "next/server";
import { resolveApiOrigin } from "./app/lib/api-origin";

function resolveCspApiOrigins(): string[] {
  const base = resolveApiOrigin();
  if (base === "") {
    return [];
  }
  if (!/^https?:\/\//.test(base)) {
    return [];
  }
  try {
    return [new URL(base).origin];
  } catch {
    return [];
  }
}

export function proxy(request: NextRequest) {
  try {
    const apiOrigins = resolveCspApiOrigins();
    const apiSuffix = apiOrigins.length ? " " + apiOrigins.join(" ") : "";
    const isProduction = process.env.NODE_ENV === "production";

    // Nonce per-request + 'strict-dynamic' ditinggalkan: HTML halaman statis
    // (SSG, seperti login) tidak membawa nonce di script manapun, dan beacon
    // Cloudflare tidak bisa membawa atribut nonce, sehingga semua script
    // terblokir. Trade-off: script-src pakai allowlist + 'unsafe-inline'.
    const cspBase = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      `connect-src 'self' https://static.cloudflareinsights.com${apiSuffix}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    // Endpoint laporan SELALU di-emit: bila NEXT_PUBLIC_API_URL kosong, URL
    // relatif resolve ke origin frontend lalu diteruskan rewrites() di
    // next.config.ts ke backend, jadi pelanggaran tetap terlapor.
    const apiPrefix = apiOrigins[0] ?? "";
    const reportUri = `${apiPrefix}/api/csp-report`;

    const cspEnforceParts = [cspBase];
    if (isProduction) {
      cspEnforceParts.push("upgrade-insecure-requests");
    }
    cspEnforceParts.push(`report-uri ${reportUri}`, "report-to csp-report");
    const cspEnforce = cspEnforceParts.join("; ");

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Content-Security-Policy", cspEnforce);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", cspEnforce);
    response.headers.set("Reporting-Endpoints", `csp-report="${reportUri}"`);

    return response;
  } catch (err) {
    console.error("proxy CSP gagal:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
