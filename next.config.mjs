// Origen real de Supabase (si esta configurat) per poder-lo afegir a la CSP
// sense haver de hardcodejar cap domini concret al codi.
const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
  } catch {
    return "";
  }
})();

const isDev = process.env.NODE_ENV !== "production";

// NOTA sobre 'unsafe-inline' a script-src/style-src: el "quadern" (public/quadern.js
// i .css) s'injecta com a <script>/<style> inline en temps d'execucio des de
// app/_components/quadern-prototype.jsx (fetch + textContent), no com a fitxers
// externs — per aixo no es pot aplicar una CSP estricta basada en nonces sense
// reescriure aquest mecanisme d'injeccio. Els altres orígens es limiten igualment
// al mínim necessari (Supabase i Google Fonts).
//
// 'unsafe-eval' i el websocket de HMR (ws:) NOMES calen en desenvolupament —
// "next dev" fa servir eval() pel refresc en calent. Sense aixo la pagina es
// queda en blanc en "npm run dev" (el navegador bloqueja tot el JS). En
// produccio ("next build && next start") no cal cap dels dos.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'" + (supabaseOrigin ? " " + supabaseOrigin : "") + (isDev ? " ws://localhost:*" : ""),
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
