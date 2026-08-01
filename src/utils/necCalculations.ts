export type ElementType = "beam" | "column" | "slab";
export type ComplianceStatus = "pass" | "fail" | "not-evaluated";

export interface ComplianceCriterion {
  criterion: string;
  calculated: string;
  limit: string;
  status: ComplianceStatus;
}

export interface CalculationStep {
  title: string;
  detail: string;
  reference?: string;
}

export type BeamSupportType =
  | "Simplemente apoyada"
  | "Un extremo continuo"
  | "Ambos extremos continuos"
  | "Voladizo";

export interface BeamInputs {
  spanM: number;
  supportType: BeamSupportType;
  designLoadKnM: number;
  steelYieldMpa: number;
  coverCm: number;
}

export interface BeamResult {
  kind: "beam";
  inputs: BeamInputs;
  widthCm: number;
  depthCm: number;
  inertiaCm4: number;
  selfWeightKnM: number;
  supportDivisor: number;
  minimumDepthCm: number;
  effectiveDepthCm: number;
  estimatedSteelAreaCm2: number;
  ultimateMomentKnM: number;
  designResistanceKnM: number;
  capacityAdjusted: boolean;
  minimumApplied: boolean;
  compliance: ComplianceCriterion[];
  procedure: CalculationStep[];
}

export type ColumnType = "Central" | "Perimetral" | "Esquina";

export interface ColumnInputs {
  tributaryAreaM2: number;
  floors: number;
  columnType: ColumnType;
  serviceLoadKnM2: number;
  clearHeightM: number;
  effectiveLengthFactor: number;
  longitudinalSteelCm2: number;
}

export interface ColumnResult {
  kind: "column";
  inputs: ColumnInputs;
  serviceLoadKn: number;
  appliedServiceLoadKnM2: number;
  positionFactor: number;
  areaReductionFactor: number;
  requiredAreaCm2: number;
  sideCm: number;
  grossAreaCm2: number;
  slenderness: number;
  steelRatio: number;
  minimumApplied: boolean;
  concreteStrengthMpa: number;
  compliance: ComplianceCriterion[];
  procedure: CalculationStep[];
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
  procedure: CalculationStep[];
}

export type CalculationResult = BeamResult | ColumnResult | SlabResult;

const CONCRETE_UNIT_WEIGHT_KN_M3 = 24;
const CONCRETE_STRENGTH_MPA = 21;
const PRELIMINARY_STEEL_RATIO = 0.01;
const FLEXURE_PHI = 0.9;
const DEFAULT_SERVICE_LOAD_KN_M2 = 8;

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
  assertPositive(inputs.designLoadKnM, "La carga de diseño");
  assertPositive(inputs.steelYieldMpa, "El esfuerzo de fluencia fy");
  assertPositive(inputs.coverCm, "El recubrimiento");

  const supportDivisors: Record<BeamSupportType, number> = {
    "Simplemente apoyada": 16,
    "Un extremo continuo": 18.5,
    "Ambos extremos continuos": 21,
    Voladizo: 8,
  };
  const supportDivisor = supportDivisors[inputs.supportType];
  const minimumDepthCm = (inputs.spanM * 100) / supportDivisor;
  let depthCm = roundUpToFive(minimumDepthCm);
  const initialRoundedDepthCm = depthCm;
  const ultimateMomentKnM =
    (inputs.designLoadKnM * inputs.spanM ** 2) / 10;
  let widthCm = 0;
  let calculatedWidthCm = 0;
  let effectiveDepthCm = 0;
  let estimatedSteelAreaCm2 = 0;
  let designResistanceKnM = 0;

  for (let iteration = 0; iteration < 100; iteration += 1) {
    calculatedWidthCm = depthCm / 2;
    widthCm = Math.max(25, calculatedWidthCm);
    effectiveDepthCm = depthCm - inputs.coverCm;

    if (effectiveDepthCm <= 0) {
      throw new Error("El recubrimiento debe ser menor que el peralte.");
    }

    const widthMm = widthCm * 10;
    const effectiveDepthMm = effectiveDepthCm * 10;
    const estimatedSteelAreaMm2 =
      PRELIMINARY_STEEL_RATIO * widthMm * effectiveDepthMm;
    const compressionBlockDepthMm =
      (estimatedSteelAreaMm2 * inputs.steelYieldMpa) /
      (0.85 * CONCRETE_STRENGTH_MPA * widthMm);
    const nominalMomentNmm =
      estimatedSteelAreaMm2 *
      inputs.steelYieldMpa *
      (effectiveDepthMm - compressionBlockDepthMm / 2);

    estimatedSteelAreaCm2 = estimatedSteelAreaMm2 / 100;
    designResistanceKnM = (FLEXURE_PHI * nominalMomentNmm) / 1_000_000;

    if (designResistanceKnM >= ultimateMomentKnM) {
      break;
    }

    depthCm += 5;

    if (iteration === 99) {
      throw new Error("No fue posible encontrar una sección preliminar estable.");
    }
  }

  const minimumApplied = calculatedWidthCm < 25;
  const capacityAdjusted = depthCm > initialRoundedDepthCm;
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
    supportDivisor,
    minimumDepthCm,
    effectiveDepthCm,
    estimatedSteelAreaCm2,
    ultimateMomentKnM,
    designResistanceKnM,
    capacityAdjusted,
    minimumApplied,
    compliance: [
      {
        criterion: "Peralte mínimo por apoyo",
        calculated: `L/${spanDepthRatio.toFixed(1)}`,
        limit: `≤ L/${supportDivisor}`,
        status: spanDepthRatio <= supportDivisor ? "pass" : "fail",
      },
      {
        criterion: "Ancho mínimo",
        calculated: `${formatNumber(widthCm)} cm`,
        limit: "≥ 25 cm",
        status: widthCm >= 25 ? "pass" : "fail",
      },
      {
        criterion: "Capacidad flexional aproximada",
        calculated: `φMn = ${formatNumber(designResistanceKnM, 1)} kN·m`,
        limit: `≥ Mu = ${formatNumber(ultimateMomentKnM, 1)} kN·m`,
        status: designResistanceKnM >= ultimateMomentKnM ? "pass" : "fail",
      },
    ],
    procedure: [
      {
        title: "1. Criterio de apoyo",
        detail: `${inputs.supportType}: se adopta h mínimo = L/${supportDivisor}.`,
        reference:
          "NEC-SE-HM 4.2.1 remite al control de deflexiones de ACI 318; ACI 318-14 §9.5, Tabla 9.5(a).",
      },
      {
        title: "2. Fórmula y conversión",
        detail: `h mínimo = ${formatNumber(inputs.spanM, 2)} m × 100 / ${supportDivisor} = ${formatNumber(minimumDepthCm, 2)} cm.`,
      },
      {
        title: "3. Redondeo constructivo",
        detail: `El peralte se redondea al múltiplo superior de 5 cm: ${formatNumber(initialRoundedDepthCm)} cm.${capacityAdjusted ? ` La revisión flexional exigió incrementarlo hasta ${formatNumber(depthCm)} cm.` : ""}`,
      },
      {
        title: "4. Dimensión mínima",
        detail: `b = h/2 = ${formatNumber(calculatedWidthCm)} cm; sección adoptada ${formatNumber(widthCm)} × ${formatNumber(depthCm)} cm${minimumApplied ? ", aplicando b mínimo de 25 cm" : ""}.`,
        reference: "NEC-SE-HM §4.2.1: ancho mínimo de elementos a flexión de 250 mm.",
      },
      {
        title: "5. Demanda y capacidad aproximada",
        detail: `Mu ≈ wL²/10 = ${formatNumber(inputs.designLoadKnM, 2)} × ${formatNumber(inputs.spanM, 2)}² / 10 = ${formatNumber(ultimateMomentKnM, 2)} kN·m. Con d = h − ${formatNumber(inputs.coverCm)} = ${formatNumber(effectiveDepthCm)} cm y As ≈ 0.01bd = ${formatNumber(estimatedSteelAreaCm2, 2)} cm², se obtiene φMn ≈ ${formatNumber(designResistanceKnM, 2)} kN·m ≥ Mu.`,
        reference:
          "Verificación preliminar: ρ = 1%, fy configurable (420 MPa por defecto), recubrimiento 4 cm y φ = 0.90. No reemplaza el diseño del refuerzo.",
      },
    ],
  };
}

export function calculateColumn(inputs: ColumnInputs): ColumnResult {
  assertPositive(inputs.tributaryAreaM2, "El área tributaria");
  assertPositive(inputs.floors, "El número de pisos");
  assertPositive(inputs.clearHeightM, "La longitud libre");
  assertPositive(inputs.effectiveLengthFactor, "El factor de longitud efectiva");
  assertPositive(inputs.longitudinalSteelCm2, "El área de acero longitudinal");

  const appliedServiceLoadKnM2 =
    Number.isFinite(inputs.serviceLoadKnM2) && inputs.serviceLoadKnM2 > 0
      ? inputs.serviceLoadKnM2
      : DEFAULT_SERVICE_LOAD_KN_M2;
  const positionFactors: Record<
    ColumnType,
    { load: number; area: number; description: string }
  > = {
    Central: { load: 1.1, area: 0.45, description: "carga centrada" },
    Perimetral: {
      load: 1.2,
      area: 0.4,
      description: "excentricidad media",
    },
    Esquina: {
      load: 1.25,
      area: 0.35,
      description: "mayor excentricidad",
    },
  };
  const position = positionFactors[inputs.columnType];
  const positionFactor = position.load;
  const areaReductionFactor = position.area;
  const serviceLoadKn =
    positionFactor *
    appliedServiceLoadKnM2 *
    inputs.tributaryAreaM2 *
    inputs.floors;
  // P[kN] × 1000 / f'c[N/mm²] gives mm²; divide by 100 for cm².
  const requiredAreaCm2 =
    (serviceLoadKn * 10) /
    (areaReductionFactor * CONCRETE_STRENGTH_MPA);
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
    appliedServiceLoadKnM2,
    positionFactor,
    areaReductionFactor,
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
    procedure: [
      {
        title: "1. Criterio de posición",
        detail: `Columna ${inputs.columnType.toLowerCase()}: ${position.description}; factor de carga ${formatNumber(positionFactor, 2)} y factor de área ${formatNumber(areaReductionFactor, 2)}.`,
        reference:
          "Factores de predimensionamiento adoptados para estimar el efecto de posición; deben validarse con las combinaciones NEC-SE-CG y el análisis estructural.",
      },
      {
        title: "2. Estimación de carga",
        detail: `P = ${formatNumber(positionFactor, 2)} × ${formatNumber(appliedServiceLoadKnM2, 2)} kN/m² × ${formatNumber(inputs.tributaryAreaM2, 2)} m² × ${inputs.floors} = ${formatNumber(serviceLoadKn, 2)} kN.${inputs.serviceLoadKnM2 <= 0 ? " Se aplicó q = 8.0 kN/m² por defecto." : ""}`,
      },
      {
        title: "3. Área requerida y conversión",
        detail: `Ag = P / (${formatNumber(areaReductionFactor, 2)} f'c). Con f'c = ${CONCRETE_STRENGTH_MPA} MPa: Ag = ${formatNumber(requiredAreaCm2, 2)} cm² y lado teórico = √Ag = ${formatNumber(calculatedSideCm, 2)} cm.`,
      },
      {
        title: "4. Redondeo constructivo",
        detail: `El lado se redondea al múltiplo superior de 5 cm: ${formatNumber(roundUpToFive(calculatedSideCm))} cm.`,
      },
      {
        title: "5. Límite mínimo NEC",
        detail: `Se adopta ${formatNumber(sideCm)} × ${formatNumber(sideCm)} cm${minimumApplied ? " porque el valor teórico era menor que 30 cm" : ", que supera el mínimo de 30 cm"}.`,
        reference:
          "NEC-SE-HM §4.3.1: dimensión transversal mínima de 300 mm para elementos en flexocompresión del sistema sismorresistente.",
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
    procedure: [
      {
        title: "1. Tipo de losa",
        detail:
          inputs.slabType === "solid"
            ? "Losa maciza: se adopta la relación preliminar L/25."
            : "Losa aligerada o nervada: se adopta la relación preliminar L/21.",
      },
      {
        title: "2. Fórmula y conversión",
        detail: `h = ${formatNumber(inputs.spanM, 2)} m × 100 / ${divisor} = ${formatNumber(thicknessCm, 2)} cm.`,
        reference:
          "Criterio de predimensionamiento; verificar deflexiones y diseño final conforme a NEC-SE-HM.",
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
