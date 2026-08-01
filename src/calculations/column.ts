import type { ColumnInputs, ColumnResult, ColumnType } from "./types";
import {
  DEFAULT_FC_MPA,
  DEFAULT_SERVICE_LOAD_KN_M2,
  assertPositive,
  barAreaMm2,
  formatNumber,
  roundUpToFive,
} from "./shared";

export type { ColumnInputs, ColumnResult, ColumnType } from "./types";

function axialTiedCapacityKn(
  grossAreaMm2: number,
  steelAreaMm2: number,
  fcMpa: number,
  fyMpa: number,
) {
  const pnMaxN =
    0.8 *
    (0.85 * fcMpa * (grossAreaMm2 - steelAreaMm2) + fyMpa * steelAreaMm2);
  return (0.65 * pnMaxN) / 1000;
}

function proposeColumnBars(requiredAsMm2: number, sideCm: number) {
  const counts = [4, 6, 8];
  let best:
    | { count: number; diameterMm: number; areaMm2: number }
    | undefined;

  for (const diameterMm of [16, 18, 20, 22, 25] as const) {
    for (const count of counts) {
      const areaMm2 = count * barAreaMm2(diameterMm);
      if (areaMm2 < requiredAsMm2) {
        continue;
      }
      // Colocación perimetral aproximada con 4 cm de recubrimiento.
      const clearSideMm = sideCm * 10 - 2 * 40;
      const neededMm = count === 4
        ? 2 * diameterMm
        : count * diameterMm + (count / 2 - 1) * Math.max(25, diameterMm);
      if (neededMm > clearSideMm * 1.5) {
        continue;
      }
      if (
        !best ||
        areaMm2 < best.areaMm2 ||
        (areaMm2 === best.areaMm2 && count < best.count)
      ) {
        best = { count, diameterMm, areaMm2 };
      }
    }
  }

  if (!best) {
    const diameterMm = 20;
    const count = Math.max(4, Math.ceil(requiredAsMm2 / barAreaMm2(diameterMm)));
    best = {
      count: count % 2 === 0 ? count : count + 1,
      diameterMm,
      areaMm2: 0,
    };
    best.areaMm2 = best.count * barAreaMm2(best.diameterMm);
  }

  return {
    ...best,
    label: `${best.count} Ø${best.diameterMm} mm`,
  };
}


export function calculateColumn(inputs: ColumnInputs): ColumnResult {
  assertPositive(inputs.tributaryAreaM2, "El área tributaria");
  assertPositive(inputs.floors, "El número de pisos");
  assertPositive(inputs.clearHeightM, "La longitud libre");
  assertPositive(inputs.effectiveLengthFactor, "El factor de longitud efectiva");

  const fcMpa =
    Number.isFinite(inputs.concreteStrengthMpa) && inputs.concreteStrengthMpa > 0
      ? inputs.concreteStrengthMpa
      : DEFAULT_FC_MPA;
  const fyMpa =
    Number.isFinite(inputs.steelYieldMpa) && inputs.steelYieldMpa > 0
      ? inputs.steelYieldMpa
      : 420;
  const tieDiameterMm =
    Number.isFinite(inputs.tieDiameterMm) && inputs.tieDiameterMm > 0
      ? inputs.tieDiameterMm
      : 10;
  const normalizedInputs: ColumnInputs = {
    ...inputs,
    concreteStrengthMpa: fcMpa,
    steelYieldMpa: fyMpa,
    tieDiameterMm,
  };

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
  const ultimateLoadKn = 1.2 * serviceLoadKn;

  let requiredAreaCm2 =
    (ultimateLoadKn * 10) / (areaReductionFactor * fcMpa);
  let calculatedSideCm = Math.sqrt(requiredAreaCm2);
  let sideCm = Math.max(30, roundUpToFive(calculatedSideCm));
  const initialSideCm = sideCm;
  let grossAreaCm2 = sideCm ** 2;
  let requiredSteelAreaCm2 = 0.01 * grossAreaCm2;
  let providedSteelAreaCm2 = 0;
  let longitudinalBarProposal = "";
  let designAxialResistanceKn = 0;
  let steelRatio = 0;
  let mainBarDiameterMm = 16;

  for (let iteration = 0; iteration < 40; iteration += 1) {
    grossAreaCm2 = sideCm ** 2;
    const grossAreaMm2 = grossAreaCm2 * 100;
    requiredSteelAreaCm2 = 0.01 * grossAreaCm2;

    let phiPn = axialTiedCapacityKn(
      grossAreaMm2,
      requiredSteelAreaCm2 * 100,
      fcMpa,
      fyMpa,
    );

    // Si con ρ = 1% no alcanza, subir Ast hasta 3% o agrandar sección.
    let asMm2 = requiredSteelAreaCm2 * 100;
    while (phiPn < ultimateLoadKn && asMm2 / grossAreaMm2 < 0.03) {
      asMm2 += barAreaMm2(16);
      phiPn = axialTiedCapacityKn(grossAreaMm2, asMm2, fcMpa, fyMpa);
    }

    if (phiPn < ultimateLoadKn) {
      sideCm += 5;
      continue;
    }

    requiredSteelAreaCm2 = Math.max(0.01 * grossAreaCm2, asMm2 / 100);
    const bars = proposeColumnBars(requiredSteelAreaCm2 * 100, sideCm);
    providedSteelAreaCm2 = bars.areaMm2 / 100;
    steelRatio = providedSteelAreaCm2 / grossAreaCm2;
    designAxialResistanceKn = axialTiedCapacityKn(
      grossAreaMm2,
      bars.areaMm2,
      fcMpa,
      fyMpa,
    );
    longitudinalBarProposal = bars.label;
    mainBarDiameterMm = bars.diameterMm;

    if (designAxialResistanceKn >= ultimateLoadKn && steelRatio <= 0.03) {
      break;
    }

    sideCm += 5;
  }

  const minimumApplied = calculatedSideCm < 30;
  const capacityAdjusted = sideCm > initialSideCm;
  requiredAreaCm2 = (ultimateLoadKn * 10) / (areaReductionFactor * fcMpa);
  calculatedSideCm = Math.sqrt(requiredAreaCm2);
  const radiusOfGyrationCm = sideCm / Math.sqrt(12);
  const slenderness =
    (inputs.effectiveLengthFactor * inputs.clearHeightM * 100) /
    radiusOfGyrationCm;

  const tieSpacingMm = Math.min(
    16 * mainBarDiameterMm,
    48 * tieDiameterMm,
    sideCm * 10,
    sideCm * 5,
  );
  const tieSpacingCm = Math.max(5, Math.floor(tieSpacingMm / 10 / 0.5) * 0.5);
  const tieProposal = `Estribos Ø${tieDiameterMm} mm @ ${formatNumber(tieSpacingCm)} cm`;

  return {
    kind: "column",
    inputs: normalizedInputs,
    serviceLoadKn,
    ultimateLoadKn,
    designAxialResistanceKn,
    appliedServiceLoadKnM2,
    positionFactor,
    areaReductionFactor,
    requiredAreaCm2,
    sideCm,
    grossAreaCm2,
    requiredSteelAreaCm2,
    providedSteelAreaCm2,
    longitudinalBarProposal,
    tieProposal,
    tieSpacingCm,
    slenderness,
    steelRatio,
    minimumApplied,
    capacityAdjusted,
    concreteStrengthMpa: fcMpa,
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
        criterion: "Axial φPn ≥ Pu",
        calculated: `φPn = ${formatNumber(designAxialResistanceKn, 1)} kN`,
        limit: `≥ Pu = ${formatNumber(ultimateLoadKn, 1)} kN`,
        status: designAxialResistanceKn >= ultimateLoadKn ? "pass" : "fail",
      },
      {
        criterion: "Cuantía longitudinal ρ",
        calculated: `${(steelRatio * 100).toFixed(2)}%`,
        limit: "1% – 3%",
        status: steelRatio >= 0.01 && steelRatio <= 0.03 ? "pass" : "fail",
      },
    ],
    procedure: [
      {
        title: "1. Criterio de posición",
        detail: `Columna ${inputs.columnType.toLowerCase()}: ${position.description}; factor de carga ${formatNumber(positionFactor, 2)} y factor de área ${formatNumber(areaReductionFactor, 2)}.`,
        reference:
          "Factores de anteproyecto por posición; validar con combinaciones NEC-SE-CG y análisis estructural.",
      },
      {
        title: "2. Carga de servicio y última",
        detail: `Pservicio = ${formatNumber(positionFactor, 2)} × ${formatNumber(appliedServiceLoadKnM2, 2)} × ${formatNumber(inputs.tributaryAreaM2, 2)} × ${inputs.floors} = ${formatNumber(serviceLoadKn, 2)} kN. Pu ≈ 1.2 Pservicio = ${formatNumber(ultimateLoadKn, 2)} kN.`,
      },
      {
        title: "3. Sección y acero longitudinal",
        detail: `Ag preliminar con f'c = ${formatNumber(fcMpa)} MPa → lado ${formatNumber(sideCm)} × ${formatNumber(sideCm)} cm${capacityAdjusted ? " (ajustado por capacidad)" : ""}. As requerido ≈ ${formatNumber(requiredSteelAreaCm2, 2)} cm²; se propone ${longitudinalBarProposal} (As = ${formatNumber(providedSteelAreaCm2, 2)} cm², ρ = ${(steelRatio * 100).toFixed(2)}%).`,
        reference:
          "NEC-SE-HM §4.3.1: dimensión mínima 300 mm. ACI 318: 0.01 ≤ ρ ≤ 0.04 (aquí se limita a 3% por ductilidad/práctica).",
      },
      {
        title: "4. Resistencia axial de columna amarrada",
        detail: `φPn = 0.65 × 0.80 [0.85 f'c (Ag − Ast) + fy Ast] = ${formatNumber(designAxialResistanceKn, 2)} kN ≥ Pu.`,
        reference: "ACI 318 (columnas amarradas), φ = 0.65.",
      },
      {
        title: "5. Estribos / amarraderos",
        detail: `${tieProposal}. Espaciamiento limitado por 16 db, 48 dt y la menor dimensión.`,
        reference: "ACI 318 / NEC-SE-HM: refuerzo transversal mínimo. El detallado sísmico puede exigir zonas confinado más estrictas.",
      },
    ],
  };
}

