export type ElementType = "beam" | "column" | "slab";
export type ComplianceStatus = "pass" | "fail" | "not-evaluated";

export interface ComplianceCriterion {
  criterion: string;
  calculated: string;
  limit: string;
  status: ComplianceStatus;
}

export interface BeamInputs {
  spanM: number;
  supportType: string;
  designLoadKnM2: number;
}

export interface BeamResult {
  kind: "beam";
  inputs: BeamInputs;
  widthCm: number;
  depthCm: number;
  inertiaCm4: number;
  selfWeightKnM: number;
  minimumApplied: boolean;
  compliance: ComplianceCriterion[];
}

export interface ColumnInputs {
  tributaryAreaM2: number;
  floors: number;
  columnType: string;
  serviceLoadKnM2: number;
  clearHeightM: number;
  effectiveLengthFactor: number;
  longitudinalSteelCm2: number;
}

export interface ColumnResult {
  kind: "column";
  inputs: ColumnInputs;
  serviceLoadKn: number;
  requiredAreaCm2: number;
  sideCm: number;
  grossAreaCm2: number;
  slenderness: number;
  steelRatio: number;
  minimumApplied: boolean;
  concreteStrengthMpa: number;
  compliance: ComplianceCriterion[];
}

export interface SlabInputs {
  spanM: number;
  slabType: "solid" | "ribbed";
}

export interface SlabResult {
  kind: "slab";
  inputs: SlabInputs;
  thicknessCm: number;
  divisor: number;
  compliance: ComplianceCriterion[];
}

export type CalculationResult = BeamResult | ColumnResult | SlabResult;

const CONCRETE_UNIT_WEIGHT_KN_M3 = 24;
const CONCRETE_STRENGTH_MPA = 21;

function roundUpToFive(value: number) {
  return Math.ceil(value / 5) * 5;
}

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} debe ser mayor que cero.`);
  }
}

export function calculateBeam(inputs: BeamInputs): BeamResult {
  assertPositive(inputs.spanM, "La luz");
  assertPositive(inputs.designLoadKnM2, "La carga de diseño");

  const depthCm = roundUpToFive((inputs.spanM * 100) / 12);
  const calculatedWidthCm = depthCm / 2;
  const widthCm = Math.max(25, calculatedWidthCm);
  const minimumApplied = calculatedWidthCm < 25;
  const inertiaCm4 = (widthCm * depthCm ** 3) / 12;
  const selfWeightKnM =
    (widthCm / 100) *
    (depthCm / 100) *
    CONCRETE_UNIT_WEIGHT_KN_M3;
  const spanDepthRatio = (inputs.spanM * 100) / depthCm;

  return {
    kind: "beam",
    inputs,
    widthCm,
    depthCm,
    inertiaCm4,
    selfWeightKnM,
    minimumApplied,
    compliance: [
      {
        criterion: "Relación luz/peralte",
        calculated: spanDepthRatio.toFixed(2),
        limit: "≤ 12",
        status: spanDepthRatio <= 12 ? "pass" : "fail",
      },
      {
        criterion: "Ancho mínimo",
        calculated: `${formatNumber(widthCm)} cm`,
        limit: "≥ 25 cm",
        status: widthCm >= 25 ? "pass" : "fail",
      },
      {
        criterion: "Cuantía de acero",
        calculated: "Requiere diseño",
        limit: "NEC-SE-HM",
        status: "not-evaluated",
      },
    ],
  };
}

export function calculateColumn(inputs: ColumnInputs): ColumnResult {
  assertPositive(inputs.tributaryAreaM2, "El área tributaria");
  assertPositive(inputs.floors, "El número de pisos");
  assertPositive(inputs.serviceLoadKnM2, "La carga de servicio");
  assertPositive(inputs.clearHeightM, "La longitud libre");
  assertPositive(inputs.effectiveLengthFactor, "El factor de longitud efectiva");
  assertPositive(inputs.longitudinalSteelCm2, "El área de acero longitudinal");

  const serviceLoadKn =
    inputs.tributaryAreaM2 * inputs.floors * inputs.serviceLoadKnM2;
  // P[kN] × 1000 / f'c[N/mm²] gives mm²; divide by 100 for cm².
  const requiredAreaCm2 =
    (serviceLoadKn * 10) / (0.45 * CONCRETE_STRENGTH_MPA);
  const calculatedSideCm = Math.sqrt(requiredAreaCm2);
  const sideCm = Math.max(30, roundUpToFive(calculatedSideCm));
  const grossAreaCm2 = sideCm ** 2;
  const radiusOfGyrationCm = sideCm / Math.sqrt(12);
  const slenderness =
    (inputs.effectiveLengthFactor * inputs.clearHeightM * 100) /
    radiusOfGyrationCm;
  const steelRatio = inputs.longitudinalSteelCm2 / grossAreaCm2;
  const minimumApplied = calculatedSideCm < 30;

  return {
    kind: "column",
    inputs,
    serviceLoadKn,
    requiredAreaCm2,
    sideCm,
    grossAreaCm2,
    slenderness,
    steelRatio,
    minimumApplied,
    concreteStrengthMpa: CONCRETE_STRENGTH_MPA,
    compliance: [
      {
        criterion: "Relación de esbeltez λ",
        calculated: slenderness.toFixed(1),
        limit: "< 40",
        status: slenderness < 40 ? "pass" : "fail",
      },
      {
        criterion: "Dimensión mínima",
        calculated: `${formatNumber(sideCm)} cm`,
        limit: "≥ 30 cm",
        status: sideCm >= 30 ? "pass" : "fail",
      },
      {
        criterion: "Cuantía longitudinal ρ",
        calculated: `${(steelRatio * 100).toFixed(2)}%`,
        limit: "1% – 3%",
        status:
          steelRatio >= 0.01 && steelRatio <= 0.03 ? "pass" : "fail",
      },
      {
        criterion: "Relación de aspecto b/h",
        calculated: "1.00",
        limit: "> 0.40",
        status: "pass",
      },
    ],
  };
}

export function calculateSlab(inputs: SlabInputs): SlabResult {
  assertPositive(inputs.spanM, "La luz");

  const divisor = inputs.slabType === "solid" ? 25 : 21;
  const thicknessCm = (inputs.spanM * 100) / divisor;

  return {
    kind: "slab",
    inputs,
    thicknessCm,
    divisor,
    compliance: [
      {
        criterion: "Relación luz/peralte",
        calculated: divisor.toString(),
        limit: inputs.slabType === "solid" ? "L/25" : "L/21",
        status: "pass",
      },
      {
        criterion: "Espesor mínimo",
        calculated: `${formatNumber(thicknessCm)} cm`,
        limit: "Según relación adoptada",
        status: "pass",
      },
      {
        criterion: "Cuantía de acero",
        calculated: "Requiere diseño",
        limit: "NEC-SE-HM",
        status: "not-evaluated",
      },
    ],
  };
}

export function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("es-EC", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}
