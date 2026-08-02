import type { Metadata } from "next";
import { CombinationsTool } from "@/components/tools/CombinationsTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Combinaciones de carga simplificadas NEC-SE-CG: 1.4D y 1.2D+1.6L. Obtén q_u (kN/m²) y w (kN/m) para anteproyecto académico en Ecuador. CivilKit EC.";

export const metadata: Metadata = createPageMetadata({
  title: "Combinaciones NEC - 1.2D+1.6L y 1.4D",
  description,
  path: "/combinaciones-nec",
});

export default function CombinationsPage() {
  return <CombinationsTool />;
}
