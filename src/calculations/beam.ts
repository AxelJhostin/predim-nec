import type { BeamInputs, BeamResult, BeamSupportType } from "./types";
import {
  BAR_DIAMETERS_MM,
  CONCRETE_UNIT_WEIGHT_KN_M3,
  DEFAULT_FC_MPA,
  DEFAULT_STIRRUP_DIAMETER_MM,
  FLEXURE_PHI,
  SHEAR_PHI,
  assertPositive,
  barAreaMm2,
  beta1,
  flexuralCapacityKnM,
  formatNumber,
  roundUpToFive,
} from "./shared";

export type { BeamInputs, BeamResult, BeamSupportType } from "./types";

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
      : DEFAULT_FC_MPA;
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

    // Redondeo al 0.5 cm inferior (más seguro: menor espaciamiento).
    stirrupSpacingCm = Math.max(
      5,
      Math.floor((spacingMm / 10) * 2) / 2,
    );
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

