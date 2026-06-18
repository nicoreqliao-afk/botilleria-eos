import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/business";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://botilleria-eos.cl"),
  title: {
    default: `${business.name} · ${business.city}`,
    template: `%s · ${business.name}`,
  },
  description: `${business.name} en ${business.sector}, ${business.city}. Cervezas, vinos, whisky, pisco y más. ${business.rating}★ con ${business.reviews} reseñas. Abierto hasta tarde · pedidos por WhatsApp.`,
  keywords: [
    "botillería Talca",
    "EOS Talca",
    "delivery alcohol Talca",
    "cervezas Talca",
    "vinos Talca",
    "Villa Bicentenario",
  ],
  openGraph: {
    title: `${business.name} · ${business.city}`,
    description: `Cervezas, vinos, whisky y más en ${business.sector}, ${business.city}. ${business.rating}★ con ${business.reviews} reseñas.`,
    locale: "es_CL",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#100B0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL" className={`${fraunces.variable} ${archivo.variable}`}>
      <body className="grain min-h-dvh">{children}</body>
    </html>
  );
}
