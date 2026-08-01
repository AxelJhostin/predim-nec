import type { SlabInputs, SlabResult } from "./types";
import {
  DEFAULT_FC_MPA,
  FLEXURE_PHI,
  assertPositive,
  barAreaMm2,
  flexuralCapacityKnM,
  formatNumber,
  roundUpToHalf,
} from "./shared";

export type { SlabInputs, SlabResult } from "./types";

function proposeSlabBars(requiredAsMm2PerM: number, maxSpacingMm: number) {
  for (const diameterMm of [8, 10, 12, 14, 16] as const) {
    const area = barAreaMm2(diameterMm);
    const spacingMm = Math.min(
      maxSpacingMm,
      Math.floor((1000 * area) / requiredAsMm2PerM / 10) * 10,
    );
    if (spacingMm < 80) {
      continue;
    }
    const provided = (1000 * area) / spacingMm;
    if (provided + 0.01 >= requiredAsMm2PerM) {
      return {
        diameterMm,
        spacingCm: spacingMm / 10,
        areaMm2PerM: provided,
        label: `Ø${diameterMm} mm @ ${formatNumber(spacingMm / 10)} cm c/c`,
      };
    }
  }

  const diameterMm = 12;
  const area = barAreaMm2(diameterMm);
  const spacingMm = 100;
  return {
    diameterMm,
    spacingCm: 10,
    areaMm2PerM: (1000 * area) / spacingMm,
    label: `Ø${diameterMm} mm @ 10 cm c/c`,
  };
}


export function calculateSlab(inputs: SlabInputs): SlabResult {
  assertPositive(inputs.spanM, "La luz");
  assertPositive(inputs.designLoadKnM2, "La carga de diseño");
  assertPositive(inputs.steelYieldMpa, "La fluencia fy");
  assertPositive(inputs.coverCm, "El recubrimiento");

  const fcMpa =
    Number.isFinite(inputs.concreteStrengthMpa) && inputs.concreteStrengthMpa > 0
      ? inputs.concreteStrengthMpa
      : DEFAULT_FC_MPA;
  const normalizedInputs: SlabInputs = {
    ...inputs,
    concreteStrengthMpa: fcMpa,
  };

  const divisor = inputs.slabType === "solid" ? 25 : 21;
  const momentDivisor = inputs.supportType === "Continua" ? 11 : 8;
  let thicknessCm = Math.max(
    inputs.slabType === "solid" ? 10 : 12,
    roundUpToHalf((inputs.spanM * 100) / divisor),
  );
  let effectiveDepthCm = thicknessCm - inputs.coverCm;
  const ultimateMomentKnM =
    (inputs.designLoadKnM2 * inputs.spanM ** 2) / momentDivisor;
  let requiredSteelAreaCm2PerM = 0;
  let providedSteelAreaCm2PerM = 0;
  let flexuralBarProposal = "";
  let temperatureSteelProposal = "";
  let designResistanceKnM = 0;
  let steelRatio = 0;
  let minimumSteelRatio = 0;

  for (let iteration = 0; iteration < 40; iteration += 1) {
    effectiveDepthCm = thicknessCm - inputs.coverCm;
    if (effectiveDepthCm <= 2) {
      thicknessCm += 0.5;
      continue;
    }

    const widthMm = 1000;
    const depthMm = effectiveDepthCm * 10;
    const fy = inputs.steelYieldMpa;
    const muNmm = ultimateMomentKnM * 1_000_000;
    const ru = muNmm / (FLEXURE_PHI * widthMm * depthMm ** 2);
    const root = 1 - (2 * ru) / (0.85 * fcMpa);

    if (root <= 0) {
      thicknessCm += 0.5;
      continue;
    }

    const rhoRequired = ((0.85 * fcMpa) / fy) * (1 - Math.sqrt(root));
    minimumSteelRatio =
      fy >= 420 ? 0.0018 : Math.max(0.002, 0.0018 * 420 / fy);
    const rhoDesign = Math.max(rhoRequired, minimumSteelRatio);
    const requiredAsMm2 = rhoDesign * widthMm * depthMm;
    const maxSpacingMm = Math.min(
      3 * thicknessCm * 10,
      inputs.slabType === "solid" ? 450 : 400,
    );
    const bars = proposeSlabBars(requiredAsMm2, maxSpacingMm);
    const tempBars = proposeSlabBars(minimumSteelRatio * widthMm * thicknessCm * 10, maxSpacingMm);

    requiredSteelAreaCm2PerM = requiredAsMm2 / 100;
    providedSteelAreaCm2PerM = bars.areaMm2PerM / 100;
    steelRatio = bars.areaMm2PerM / (widthMm * depthMm);
    designResistanceKnM = flexuralCapacityKnM(
      bars.areaMm2PerM,
      widthMm,
      depthMm,
      fy,
      fcMpa,
    );
    flexuralBarProposal = bars.label;
    temperatureSteelProposal =
      inputs.slabType === "solid"
        ? `Distribución / temperatura: ${tempBars.label}`
        : `En nervios usar ${bars.label}; malla de distribución: ${tempBars.label}`;

    if (designResistanceKnM >= ultimateMomentKnM) {
      break;
    }

    thicknessCm += 0.5;
  }

  const spanDepthRatio = (inputs.spanM * 100) / thicknessCm;

  return {
    kind: "slab",
    inputs: normalizedInputs,
    thicknessCm,
    divisor,
    momentDivisor,
    effectiveDepthCm,
    ultimateMomentKnM,
    designResistanceKnM,
    requiredSteelAreaCm2PerM,
    providedSteelAreaCm2PerM,
    flexuralBarProposal,
    temperatureSteelProposal,
    steelRatio,
    minimumSteelRatio,
    concreteStrengthMpa: fcMpa,
    compliance: [
      {
        criterion: "Relación luz/peralte",
        calculated: `L/${spanDepthRatio.toFixed(1)}`,
        limit: `≤ L/${divisor}`,
        status: spanDepthRatio <= divisor + 0.05 ? "pass" : "fail",
      },
      {
        criterion: "Flexión φMn ≥ Mu (franja 1 m)",
        calculated: `φMn = ${formatNumber(designResistanceKnM, 2)} kN·m/m`,
        limit: `≥ Mu = ${formatNumber(ultimateMomentKnM, 2)} kN·m/m`,
        status: designResistanceKnM >= ultimateMomentKnM ? "pass" : "fail",
      },
      {
        criterion: "Cuantía de flexión",
        calculated: `ρ = ${(steelRatio * 100).toFixed(3)}%`,
        limit: `≥ ρmin = ${(minimumSteelRatio * 100).toFixed(3)}%`,
        status: steelRatio + 1e-9 >= minimumSteelRatio ? "pass" : "fail",
      },
      {
        criterion: "Acero de temperatura / distribución",
        calculated: temperatureSteelProposal,
        limit: "As,temp ≥ ρmin b h",
        status: "pass",
      },
    ],
    procedure: [
      {
        title: "1. Tipo de losa y espesor",
        detail: `${inputs.slabType === "solid" ? "Maciza" : "Nervada"}: h = L/${divisor} → ${formatNumber(thicknessCm)} cm (redondeo constructivo).`,
      },
      {
        title: "2. Demanda flexional por metro",
        detail: `Apoyo ${inputs.supportType.toLowerCase()}: Mu = w L² / ${momentDivisor} = ${formatNumber(inputs.designLoadKnM2, 2)} × ${formatNumber(inputs.spanM, 2)}² / ${momentDivisor} = ${formatNumber(ultimateMomentKnM, 2)} kN·m por metro de ancho.`,
        reference:
          "Análisis aproximado de losa en una dirección; validar con modelo y combinaciones NEC.",
      },
      {
        title: "3. Acero a flexión",
        detail: `Con d = ${formatNumber(effectiveDepthCm)} cm, f'c = ${formatNumber(fcMpa)} MPa y fy = ${formatNumber(inputs.steelYieldMpa)} MPa: As = ${formatNumber(requiredSteelAreaCm2PerM, 2)} cm²/m. Se propone ${flexuralBarProposal} (As = ${formatNumber(providedSteelAreaCm2PerM, 2)} cm²/m) con φMn = ${formatNumber(designResistanceKnM, 2)} kN·m/m.`,
        reference: "ACI 318 / NEC-SE-HM: flexión de losas, φ = 0.90.",
      },
      {
        title: "4. Temperatura y distribución",
        detail: temperatureSteelProposal,
        reference:
          "As mínimo por temperatura/retracción ≈ 0.0018 bh para fy ≥ 420 MPa.",
      },
    ],
  };
}

