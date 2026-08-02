import type { Metadata } from "next";

export const SITE_URL = "https://predim-nec.vercel.app";
/** Marca de la suite. */
export const SITE_NAME = "CivilKit EC";
/** Módulo estrella de predimensionamiento. */
export const PREDIM_NAME = "PreDim NEC";
export const SITE_DESCRIPTION =
  "Suite gratuita de herramientas de ingeniería civil para pregrado en Ecuador (NEC): predimensionamiento, conceptos básicos y apoyo de anteproyecto.";
export const PREDIM_DESCRIPTION =
  "Calculadora gratuita de predimensionamiento y diseño simplificado de vigas, columnas y losas según la NEC. Herramienta académica: el diseño final requiere revisión profesional.";
export const SITE_AUTHOR = "Hernández Axel";
export const SITE_AFFILIATION = "PUCE sede Portoviejo";
export const SITE_CREDIT = `${SITE_AUTHOR} · ${SITE_AFFILIATION}`;
export const SITE_TAGLINE = "Gratis · Ecuador · Pregrado · NEC";

export const calculatorPages = [
  {
    slug: "/calculadora-vigas-nec",
    title: "Calculadora de vigas según NEC Ecuador",
    description:
      "Calcula el peralte y ancho preliminar de vigas de hormigón armado según el tipo de apoyo, carga lineal y criterios NEC-SE-HM.",
  },
  {
    slug: "/calculadora-columnas-nec",
    title: "Calculadora de columnas según NEC Ecuador",
    description:
      "Predimensiona columnas de hormigón armado con carga tributaria, número de pisos, posición, esbeltez y dimensión mínima NEC.",
  },
  {
    slug: "/calculadora-losas-nec",
    title: "Calculadora de losas según NEC Ecuador",
    description:
      "Estima el espesor preliminar de losas macizas y nervadas mediante relaciones de luz y criterios de la NEC ecuatoriana.",
  },
] as const;

/** Imagen social por defecto (1200×630 recomendado vía opengraph-image). */
export const DEFAULT_OG_IMAGE = "/icons/icon-512.png";

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const absoluteUrl = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const mergedKeywords = [
    SITE_NAME,
    PREDIM_NAME,
    "NEC Ecuador",
    "ingeniería civil",
    "pregrado",
    ...keywords,
  ];

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "es_EC",
      url: absoluteUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 512,
          height: 512,
          alt: `${SITE_NAME} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
