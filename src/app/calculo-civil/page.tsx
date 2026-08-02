import type { Metadata } from "next";
import { CalculusCivilTool } from "@/components/tools/CalculusCivilTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Calculadora de derivadas e integrales paso a paso para estudiantes de ingeniería civil en Ecuador. Incluye centroides e inercia por integración. CivilKit EC.";

export const metadata: Metadata = createPageMetadata({
  title: "Cálculo para civil - Derivadas e integrales paso a paso",
  description,
  path: "/calculo-civil",
  keywords: [
    "derivadas paso a paso",
    "integrales ingeniería civil",
    "centroide por integración",
    "inercia sección integral",
  ],
});

export default function CalculusCivilPage() {
  return <CalculusCivilTool />;
}
