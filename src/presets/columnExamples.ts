import type { ColumnInputs } from "@/calculations";
import type { ExamplePreset } from "./types";

export const columnExamples: ExamplePreset<ColumnInputs>[] = [
  {
    id: "column-central",
    label: "Central",
    description: "Columna interior de vivienda de 3 pisos.",
    values: {
      tributaryAreaM2: 20,
      floors: 3,
      columnType: "Central",
      serviceLoadKnM2: 8,
      clearHeightM: 2.8,
      effectiveLengthFactor: 1,
      concreteStrengthMpa: 21,
      steelYieldMpa: 420,
      tieDiameterMm: 10,
    },
  },
  {
    id: "column-perimeter",
    label: "Perimetral",
    description: "Columna de fachada, 4 niveles y área media.",
    values: {
      tributaryAreaM2: 16,
      floors: 4,
      columnType: "Perimetral",
      serviceLoadKnM2: 9,
      clearHeightM: 3,
      effectiveLengthFactor: 1,
      concreteStrengthMpa: 21,
      steelYieldMpa: 420,
      tieDiameterMm: 10,
    },
  },
  {
    id: "column-corner",
    label: "Esquina",
    description: "Columna esquinera con mayor factor de posición.",
    values: {
      tributaryAreaM2: 12,
      floors: 4,
      columnType: "Esquina",
      serviceLoadKnM2: 9,
      clearHeightM: 3,
      effectiveLengthFactor: 1,
      concreteStrengthMpa: 21,
      steelYieldMpa: 420,
      tieDiameterMm: 10,
    },
  },
];
