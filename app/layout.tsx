import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema POS Carnicería",
  description: "Aplicación de punto de venta para carnicería",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
