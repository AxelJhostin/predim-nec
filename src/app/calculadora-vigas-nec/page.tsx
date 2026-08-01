import type { Metadata } from "next";
import {
  CalculatorSeoPage,
  calculatorContent,
} from "@/components/CalculatorSeoPage";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Calcula dimensiones preliminares de vigas de hormigón armado según NEC-SE-HM: tipo de apoyo, carga, momento último y resistencia flexional.";

export const metadata: Metadata = createPageMetadata({
  title: "Calculadora de vigas según NEC Ecuador",
  description,
  path: "/calculadora-vigas-nec",
});

export default function BeamCalculatorPage() {
  return <CalculatorSeoPage content={calculatorContent.beam} />;
}
