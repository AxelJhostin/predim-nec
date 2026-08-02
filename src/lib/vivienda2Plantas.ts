/**
 * Escenario coherente: vivienda de 2 plantas (anteproyecto académico).
 * Una sola fuente de verdad para plantilla PreDim, flujo guiado y tests.
 */
import {
  calculateBeam,
  calculateColumn,
  calculateCombinations,
  calculateDeflection,
  calculateFooting,
  calculateSlab,
  calculateTributary,
} from "@/calculations";
import { buildPredimHref } from "@/lib/predimHandoff";

export const VIVIENDA_2P = {
  id: "vivienda-2-plantas",
  title: "Vivienda de 2 plantas",
  deadLoadKnM2: 5,
  liveLoadKnM2: 2,
  bayLxM: 4,
  bayLyM: 4,
  /** Ancho tributario de viga secundaria (m). */
  beamTributaryWidthM: 2,
  spanM: 4,
  floors: 2,
  clearHeightM: 2.7,
  allowablePressureKnM2: 150,
  concreteStrengthMpa: 21,
  steelYieldMpa: 420,
  coverBeamCm: 4,
  coverSlabCm: 2,
  coverFootingCm: 7.5,
} as const;

export function runVivienda2PlantasFlow() {
  const s = VIVIENDA_2P;
  const serviceLoadKnM2 = s.deadLoadKnM2 + s.liveLoadKnM2;

  const combinations = calculateCombinations({
    deadLoadKnM2: s.deadLoadKnM2,
    liveLoadKnM2: s.liveLoadKnM2,
    tributaryWidthM: s.beamTributaryWidthM,
  });

  const tributaryColumn = calculateTributary({
    target: "column",
    position: "interior",
    bayLxM: s.bayLxM,
    bayLyM: s.bayLyM,
    serviceLoadKnM2,
  });

  const tributaryBeam = calculateTributary({
    target: "beam",
    tributaryWidthM: s.beamTributaryWidthM,
    spanM: s.spanM,
    designLoadKnM2: combinations.governing.valueKnM2,
  });

  const qu = combinations.governing.valueKnM2;
  const wDesign = combinations.designLoadKnM!;
  const wService = serviceLoadKnM2 * s.beamTributaryWidthM;

  const slab = calculateSlab({
    spanM: s.spanM,
    slabType: "solid",
    supportType: "Continua",
    designLoadKnM2: qu,
    steelYieldMpa: s.steelYieldMpa,
    concreteStrengthMpa: s.concreteStrengthMpa,
    coverCm: s.coverSlabCm,
  });

  const beam = calculateBeam({
    spanM: s.spanM,
    supportType: "Ambos extremos continuos",
    designLoadKnM: wDesign,
    steelYieldMpa: s.steelYieldMpa,
    coverCm: s.coverBeamCm,
    concreteStrengthMpa: s.concreteStrengthMpa,
    stirrupDiameterMm: 10,
  });

  // Interior + Central: no doble conteo de factores de borde/esquina.
  const column = calculateColumn({
    tributaryAreaM2: tributaryColumn.tributaryAreaM2,
    floors: s.floors,
    columnType: "Central",
    serviceLoadKnM2,
    clearHeightM: s.clearHeightM,
    effectiveLengthFactor: 1,
    concreteStrengthMpa: s.concreteStrengthMpa,
    steelYieldMpa: s.steelYieldMpa,
    tieDiameterMm: 10,
  });

  const footing = calculateFooting({
    serviceLoadKn: column.serviceLoadKn,
    ultimateLoadKn: column.ultimateLoadKn,
    allowablePressureKnM2: s.allowablePressureKnM2,
    columnSideCm: column.sideCm,
    concreteStrengthMpa: s.concreteStrengthMpa,
    steelYieldMpa: s.steelYieldMpa,
    coverCm: s.coverFootingCm,
  });

  const deflection = calculateDeflection({
    spanM: s.spanM,
    designLoadKnM: wService,
    widthCm: beam.widthCm,
    depthCm: beam.depthCm,
    supportType: "both-continuous",
    concreteStrengthMpa: s.concreteStrengthMpa,
    limitRatio: 240,
  });

  return {
    scenario: s,
    serviceLoadKnM2,
    qu,
    wDesign,
    wService,
    combinations,
    tributaryColumn,
    tributaryBeam,
    slab,
    beam,
    column,
    footing,
    deflection,
    links: {
      combinations: `/combinaciones-nec`,
      tributaryColumn: `/tributarias`,
      tributaryBeam: `/tributarias`,
      slab: buildPredimHref({
        tab: "slab",
        designLoadKnM2: qu,
        spanM: s.spanM,
        source: "vivienda2p",
      }),
      beam: buildPredimHref({
        tab: "beam",
        designLoadKnM: wDesign,
        spanM: s.spanM,
        source: "vivienda2p",
      }),
      column: buildPredimHref({
        tab: "column",
        tributaryAreaM2: tributaryColumn.tributaryAreaM2,
        serviceLoadKnM2,
        floors: s.floors,
        source: "vivienda2p",
      }),
      deflection: `/deflexion-aprox`,
      footing: `/zapatas-predim`,
      officialNec: `/norma-nec`,
      article: `/aprender/vivienda-2-pisos-nec`,
    },
  };
}

export type Vivienda2PlantasFlow = ReturnType<typeof runVivienda2PlantasFlow>;
