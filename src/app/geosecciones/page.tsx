import type { Metadata } from "next";
import { GeoSectionsTool } from "@/components/tools/GeoSectionsTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Calculadora gratuita de propiedades de sección: área, inercia, módulo de sección y radio de giro para rectángulo, círculo y sección T. Herramienta CivilKit EC para pregrado en Ecuador.";

export const metadata: Metadata = createPageMetadata({
  title: "GeoSecciones - Área e inercia de secciones",
  description,
  path: "/geosecciones",
});

export default function GeoSectionsPage() {
  return <GeoSectionsTool />;
}
