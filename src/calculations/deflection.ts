import { assertPositive, DEFAULT_FC_MPA, formatNumber } from "./shared";

export type DeflectionSupport =
  | "simple"
  | "one-continuous"
  | "both-continuous"
  | "cantilever";

export interface DeflectionInputs {
  spanM: number;
  designLoadKnM: number;
  widthCm: number;
  depthCm: number;
  supportType: DeflectionSupport;
  concreteStrengthMpa: number;
  /** Límite L/n; por defecto 240. */
  limitRatio?: number;
}

export interface DeflectionResult {
  kind: "deflection";
  inputs: DeflectionInputs;
  modulusGpa: number;
  inertiaCm4: number;
  coefficient: number;
  coefficientLabel: string;
  deflectionMm: number;
  limitMm: number;
  limitRatio: number;
  utilization: number;
  summary: string;
  ok: boolean;
  procedure: { title: string; detail: string }[];
}

const SUPPORT_COEFFICIENTS: Record<
  DeflectionSupport,
  { k: number; label: string }
> = {
  simple: { k: 5 / 384, label: "5/384 (simplemente apoyada)" },
  "one-continuous": { k: 1 / 185, label: "≈1/185 (un extremo continuo)" },
  "both-continuous": { k: 1 / 384, label: "1/384 (ambos extremos continuos)" },
  cantilever: { k: 1 / 8, label: "1/8 (voladizo)" },
};

export function calculateDeflection(inputs: DeflectionInputs): DeflectionResult {
  assertPositive(inputs.spanM, "La luz L");
  assertPositive(inputs.designLoadKnM, "La carga w");
  assertPositive(inputs.widthCm, "El ancho b");
  assertPositive(inputs.depthCm, "El peralte h");

  const fcMpa =
    Number.isFinite(inputs.concreteStrengthMpa) && inputs.concreteStrengthMpa > 0
      ? inputs.concreteStrengthMpa
      : DEFAULT_FC_MPA;
  const limitRatio =
    Number.isFinite(inputs.limitRatio) &&
    inputs.limitRatio !== undefined &&
    inputs.limitRatio > 0
      ? inputs.limitRatio
      : 240;

  const { k, label } = SUPPORT_COEFFICIENTS[inputs.supportType];
  // Ec = 4700 √f'c (MPa) → GPa
  const modulusGpa = (4700 * Math.sqrt(fcMpa)) / 1000;
  const inertiaCm4 = (inputs.widthCm * inputs.depthCm ** 3) / 12;

  // δ = k w L⁴ / (E I)
  // w in kN/m = N/mm; convert consistently to mm:
  // E in N/mm² = modulusGpa * 1000
  // I in mm⁴ = inertiaCm4 * 10000
  // L in mm
  // w in N/mm = designLoadKnM (kN/m = N/mm)
  const E_Nmm2 = modulusGpa * 1000;
  const I_mm4 = inertiaCm4 * 10_000;
  const L_mm = inputs.spanM * 1000;
  const w_Nmm = inputs.designLoadKnM;
  const deflectionMm =
    (k * w_Nmm * L_mm ** 4) / (E_Nmm2 * I_mm4);
  const limitMm = L_mm / limitRatio;
  const utilization = deflectionMm / limitMm;

  return {
    kind: "deflection",
    inputs: {
      ...inputs,
      concreteStrengthMpa: fcMpa,
      limitRatio,
    },
    modulusGpa,
    inertiaCm4,
    coefficient: k,
    coefficientLabel: label,
    deflectionMm,
    limitMm,
    limitRatio,
    utilization,
    summary: `δ ≈ ${formatNumber(deflectionMm, 2)} mm (límite L/${formatNumber(limitRatio)} = ${formatNumber(limitMm, 2)} mm)`,
    ok: deflectionMm <= limitMm * 1.001,
    procedure: [
      {
        title: "1. Rigidez elástica bruta",
        detail: `Ec = 4700√f'c = ${formatNumber(modulusGpa * 1000, 0)} MPa (${formatNumber(modulusGpa, 2)} GPa). I = b·h³/12 = ${formatNumber(inertiaCm4, 0)} cm⁴ (sección bruta, sin fisuración).`,
      },
      {
        title: "2. Coeficiente por apoyo",
        detail: `Caso ${label}. δ = k·w·L⁴/(E·I).`,
      },
      {
        title: "3. Deflexión y límite",
        detail: `δ ≈ ${formatNumber(deflectionMm, 2)} mm. Límite L/${formatNumber(limitRatio)} = ${formatNumber(limitMm, 2)} mm. Utilización = ${formatNumber(utilization * 100, 1)}%.`,
      },
      {
        title: "4. Alcance",
        detail:
          "Estimación elástica de anteproyecto. No incluye fisuración, fluencia ni sobrecarga sostenida (multiplicadores de larga duración).",
      },
    ],
  };
}
