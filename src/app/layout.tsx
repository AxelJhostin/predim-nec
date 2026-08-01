import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  serializeJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "PreDim NEC - Predimensionamiento Estructural Ecuador",
    template: "%s | PreDim NEC",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "predimensionamiento estructural",
    "calculadora NEC",
    "vigas de hormigón",
    "columnas de hormigón",
    "losas de hormigón",
    "Norma Ecuatoriana de la Construcción",
    "ingeniería civil Ecuador",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  category: "engineering",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "/",
    siteName: SITE_NAME,
    title: "PreDim NEC - Predimensionamiento Estructural Ecuador",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "PreDim NEC - Predimensionamiento Estructural Ecuador",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#E65100",
  colorScheme: "light",
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "EngineeringApplication",
  operatingSystem: "Any",
  browserRequirements: "Requiere un navegador web moderno con JavaScript.",
  inLanguage: "es-EC",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Predimensionamiento de vigas de hormigón armado",
    "Predimensionamiento de columnas de hormigón armado",
    "Predimensionamiento de losas macizas y nervadas",
    "Memoria técnica imprimible",
    "Proyectos locales exportables en JSON",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(webApplicationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
