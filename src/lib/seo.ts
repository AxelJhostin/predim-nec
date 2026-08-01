import type { Metadata } from "next";

export const SITE_URL = "https://predim-nec.vercel.app";
export const SITE_NAME = "PreDim NEC";
export const SITE_DESCRIPTION =
  "Calculadora gratuita para predimensionamiento de vigas, columnas y losas según la Norma Ecuatoriana de la Construcción (NEC).";
export const SITE_AUTHOR = "Hernández Axel";
export const SITE_AFFILIATION = "PUCE sede Portoviejo";
export const SITE_CREDIT = `${SITE_AUTHOR} · ${SITE_AFFILIATION}`;

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

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "es_EC",
      url: path,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function serializeJsonLd(value: object) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
