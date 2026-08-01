import type { BeamInputs } from "@/calculations";
import type { ExamplePreset } from "./types";

export const beamExamples: ExamplePreset<BeamInputs>[] = [
  {
    id: "beam-residential",
    label: "Residencial",
    description: "Viga continua de entrepiso, luz típica 5,0 m.",
    values: {
      spanM: 5,
      supportType: "Ambos extremos continuos",
      designLoadKnM: 7.5,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: 21,
      stirrupDiameterMm: 10,
    },
  },
  {
    id: "beam-classroom",
    label: "Aula",
    description: "Viga de aula o pasillo, luz 7,0 m y mayor carga.",
    values: {
      spanM: 7,
      supportType: "Un extremo continuo",
      designLoadKnM: 12,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: 21,
      stirrupDiameterMm: 10,
    },
  },
  {
    id: "beam-cantilever",
    label: "Voladizo",
    description: "Balcón o voladizo corto, luz 2,0 m.",
    values: {
      spanM: 2,
      supportType: "Voladizo",
      designLoadKnM: 6,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: 21,
      stirrupDiameterMm: 10,
    },
  },
];
