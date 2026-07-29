import "./globals.css";

export const metadata = {
  title: "Arrel — Avaluació de l'alumnat",
  description: "Aplicació educativa feta amb Next.js i React",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
