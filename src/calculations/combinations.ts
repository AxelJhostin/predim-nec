import { formatNumber } from "./format";

/** Combinaciones gravitacionales simplificadas orientadas a NEC-SE-CG / ASCE. */
export type CombinationId = "1.4D" | "1.2D+1.6L";

export interface CombinationInputs {
  deadLoadKnM2: number;
  liveLoadKnM2: number;
  /** Ancho tributario opcional para obtener w (kN/m). */
  tributaryWidthM?: number;
}

export interface CombinationCase {
  id: CombinationId;
  label: string;
  valueKnM2: number;
  formula: string;
}

export interface CombinationResult {
  kind: "combinations";
  inputs: CombinationInputs;
  cases: CombinationCase[];
  governing: CombinationCase;
  serviceLoadKnM2: number;
  designLoadKnM: number | null;
  summary: string;
  predimHint: string;
  procedure: { title: string; detail: string }[];
}

function assertNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} no puede ser negativa.`);
  }
}

export function calculateCombinations(
  inputs: CombinationInputs,
): CombinationResult {
  assertNonNegative(inputs.deadLoadKnM2, "La carga muerta D");
  assertNonNegative(inputs.liveLoadKnM2, "La carga viva L");
  if (inputs.deadLoadKnM2 === 0 && inputs.liveLoadKnM2 === 0) {
    throw new Error("Ingresa al menos una carga D o L mayor que cero.");
  }
  if (inputs.tributaryWidthM !== undefined) {
    if (!Number.isFinite(inputs.tributaryWidthM) || inputs.tributaryWidthM <= 0) {
      throw new Error("El ancho tributario debe ser mayor que cero.");
    }
  }

  const D = inputs.deadLoadKnM2;
  const L = inputs.liveLoadKnM2;

  const cases: CombinationCase[] = [
    {
      id: "1.4D",
      label: "1.4 D",
      valueKnM2: 1.4 * D,
      formula: `1.4 × ${formatNumber(D, 3)} = ${formatNumber(1.4 * D, 3)} kN/m²`,
    },
    {
      id: "1.2D+1.6L",
      label: "1.2 D + 1.6 L",
      valueKnM2: 1.2 * D + 1.6 * L,
      formula: `1.2 × ${formatNumber(D, 3)} + 1.6 × ${formatNumber(L, 3)} = ${formatNumber(1.2 * D + 1.6 * L, 3)} kN/m²`,
    },
  ];

  const governing = cases.reduce((best, current) =>
    current.valueKnM2 > best.valueKnM2 ? current : best,
  );

  const serviceLoadKnM2 = D + L;
  const designLoadKnM =
    inputs.tributaryWidthM !== undefined
      ? governing.valueKnM2 * inputs.tributaryWidthM
      : null;

  return {
    kind: "combinations",
    inputs,
    cases,
    governing,
    serviceLoadKnM2,
    designLoadKnM,
    summary: `Gobierna ${governing.label}: q_u = ${formatNumber(governing.valueKnM2, 2)} kN/m²`,
    predimHint:
      designLoadKnM !== null
        ? "Usa q_u en Losas o w en Vigas (PreDim). Para columnas, usa q = D+L de servicio."
        : "Pega q_u en PreDim → Losa, o pásala a Tributarias para obtener w de viga.",
    procedure: [
      {
        title: "1. Cargas de servicio",
        detail: `D = ${formatNumber(D, 3)} kN/m²; L = ${formatNumber(L, 3)} kN/m²; qservicio = D + L = ${formatNumber(serviceLoadKnM2, 3)} kN/m².`,
      },
      {
        title: "2. Combinaciones gravitacionales",
        detail: cases.map((item) => item.formula).join(" · "),
      },
      {
        title: "3. Caso gobernante",
        detail: `Se adopta el mayor: ${governing.label} → q_u = ${formatNumber(governing.valueKnM2, 3)} kN/m².${
          designLoadKnM !== null && inputs.tributaryWidthM !== undefined
            ? ` Con bt = ${formatNumber(inputs.tributaryWidthM, 2)} m → w = q_u · bt = ${formatNumber(designLoadKnM, 3)} kN/m.`
            : ""
        }`,
      },
    ],
  };
}
