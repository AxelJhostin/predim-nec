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
  concreteStrengthMpa: number;
  stirrupDiameterMm: number;
}

export interface BeamResult {
  kind: "beam";
  inputs: BeamInputs;
  widthCm: number;
  depthCm: number;
  inertiaCm4: number;
  selfWeightKnM: number;
  supportDivisor: number;
  momentDivisor: number;
  shearCoefficient: number;
  minimumDepthCm: number;
  effectiveDepthCm: number;
  /** @deprecated Usar requiredSteelAreaCm2; se mantiene por compatibilidad. */
  estimatedSteelAreaCm2: number;
  requiredSteelAreaCm2: number;
  providedSteelAreaCm2: number;
  steelRatio: number;
  minimumSteelRatio: number;
  maximumSteelRatio: number;
  flexuralBarProposal: string;
  ultimateMomentKnM: number;
  designResistanceKnM: number;
  ultimateShearKn: number;
  concreteShearKn: number;
  requiredShearSteelKn: number;
  stirrupProposal: string;
  stirrupSpacingCm: number;
  capacityAdjusted: boolean;
  minimumApplied: boolean;
  concreteStrengthMpa: number;
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
const FLEXURE_PHI = 0.9;
const SHEAR_PHI = 0.75;
const DEFAULT_SERVICE_LOAD_KN_M2 = 8;
const DEFAULT_BEAM_FC_MPA = 21;
const DEFAULT_STIRRUP_DIAMETER_MM = 10;
const BAR_DIAMETERS_MM = [12, 14, 16, 18, 20, 22, 25] as const;

function roundUpToFive(value: number) {
  return Math.ceil(value / 5) * 5;
}

function roundUpToHalf(value: number) {
  return Math.ceil(value * 2) / 2;
}

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} debe ser mayor que cero.`);
  }
}

function barAreaMm2(diameterMm: number) {
  return (Math.PI * diameterMm ** 2) / 4;
}

function beta1(fcMpa: number) {
  if (fcMpa <= 28) {
    return 0.85;
  }
  return Math.max(0.65, 0.85 - (0.05 * (fcMpa - 28)) / 7);
}

function flexuralCapacityKnM(
  asMm2: number,
  widthMm: number,
  depthMm: number,
  fyMpa: number,
  fcMpa: number,
) {
  const aMm = (asMm2 * fyMpa) / (0.85 * fcMpa * widthMm);
  const nominalMomentNmm = asMm2 * fyMpa * (depthMm - aMm / 2);
  return (FLEXURE_PHI * nominalMomentNmm) / 1_000_000;
}

function proposeFlexuralBars(requiredAsMm2: number, widthCm: number) {
  let best:
    | {
        count: number;
        diameterMm: number;
        areaMm2: number;
      }
    | undefined;

  for (const diameterMm of BAR_DIAMETERS_MM) {
    const oneBar = barAreaMm2(diameterMm);
    const count = Math.max(2, Math.ceil(requiredAsMm2 / oneBar));
    if (count > 6) {
      continue;
    }

    // Espacio libre aproximado con 4 cm de recubrimiento lateral y estribo Ø10.
    const clearWidthMm = widthCm * 10 - 2 * 40 - 2 * 10;
    const neededWidthMm = count * diameterMm + (count - 1) * Math.max(25, diameterMm);
    if (neededWidthMm > clearWidthMm) {
      continue;
    }

    const areaMm2 = count * oneBar;
    if (
      !best ||
      areaMm2 < best.areaMm2 ||
      (areaMm2 === best.areaMm2 && count < best.count)
    ) {
      best = { count, diameterMm, areaMm2 };
    }
  }

  if (!best) {
    const diameterMm = 20;
    const oneBar = barAreaMm2(diameterMm);
    const count = Math.max(2, Math.ceil(requiredAsMm2 / oneBar));
    best = { count, diameterMm, areaMm2: count * oneBar };
  }

  return {
    ...best,
    label: `${best.count} Ø${best.diameterMm} mm`,
  };
}

function beamDemandFactors(supportType: BeamSupportType) {
  switch (supportType) {
    case "Simplemente apoyada":
      return { momentDivisor: 8, shearCoefficient: 0.5, label: "wL²/8 y Vu = wL/2" };
    case "Un extremo continuo":
      return { momentDivisor: 10, shearCoefficient: 0.575, label: "wL²/10 y Vu ≈ 1.15 wL/2" };
    case "Ambos extremos continuos":
      return { momentDivisor: 11, shearCoefficient: 0.575, label: "wL²/11 y Vu ≈ 1.15 wL/2" };
    case "Voladizo":
      return { momentDivisor: 2, shearCoefficient: 1, label: "wL²/2 y Vu = wL" };
  }
}

export function calculateBeam(inputs: BeamInputs): BeamResult {
  assertPositive(inputs.spanM, "La luz");
  assertPositive(inputs.designLoadKnM, "La carga de diseño");
  assertPositive(inputs.steelYieldMpa, "El esfuerzo de fluencia fy");
  assertPositive(inputs.coverCm, "El recubrimiento");

  const fcMpa =
    Number.isFinite(inputs.concreteStrengthMpa) && inputs.concreteStrengthMpa > 0
      ? inputs.concreteStrengthMpa
      : DEFAULT_BEAM_FC_MPA;
  const stirrupDiameterMm =
    Number.isFinite(inputs.stirrupDiameterMm) && inputs.stirrupDiameterMm > 0
      ? inputs.stirrupDiameterMm
      : DEFAULT_STIRRUP_DIAMETER_MM;
  const normalizedInputs: BeamInputs = {
    ...inputs,
    concreteStrengthMpa: fcMpa,
    stirrupDiameterMm,
  };

  const supportDivisors: Record<BeamSupportType, number> = {
    "Simplemente apoyada": 16,
    "Un extremo continuo": 18.5,
    "Ambos extremos continuos": 21,
    Voladizo: 8,
  };
  const supportDivisor = supportDivisors[inputs.supportType];
  const { momentDivisor, shearCoefficient, label: demandLabel } =
    beamDemandFactors(inputs.supportType);
  const minimumDepthCm = (inputs.spanM * 100) / supportDivisor;
  let depthCm = roundUpToFive(minimumDepthCm);
  const initialRoundedDepthCm = depthCm;
  const ultimateMomentKnM =
    (inputs.designLoadKnM * inputs.spanM ** 2) / momentDivisor;
  const ultimateShearKn =
    shearCoefficient * inputs.designLoadKnM * inputs.spanM;

  let widthCm = 0;
  let calculatedWidthCm = 0;
  let effectiveDepthCm = 0;
  let requiredSteelAreaCm2 = 0;
  let providedSteelAreaCm2 = 0;
  let steelRatio = 0;
  let minimumSteelRatio = 0;
  let maximumSteelRatio = 0;
  let designResistanceKnM = 0;
  let flexuralBarProposal = "";
  let concreteShearKn = 0;
  let requiredShearSteelKn = 0;
  let stirrupSpacingCm = 0;
  let stirrupProposal = "";

  for (let iteration = 0; iteration < 100; iteration += 1) {
    calculatedWidthCm = depthCm / 2;
    widthCm = Math.max(25, calculatedWidthCm);
    effectiveDepthCm = depthCm - inputs.coverCm;

    if (effectiveDepthCm <= 0) {
      throw new Error("El recubrimiento debe ser menor que el peralte.");
    }

    const widthMm = widthCm * 10;
    const depthMm = effectiveDepthCm * 10;
    const fy = inputs.steelYieldMpa;
    const beta = beta1(fcMpa);

    // Ru en MPa (= N/mm²) con Mu en N·mm.
    const muNmm = ultimateMomentKnM * 1_000_000;
    const ru = muNmm / (FLEXURE_PHI * widthMm * depthMm ** 2);
    const root = 1 - (2 * ru) / (0.85 * fcMpa);
    if (root <= 0) {
      depthCm += 5;
      continue;
    }

    const rhoRequired = ((0.85 * fcMpa) / fy) * (1 - Math.sqrt(root));
    minimumSteelRatio = Math.max(1.4 / fy, (0.25 * Math.sqrt(fcMpa)) / fy);
    const cMaxMm = (3 / 8) * depthMm;
    const aMaxMm = beta * cMaxMm;
    maximumSteelRatio = (0.85 * fcMpa * aMaxMm) / (fy * depthMm);

    if (rhoRequired > maximumSteelRatio) {
      depthCm += 5;
      continue;
    }

    const rhoDesign = Math.max(rhoRequired, minimumSteelRatio);
    const requiredAsMm2 = rhoDesign * widthMm * depthMm;
    const bars = proposeFlexuralBars(requiredAsMm2, widthCm);
    const providedAsMm2 = bars.areaMm2;
    const phiMn = flexuralCapacityKnM(providedAsMm2, widthMm, depthMm, fy, fcMpa);

    // Corte: Vc = 0.17 λ √f'c b d  (ACI 318), λ = 1.
    const vcN = 0.17 * Math.sqrt(fcMpa) * widthMm * depthMm;
    concreteShearKn = vcN / 1000;
    const phiVc = SHEAR_PHI * concreteShearKn;
    const vu = ultimateShearKn;
    const maxPhiVn = SHEAR_PHI * (concreteShearKn + (0.66 * Math.sqrt(fcMpa) * widthMm * depthMm) / 1000);

    if (vu > maxPhiVn) {
      depthCm += 5;
      continue;
    }

    requiredShearSteelKn = Math.max(0, vu / SHEAR_PHI - concreteShearKn);
    const avMm2 = 2 * barAreaMm2(stirrupDiameterMm);
    const minAvOverS = Math.max(
      (0.062 * Math.sqrt(fcMpa) * widthMm) / fy,
      (0.35 * widthMm) / fy,
    );

    let spacingMm: number;
    if (vu <= phiVc / 2) {
      spacingMm = Math.min(depthMm / 2, 600);
      stirrupProposal = `Estribos Ø${stirrupDiameterMm} mm @ ${formatNumber(spacingMm / 10)} cm (mínimos / constructivos)`;
      requiredShearSteelKn = 0;
    } else if (requiredShearSteelKn <= 0.001) {
      spacingMm = Math.min(avMm2 / minAvOverS, depthMm / 2, 600);
      stirrupProposal = `Estribos Ø${stirrupDiameterMm} mm a dos ramas @ ${formatNumber(spacingMm / 10)} cm (mínimos ACI)`;
    } else {
      const spacingByStrengthMm = (avMm2 * fy * depthMm) / (requiredShearSteelKn * 1000);
      const vsLimitHigh = (0.33 * Math.sqrt(fcMpa) * widthMm * depthMm) / 1000;
      const spacingMaxMm =
        requiredShearSteelKn > vsLimitHigh
          ? Math.min(depthMm / 4, 300)
          : Math.min(depthMm / 2, 600);
      spacingMm = Math.min(spacingByStrengthMm, avMm2 / minAvOverS, spacingMaxMm);
      stirrupProposal = `Estribos Ø${stirrupDiameterMm} mm a dos ramas @ ${formatNumber(spacingMm / 10)} cm`;
    }

    stirrupSpacingCm = roundUpToHalf(Math.max(5, spacingMm / 10));
    // Reexpresar propuesta con espaciamiento redondeado constructivo (al 0.5 cm inferior seguro).
    const spaced = Math.floor(stirrupSpacingCm * 2) / 2;
    stirrupSpacingCm = spaced;
    stirrupProposal =
      vu <= phiVc / 2
        ? `Estribos Ø${stirrupDiameterMm} mm @ ${formatNumber(stirrupSpacingCm)} cm (mínimos / constructivos)`
        : `Estribos Ø${stirrupDiameterMm} mm a dos ramas @ ${formatNumber(stirrupSpacingCm)} cm`;

    requiredSteelAreaCm2 = requiredAsMm2 / 100;
    providedSteelAreaCm2 = providedAsMm2 / 100;
    steelRatio = providedAsMm2 / (widthMm * depthMm);
    designResistanceKnM = phiMn;
    flexuralBarProposal = bars.label;

    if (phiMn >= ultimateMomentKnM) {
      break;
    }

    depthCm += 5;

    if (iteration === 99) {
      throw new Error("No fue posible encontrar una sección estable a flexión y corte.");
    }
  }

  const minimumApplied = calculatedWidthCm < 25;
  const capacityAdjusted = depthCm > initialRoundedDepthCm;
  const inertiaCm4 = (widthCm * depthCm ** 3) / 12;
  const selfWeightKnM =
    (widthCm / 100) * (depthCm / 100) * CONCRETE_UNIT_WEIGHT_KN_M3;
  const spanDepthRatio = (inputs.spanM * 100) / depthCm;
  const phiVc = SHEAR_PHI * concreteShearKn;

  return {
    kind: "beam",
    inputs: normalizedInputs,
    widthCm,
    depthCm,
    inertiaCm4,
    selfWeightKnM,
    supportDivisor,
    momentDivisor,
    shearCoefficient,
    minimumDepthCm,
    effectiveDepthCm,
    estimatedSteelAreaCm2: requiredSteelAreaCm2,
    requiredSteelAreaCm2,
    providedSteelAreaCm2,
    steelRatio,
    minimumSteelRatio,
    maximumSteelRatio,
    flexuralBarProposal,
    ultimateMomentKnM,
    designResistanceKnM,
    ultimateShearKn,
    concreteShearKn,
    requiredShearSteelKn,
    stirrupProposal,
    stirrupSpacingCm,
    capacityAdjusted,
    minimumApplied,
    concreteStrengthMpa: fcMpa,
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
        criterion: "Flexión φMn ≥ Mu",
        calculated: `φMn = ${formatNumber(designResistanceKnM, 1)} kN·m`,
        limit: `≥ Mu = ${formatNumber(ultimateMomentKnM, 1)} kN·m`,
        status: designResistanceKnM >= ultimateMomentKnM ? "pass" : "fail",
      },
      {
        criterion: "Cuantía de flexión",
        calculated: `ρ = ${(steelRatio * 100).toFixed(3)}%`,
        limit: `${(minimumSteelRatio * 100).toFixed(3)}% – ${(maximumSteelRatio * 100).toFixed(3)}%`,
        status:
          steelRatio >= minimumSteelRatio && steelRatio <= maximumSteelRatio
            ? "pass"
            : "fail",
      },
      {
        criterion: "Corte φVc y estribos",
        calculated: `Vu = ${formatNumber(ultimateShearKn, 1)} kN`,
        limit: `φVc = ${formatNumber(phiVc, 1)} kN · ${stirrupProposal}`,
        status: ultimateShearKn <= SHEAR_PHI * (concreteShearKn + (0.66 * Math.sqrt(fcMpa) * widthCm * 10 * effectiveDepthCm * 10) / 1000)
          ? "pass"
          : "fail",
      },
    ],
    procedure: [
      {
        title: "1. Criterio de apoyo y peralte",
        detail: `${inputs.supportType}: h mínimo = L/${supportDivisor} = ${formatNumber(minimumDepthCm, 2)} cm; se redondea a ${formatNumber(initialRoundedDepthCm)} cm.`,
        reference:
          "NEC-SE-HM 4.2.1 remite al control de deflexiones de ACI 318; ACI 318-14 §9.5, Tabla 9.5(a).",
      },
      {
        title: "2. Demandas Mu y Vu",
        detail: `Con w = ${formatNumber(inputs.designLoadKnM, 2)} kN/m se adopta ${demandLabel}: Mu = ${formatNumber(ultimateMomentKnM, 2)} kN·m y Vu = ${formatNumber(ultimateShearKn, 2)} kN.`,
        reference:
          "Coeficientes de análisis aproximado para carga uniforme; validar con modelo estructural y combinaciones NEC-SE-CG.",
      },
      {
        title: "3. Sección adoptada",
        detail: `b = h/2 → ${formatNumber(calculatedWidthCm)} cm; sección ${formatNumber(widthCm)} × ${formatNumber(depthCm)} cm${minimumApplied ? " (b mínimo 25 cm)" : ""}${capacityAdjusted ? `; h incrementado por flexión/corte desde ${formatNumber(initialRoundedDepthCm)} cm` : ""}. d = h − recubrimiento = ${formatNumber(effectiveDepthCm)} cm.`,
        reference: "NEC-SE-HM §4.2.1: ancho mínimo de elementos a flexión de 250 mm.",
      },
      {
        title: "4. Diseño a flexión",
        detail: `Con f'c = ${formatNumber(fcMpa)} MPa y fy = ${formatNumber(inputs.steelYieldMpa)} MPa: As requerido = ${formatNumber(requiredSteelAreaCm2, 2)} cm² (ρmin = ${(minimumSteelRatio * 100).toFixed(3)}%, ρmáx tension-controlled ≈ ${(maximumSteelRatio * 100).toFixed(3)}%). Se propone ${flexuralBarProposal} (As = ${formatNumber(providedSteelAreaCm2, 2)} cm²) con φMn = ${formatNumber(designResistanceKnM, 2)} kN·m ≥ Mu.`,
        reference: "ACI 318 (adoptado por NEC-SE-HM): secciones controladas por tracción, φ = 0.90.",
      },
      {
        title: "5. Diseño a corte",
        detail: `Vc = 0.17√f'c b d = ${formatNumber(concreteShearKn, 2)} kN; φVc = ${formatNumber(phiVc, 2)} kN. Vs requerido = ${formatNumber(requiredShearSteelKn, 2)} kN. ${stirrupProposal}.`,
        reference: "ACI 318 §22.5 / NEC-SE-HM: φ = 0.75 para cortante; estribos mínimos y espaciamiento máximo según Vs.",
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
