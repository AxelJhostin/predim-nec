import type { Metadata } from "next";
import {
  CalculatorSeoPage,
  calculatorContent,
} from "@/components/CalculatorSeoPage";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Predimensiona columnas de hormigón armado según NEC con área tributaria, pisos, carga de servicio, posición, dimensión mínima y esbeltez.";

export const metadata: Metadata = createPageMetadata({
  title: "Calculadora de columnas según NEC Ecuador",
  description,
  path: "/calculadora-columnas-nec",
});

export default function ColumnCalculatorPage() {
  return <CalculatorSeoPage content={calculatorContent.column} />;
}
