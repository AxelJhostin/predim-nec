import type { Metadata } from "next";
import { FootingTool } from "@/components/tools/FootingTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Calculadora de zapata aislada preliminar: área por capacidad del suelo, espesor, corte, punzonamiento y acero inferior. Anteproyecto académico NEC Ecuador. CivilKit EC.";

export const metadata: Metadata = createPageMetadata({
  title: "Zapatas PreDim - Zapata aislada preliminar",
  description,
  path: "/zapatas-predim",
});

export default function FootingPage() {
  return <FootingTool />;
}
