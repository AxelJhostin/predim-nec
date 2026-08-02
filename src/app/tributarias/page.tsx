import type { Metadata } from "next";
import { TributaryTool } from "@/components/tools/TributaryTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Calculadora de áreas tributarias para columnas y anchos tributarios de vigas. Estima At (m²) y w (kN/m) para llevar a PreDim NEC. Gratis, pregrado Ecuador.";

export const metadata: Metadata = createPageMetadata({
  title: "Tributarias - Área tributaria columnas y vigas",
  description,
  path: "/tributarias",
});

export default function TributaryPage() {
  return <TributaryTool />;
}
