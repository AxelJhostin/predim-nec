import type { Metadata } from "next";
import { DeflectionTool } from "@/components/tools/DeflectionTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Calculadora de deflexión elástica aproximada de vigas: L/240, L/360, sección bruta y Ec = 4700√f'c. Herramienta de anteproyecto para pregrado en Ecuador.";

export const metadata: Metadata = createPageMetadata({
  title: "Deflexión aprox. - Chequeo L/240 de vigas",
  description,
  path: "/deflexion-aprox",
});

export default function DeflectionPage() {
  return <DeflectionTool />;
}
