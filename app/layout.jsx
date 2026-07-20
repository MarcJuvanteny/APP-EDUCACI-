import "./globals.css";

export const metadata = {
  title: "Arrel — Avaluacio de l'alumnat",
  description: "Aplicacio educativa feta amb Next.js i React",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
