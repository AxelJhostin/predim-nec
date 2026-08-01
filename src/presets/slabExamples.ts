import type { SlabInputs } from "@/calculations";
import type { ExamplePreset } from "./types";

export const slabExamples: ExamplePreset<SlabInputs>[] = [
  {
    id: "slab-solid",
    label: "Maciza",
    description: "Losa maciza residencial, luz 4,5 m.",
    values: {
      spanM: 4.5,
      slabType: "solid",
      supportType: "Continua",
      designLoadKnM2: 8,
      steelYieldMpa: 420,
      concreteStrengthMpa: 21,
      coverCm: 2,
    },
  },
  {
    id: "slab-ribbed",
    label: "Nervada",
    description: "Losa aligerada de aula, luz 6,0 m.",
    values: {
      spanM: 6,
      slabType: "ribbed",
      supportType: "Continua",
      designLoadKnM2: 7,
      steelYieldMpa: 420,
      concreteStrengthMpa: 21,
      coverCm: 2.5,
    },
  },
];
