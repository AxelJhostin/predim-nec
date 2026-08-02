import { formatNumber } from "./format";

export type TributaryTarget = "column" | "beam";
export type ColumnBayPosition = "interior" | "edge" | "corner";

export interface ColumnTributaryInputs {
  target: "column";
  position: ColumnBayPosition;
  bayLxM: number;
  bayLyM: number;
  /** Carga de servicio opcional (D+L) para estimar Pservicio. */
  serviceLoadKnM2?: number;
}

export interface BeamTributaryInputs {
  target: "beam";
  /** Ancho tributario (m), habitualmente el espaciamiento entre vigas. */
  tributaryWidthM: number;
  spanM?: number;
  /** Carga de área mayorada opcional para obtener w. */
  designLoadKnM2?: number;
  /** Carga de área de servicio opcional. */
  serviceLoadKnM2?: number;
}

export type TributaryInputs = ColumnTributaryInputs | BeamTributaryInputs;

export interface TributaryResult {
  kind: "tributary";
  inputs: TributaryInputs;
  tributaryAreaM2: number;
  designLoadKnM: number | null;
  serviceLoadKn: number | null;
  serviceLoadKnM2: number | null;
  summary: string;
  predimHint: string;
  procedure: { title: string; detail: string }[];
}

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} debe ser mayor que cero.`);
  }
}

function columnAreaFactor(position: ColumnBayPosition): {
  fx: number;
  fy: number;
  label: string;
} {
  switch (position) {
    case "interior":
      return { fx: 1, fy: 1, label: "interior (plena)" };
    case "edge":
      return { fx: 0.5, fy: 1, label: "borde (media en un eje)" };
    case "corner":
      return { fx: 0.5, fy: 0.5, label: "esquina (cuartos)" };
  }
}

export function calculateTributary(inputs: TributaryInputs): TributaryResult {
  if (inputs.target === "column") {
    assertPositive(inputs.bayLxM, "La luz del vano Lx");
    assertPositive(inputs.bayLyM, "La luz del vano Ly");
    if (
      inputs.serviceLoadKnM2 !== undefined &&
      (!Number.isFinite(inputs.serviceLoadKnM2) || inputs.serviceLoadKnM2 < 0)
    ) {
      throw new Error("La carga de servicio q no puede ser negativa.");
    }

    const { fx, fy, label } = columnAreaFactor(inputs.position);
    const tributaryAreaM2 = inputs.bayLxM * fx * (inputs.bayLyM * fy);
    const serviceLoadKnM2 =
      inputs.serviceLoadKnM2 !== undefined && inputs.serviceLoadKnM2 > 0
        ? inputs.serviceLoadKnM2
        : null;
    const serviceLoadKn =
      serviceLoadKnM2 !== null ? serviceLoadKnM2 * tributaryAreaM2 : null;

    return {
      kind: "tributary",
      inputs,
      tributaryAreaM2,
      designLoadKnM: null,
      serviceLoadKn,
      serviceLoadKnM2,
      summary: `Columna ${label}: At = ${formatNumber(tributaryAreaM2, 2)} m²`,
      predimHint:
        "En PreDim → Columna: pega At y, si la tienes, la q de servicio (kN/m²).",
      procedure: [
        {
          title: "1. Posición en la retícula",
          detail: `Columna ${label}: factores ${formatNumber(fx, 2)} × Lx y ${formatNumber(fy, 2)} × Ly sobre el vano ${formatNumber(inputs.bayLxM, 2)} × ${formatNumber(inputs.bayLyM, 2)} m.`,
        },
        {
          title: "2. Área tributaria",
          detail: `At = (${formatNumber(fx, 2)}·Lx)·(${formatNumber(fy, 2)}·Ly) = ${formatNumber(tributaryAreaM2, 2)} m².`,
        },
        {
          title: "3. Carga de servicio (opcional)",
          detail:
            serviceLoadKn !== null && serviceLoadKnM2 !== null
              ? `Pservicio ≈ q · At = ${formatNumber(serviceLoadKnM2, 2)} × ${formatNumber(tributaryAreaM2, 2)} = ${formatNumber(serviceLoadKn, 2)} kN (por piso). En PreDim se mayorará ≈ 1.2 Pservicio.`
              : "Sin q de servicio: lleva solo At a PreDim (Columnas).",
        },
      ],
    };
  }

  assertPositive(inputs.tributaryWidthM, "El ancho tributario");
  if (inputs.spanM !== undefined) {
    assertPositive(inputs.spanM, "La luz de la viga");
  }
  if (
    inputs.designLoadKnM2 !== undefined &&
    (!Number.isFinite(inputs.designLoadKnM2) || inputs.designLoadKnM2 < 0)
  ) {
    throw new Error("La carga mayorada q_u no puede ser negativa.");
  }
  if (
    inputs.serviceLoadKnM2 !== undefined &&
    (!Number.isFinite(inputs.serviceLoadKnM2) || inputs.serviceLoadKnM2 < 0)
  ) {
    throw new Error("La carga de servicio q no puede ser negativa.");
  }

  const spanForArea = inputs.spanM ?? 1;
  const tributaryAreaM2 = inputs.tributaryWidthM * spanForArea;
  const designLoadKnM =
    inputs.designLoadKnM2 !== undefined && inputs.designLoadKnM2 > 0
      ? inputs.designLoadKnM2 * inputs.tributaryWidthM
      : null;
  const serviceLoadKnM2 =
    inputs.serviceLoadKnM2 !== undefined && inputs.serviceLoadKnM2 > 0
      ? inputs.serviceLoadKnM2
      : null;
  const serviceLoadKn =
    serviceLoadKnM2 !== null
      ? serviceLoadKnM2 * inputs.tributaryWidthM * spanForArea
      : null;

  return {
    kind: "tributary",
    inputs,
    tributaryAreaM2,
    designLoadKnM,
    serviceLoadKn,
    serviceLoadKnM2,
    summary:
      designLoadKnM !== null
        ? `Viga: w = ${formatNumber(designLoadKnM, 2)} kN/m (bt = ${formatNumber(inputs.tributaryWidthM, 2)} m)`
        : `Viga: ancho tributario bt = ${formatNumber(inputs.tributaryWidthM, 2)} m`,
    predimHint:
      designLoadKnM !== null
        ? "En PreDim → Viga: pega w (kN/m) como carga de diseño."
        : "Obtén q_u en Combinaciones NEC y vuelve a calcular w = q_u · bt.",
    procedure: [
      {
        title: "1. Ancho tributario",
        detail: `Para vigas paralelas a espaciamiento s, bt ≈ s = ${formatNumber(inputs.tributaryWidthM, 2)} m (mitad a cada lado si la retícula es simétrica).`,
      },
      {
        title: "2. Área asociada a la luz",
        detail: inputs.spanM
          ? `At ≈ bt · L = ${formatNumber(inputs.tributaryWidthM, 2)} × ${formatNumber(inputs.spanM, 2)} = ${formatNumber(tributaryAreaM2, 2)} m².`
          : `Sin luz ingresada: se reporta At por metro de viga = bt = ${formatNumber(inputs.tributaryWidthM, 2)} m²/m.`,
      },
      {
        title: "3. Carga lineal",
        detail:
          designLoadKnM !== null && inputs.designLoadKnM2 !== undefined
            ? `w = q_u · bt = ${formatNumber(inputs.designLoadKnM2, 2)} × ${formatNumber(inputs.tributaryWidthM, 2)} = ${formatNumber(designLoadKnM, 2)} kN/m.`
            : "Sin q_u: usa Combinaciones NEC para obtener la carga de área mayorada y calcúlala aquí.",
      },
    ],
  };
}
