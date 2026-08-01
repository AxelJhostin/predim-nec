import type { Metadata } from "next";
import {
  CalculatorSeoPage,
  calculatorContent,
} from "@/components/CalculatorSeoPage";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Estima el espesor preliminar de losas macizas y nervadas según su luz principal, con procedimiento, redondeo y criterios técnicos documentados.";

export const metadata: Metadata = createPageMetadata({
  title: "Calculadora de losas según NEC Ecuador",
  description,
  path: "/calculadora-losas-nec",
});

export default function SlabCalculatorPage() {
  return <CalculatorSeoPage content={calculatorContent.slab} />;
}
