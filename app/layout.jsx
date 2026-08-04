import { execSync } from "node:child_process";
import "./globals.css";

export const metadata = {
  title: "SeJus — Avaluació de l'alumnat",
  description: "Aplicació educativa feta amb Next.js i React",
};

// Identifica quin commit s'està servint (útil per confirmar en un cop d'ull
// si Vercel ja ha desplegat l'últim canvi, sense haver d'anar al dashboard a
// comparar hashes). VERCEL_GIT_COMMIT_SHA el posa Vercel automàticament a
// cada build; en local (npm run dev) cau al HEAD de git.
function getCommitSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return null;
  }
}
const COMMIT_SHA = getCommitSha();

export default function RootLayout({ children }) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body>
        {children}
        {COMMIT_SHA ? (
          <div
            style={{
              position: "fixed",
              bottom: 4,
              right: 6,
              fontSize: 10,
              fontFamily: "monospace",
              color: "#00000055",
              background: "transparent",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {COMMIT_SHA}
          </div>
        ) : null}
      </body>
    </html>
  );
}
