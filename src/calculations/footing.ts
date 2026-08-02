import type { ComplianceCriterion, CalculationStep } from "./types";
import {
  BAR_DIAMETERS_MM,
  DEFAULT_FC_MPA,
  FLEXURE_PHI,
  SHEAR_PHI,
  assertPositive,
  barAreaMm2,
  formatNumber,
  roundUpToFive,
} from "./shared";

export interface FootingInputs {
  serviceLoadKn: number;
  /** Si se omite, se adopta 1.2 × Pservicio. */
  ultimateLoadKn?: number;
  allowablePressureKnM2: number;
  columnSideCm: number;
  concreteStrengthMpa: number;
  steelYieldMpa: number;
  coverCm: number;
}

export interface FootingResult {
  kind: "footing";
  inputs: FootingInputs;
  requiredAreaM2: number;
  sideCm: number;
  providedAreaM2: number;
  servicePressureKnM2: number;
  ultimatePressureKnM2: number;
  projectionCm: number;
  thicknessCm: number;
  effectiveDepthCm: number;
  ultimateMomentKnMPerM: number;
  requiredSteelAreaCm2PerM: number;
  providedSteelAreaCm2PerM: number;
  flexuralBarProposal: string;
  oneWayShearKn: number;
  punchingShearKn: number;
  phiOneWayShearKn: number;
  phiPunchingShearKn: number;
  ultimateLoadKn: number;
  summary: string;
  compliance: ComplianceCriterion[];
  procedure: CalculationStep[];
}

function proposeMeshBars(requiredAsMm2PerM: number) {
  let best:
    | { spacingCm: number; diameterMm: number; areaMm2PerM: number }
    | undefined;

  for (const diameterMm of BAR_DIAMETERS_MM) {
    for (const spacingCm of [10, 12, 15, 18, 20, 25]) {
      const barsPerM = 100 / spacingCm;
      const areaMm2PerM = barsPerM * barAreaMm2(diameterMm);
      if (areaMm2PerM < requiredAsMm2PerM) {
        continue;
      }
      if (
        !best ||
        areaMm2PerM < best.areaMm2PerM ||
        (areaMm2PerM === best.areaMm2PerM && spacingCm > best.spacingCm)
      ) {
        best = { spacingCm, diameterMm, areaMm2PerM };
      }
    }
  }

  if (!best) {
    best = {
      spacingCm: 10,
      diameterMm: 16,
      areaMm2PerM: 10 * barAreaMm2(16),
    };
  }

  return {
    ...best,
    label: `Ø${best.diameterMm} @ ${best.spacingCm} cm c/dirección`,
  };
}

export function calculateFooting(inputs: FootingInputs): FootingResult {
  assertPositive(inputs.serviceLoadKn, "La carga de servicio P");
  assertPositive(inputs.allowablePressureKnM2, "La capacidad admisible del suelo qa");
  assertPositive(inputs.columnSideCm, "El lado de la columna");
  assertPositive(inputs.coverCm, "El recubrimiento");

  const fcMpa =
    Number.isFinite(inputs.concreteStrengthMpa) && inputs.concreteStrengthMpa > 0
      ? inputs.concreteStrengthMpa
      : DEFAULT_FC_MPA;
  const fyMpa =
    Number.isFinite(inputs.steelYieldMpa) && inputs.steelYieldMpa > 0
      ? inputs.steelYieldMpa
      : 420;
  const ultimateLoadKn =
    Number.isFinite(inputs.ultimateLoadKn) &&
    inputs.ultimateLoadKn !== undefined &&
    inputs.ultimateLoadKn > 0
      ? inputs.ultimateLoadKn
      : 1.2 * inputs.serviceLoadKn;

  const requiredAreaM2 =
    inputs.serviceLoadKn / inputs.allowablePressureKnM2;
  const minSideCm = inputs.columnSideCm + 40;
  let sideCm = Math.max(
    minSideCm,
    roundUpToFive(Math.sqrt(requiredAreaM2) * 100),
  );

  let thicknessCm = 30;
  let effectiveDepthCm = 0;
  let ultimateMomentKnMPerM = 0;
  let requiredSteelAreaCm2PerM = 0;
  let providedSteelAreaCm2PerM = 0;
  let flexuralBarProposal = "";
  let oneWayShearKn = 0;
  let punchingShearKn = 0;
  let phiOneWayShearKn = 0;
  let phiPunchingShearKn = 0;
  let providedAreaM2 = 0;
  let servicePressureKnM2 = 0;
  let ultimatePressureKnM2 = 0;
  let projectionCm = 0;

  for (let iteration = 0; iteration < 40; iteration += 1) {
    providedAreaM2 = (sideCm / 100) ** 2;
    servicePressureKnM2 = inputs.serviceLoadKn / providedAreaM2;
    ultimatePressureKnM2 = ultimateLoadKn / providedAreaM2;
    projectionCm = (sideCm - inputs.columnSideCm) / 2;

    if (projectionCm <= 0) {
      sideCm += 5;
      continue;
    }

    const projectionM = projectionCm / 100;
    ultimateMomentKnMPerM =
      (ultimatePressureKnM2 * projectionM ** 2) / 2;

    effectiveDepthCm = thicknessCm - inputs.coverCm - 0.8;
    if (effectiveDepthCm < 10) {
      thicknessCm += 5;
      continue;
    }

    const dMm = effectiveDepthCm * 10;
    const widthMm = 1000;
    // As ≈ Mu / (φ fy 0.9 d) por metro.
    const requiredAsMm2PerM =
      (ultimateMomentKnMPerM * 1_000_000) /
      (FLEXURE_PHI * fyMpa * 0.9 * dMm);
    const minimumAsMm2PerM = 0.0018 * widthMm * (thicknessCm * 10);
    const designAsMm2PerM = Math.max(requiredAsMm2PerM, minimumAsMm2PerM);
    const mesh = proposeMeshBars(designAsMm2PerM);
    requiredSteelAreaCm2PerM = designAsMm2PerM / 100;
    providedSteelAreaCm2PerM = mesh.areaMm2PerM / 100;
    flexuralBarProposal = mesh.label;

    // Corte unidireccional en la sección crítica a d de la cara.
    const oneWayLengthM = Math.max(0, projectionM - effectiveDepthCm / 100);
    oneWayShearKn = ultimatePressureKnM2 * (sideCm / 100) * oneWayLengthM;
    const vcOneWayKn =
      (0.17 * Math.sqrt(fcMpa) * (sideCm * 10) * dMm) / 1000;
    phiOneWayShearKn = SHEAR_PHI * vcOneWayKn;

    // Punzonamiento: perímetro a d/2 de la cara.
    const criticalSideCm = inputs.columnSideCm + effectiveDepthCm;
    const boMm = 4 * criticalSideCm * 10;
    const loadedAreaRatio = Math.min(
      1,
      (criticalSideCm / sideCm) ** 2,
    );
    punchingShearKn = ultimateLoadKn * (1 - loadedAreaRatio);
    const vcPunchKn = (0.33 * Math.sqrt(fcMpa) * boMm * dMm) / 1000;
    phiPunchingShearKn = SHEAR_PHI * vcPunchKn;

    const bearingOk = servicePressureKnM2 <= inputs.allowablePressureKnM2 * 1.001;
    const oneWayOk = oneWayShearKn <= phiOneWayShearKn;
    const punchOk = punchingShearKn <= phiPunchingShearKn;

    if (bearingOk && oneWayOk && punchOk) {
      break;
    }

    if (!bearingOk) {
      sideCm += 5;
      continue;
    }

    thicknessCm += 5;
  }

  const compliance: ComplianceCriterion[] = [
    {
      criterion: "Presión de servicio ≤ qa",
      calculated: `${formatNumber(servicePressureKnM2, 2)} kN/m²`,
      limit: `≤ ${formatNumber(inputs.allowablePressureKnM2, 2)} kN/m²`,
      status:
        servicePressureKnM2 <= inputs.allowablePressureKnM2 * 1.001
          ? "pass"
          : "fail",
    },
    {
      criterion: "Corte unidireccional",
      calculated: `Vu = ${formatNumber(oneWayShearKn, 2)} kN`,
      limit: `≤ φVc = ${formatNumber(phiOneWayShearKn, 2)} kN`,
      status: oneWayShearKn <= phiOneWayShearKn ? "pass" : "fail",
    },
    {
      criterion: "Punzonamiento",
      calculated: `Vu = ${formatNumber(punchingShearKn, 2)} kN`,
      limit: `≤ φVc = ${formatNumber(phiPunchingShearKn, 2)} kN`,
      status: punchingShearKn <= phiPunchingShearKn ? "pass" : "fail",
    },
    {
      criterion: "Espesor mínimo práctico",
      calculated: `${formatNumber(thicknessCm)} cm`,
      limit: "≥ 30 cm (anteproyecto)",
      status: thicknessCm >= 30 ? "pass" : "fail",
    },
  ];

  return {
    kind: "footing",
    inputs: {
      ...inputs,
      concreteStrengthMpa: fcMpa,
      steelYieldMpa: fyMpa,
      ultimateLoadKn,
    },
    requiredAreaM2,
    sideCm,
    providedAreaM2,
    servicePressureKnM2,
    ultimatePressureKnM2,
    projectionCm,
    thicknessCm,
    effectiveDepthCm,
    ultimateMomentKnMPerM,
    requiredSteelAreaCm2PerM,
    providedSteelAreaCm2PerM,
    flexuralBarProposal,
    oneWayShearKn,
    punchingShearKn,
    phiOneWayShearKn,
    phiPunchingShearKn,
    ultimateLoadKn,
    summary: `Zapata ${formatNumber(sideCm)} × ${formatNumber(sideCm)} × ${formatNumber(thicknessCm)} cm`,
    compliance,
    procedure: [
      {
        title: "1. Área por capacidad del suelo",
        detail: `Areq = Pservicio / qa = ${formatNumber(inputs.serviceLoadKn, 2)} / ${formatNumber(inputs.allowablePressureKnM2, 2)} = ${formatNumber(requiredAreaM2, 3)} m². Se adopta B = ${formatNumber(sideCm)} cm (A = ${formatNumber(providedAreaM2, 3)} m²).`,
      },
      {
        title: "2. Presiones",
        detail: `qservicio = ${formatNumber(servicePressureKnM2, 2)} kN/m²; con Pu = ${formatNumber(ultimateLoadKn, 2)} kN → qu = ${formatNumber(ultimatePressureKnM2, 2)} kN/m². Voladizo l = (B − c)/2 = ${formatNumber(projectionCm, 1)} cm.`,
      },
      {
        title: "3. Flexión en voladizo",
        detail: `Mu = qu·l²/2 = ${formatNumber(ultimateMomentKnMPerM, 2)} kN·m/m. Con d = ${formatNumber(effectiveDepthCm, 1)} cm se requiere As = ${formatNumber(requiredSteelAreaCm2PerM, 2)} cm²/m. Propuesta: ${flexuralBarProposal} (As = ${formatNumber(providedSteelAreaCm2PerM, 2)} cm²/m).`,
        reference: "ACI 318 / NEC-SE-HM: flexión de zapatas; φ = 0.90.",
      },
      {
        title: "4. Corte unidireccional y punzonamiento",
        detail: `Vu,1vía = ${formatNumber(oneWayShearKn, 2)} kN ≤ φVc = ${formatNumber(phiOneWayShearKn, 2)} kN. Vu,punz = ${formatNumber(punchingShearKn, 2)} kN ≤ φVc = ${formatNumber(phiPunchingShearKn, 2)} kN. Espesor adoptado h = ${formatNumber(thicknessCm)} cm.`,
        reference: "ACI 318 §22.5 / §22.6 (simplificado para anteproyecto).",
      },
    ],
  };
}
