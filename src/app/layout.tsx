import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avaliador de Imóveis",
  description: "Laudos de avaliação de imóveis urbanos e rurais pelo Método Evolutivo",
};

export const viewport: Viewport = {
  themeColor: "#3F5A44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
