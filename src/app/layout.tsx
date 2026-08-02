import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import {
  PREDIM_NAME,
  serializeJsonLd,
  SITE_AUTHOR,
  SITE_CREDIT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
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
    default: `${SITE_NAME} - Herramientas de ingeniería civil Ecuador`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "CivilKit EC",
    "ingeniería civil Ecuador",
    "calculadora NEC",
    "predimensionamiento estructural",
    "PreDim NEC",
    "vigas de hormigón",
    "columnas de hormigón",
    "losas de hormigón",
    "Norma Ecuatoriana de la Construcción",
    "estudiantes ingeniería civil",
  ],
  authors: [{ name: SITE_CREDIT, url: SITE_URL }],
  creator: SITE_AUTHOR,
  category: "engineering",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Herramientas de ingeniería civil Ecuador`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} - Herramientas de ingeniería civil Ecuador`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
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
  alternateName: PREDIM_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "EngineeringApplication",
  operatingSystem: "Any",
  browserRequirements: "Requiere un navegador web moderno con JavaScript.",
  inLanguage: "es-EC",
  isAccessibleForFree: true,
  educationalUse: "Pregrado",
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    SITE_TAGLINE,
    `${PREDIM_NAME}: vigas, columnas y losas`,
    "Memoria técnica imprimible",
    "Proyectos locales exportables en JSON",
    "Aplicación instalable (PWA) con soporte offline básico",
  ],
  author: {
    "@type": "Person",
    name: SITE_AUTHOR,
    affiliation: "PUCE sede Portoviejo",
  },
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
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
