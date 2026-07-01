import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/business";
import { BusinessJsonLd } from "@/components/site/JsonLd";

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
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} · Botillería en ${business.city} abierta hasta tarde`,
    template: `%s · ${business.name}`,
  },
  description: `${business.name}, botillería en ${business.sector}, ${business.city}. Cervezas, vinos, whisky, pisco, espumantes y más. ${business.rating}★ con ${business.reviews} reseñas. Abierto hasta tarde todos los días · pedidos por WhatsApp.`,
  applicationName: business.name,
  keywords: [
    "botillería Talca",
    "botillería EOS",
    "EOS Talca",
    "botillería Villa Bicentenario",
    "delivery alcohol Talca",
    "cervezas Talca",
    "vinos Talca",
    "licores Talca",
    "botillería abierta hasta tarde Talca",
    "Villa Bicentenario",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${business.name} · Botillería en ${business.city}`,
    description: `Cervezas, vinos, whisky, pisco y más en ${business.sector}, ${business.city}. ${business.rating}★ con ${business.reviews} reseñas. Abierto hasta tarde · pedidos por WhatsApp.`,
    url: business.siteUrl,
    siteName: business.name,
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/fondo-frente.jpg",
        width: 1200,
        height: 630,
        alt: `Fachada de ${business.name} en ${business.city}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} · Botillería en ${business.city}`,
    description: `Cervezas, vinos, whisky y más. ${business.rating}★ con ${business.reviews} reseñas. Abierto hasta tarde · pedidos por WhatsApp.`,
    images: ["/fondo-frente.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
      <body className="grain min-h-dvh">
        <BusinessJsonLd />
        {children}
      </body>
    </html>
  );
}
