import type {
  BeamInputs,
  ColumnInputs,
  ElementType,
  SlabInputs,
} from "@/calculations";

export interface PredimHandoffOptions {
  tab: ElementType;
  designLoadKnM?: number;
  designLoadKnM2?: number;
  tributaryAreaM2?: number;
  serviceLoadKnM2?: number;
  spanM?: number;
  floors?: number;
  source?: string;
}

export interface PredimHandoff {
  tab: ElementType;
  beam: Partial<BeamInputs>;
  column: Partial<ColumnInputs>;
  slab: Partial<SlabInputs>;
  source: string | null;
  applied: boolean;
}

const TABS: ElementType[] = ["beam", "column", "slab"];

function readNumber(
  params: URLSearchParams,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const raw = params.get(key);
    if (raw === null || raw === "") {
      continue;
    }
    const value = Number(raw);
    if (Number.isFinite(value) && value > 0) {
      return value;
    }
  }
  return undefined;
}

function resolveTab(
  params: URLSearchParams,
  fallback: ElementType,
): ElementType {
  const raw = (params.get("tab") ?? "").toLowerCase();
  if (raw === "viga" || raw === "beam") {
    return "beam";
  }
  if (raw === "columna" || raw === "column") {
    return "column";
  }
  if (raw === "losa" || raw === "slab") {
    return "slab";
  }
  if (TABS.includes(raw as ElementType)) {
    return raw as ElementType;
  }
  return fallback;
}

/** Construye `/predim?...` para pasar cargas desde otros módulos. */
export function buildPredimHref(options: PredimHandoffOptions): string {
  const params = new URLSearchParams();
  params.set("tab", options.tab);

  if (options.designLoadKnM !== undefined) {
    params.set("w", String(roundQuery(options.designLoadKnM)));
  }
  if (options.designLoadKnM2 !== undefined) {
    params.set("q", String(roundQuery(options.designLoadKnM2)));
  }
  if (options.tributaryAreaM2 !== undefined) {
    params.set("At", String(roundQuery(options.tributaryAreaM2)));
  }
  if (options.serviceLoadKnM2 !== undefined) {
    params.set(
      options.tab === "column" ? "q" : "qsvc",
      String(roundQuery(options.serviceLoadKnM2)),
    );
  }
  if (options.spanM !== undefined) {
    params.set("L", String(roundQuery(options.spanM)));
  }
  if (options.floors !== undefined) {
    params.set("floors", String(Math.round(options.floors)));
  }
  if (options.source) {
    params.set("from", options.source);
  }

  return `/predim?${params.toString()}`;
}

function roundQuery(value: number) {
  return Math.round(value * 1000) / 1000;
}

/** Interpreta query params de `/predim` (alias cortos y nombres largos). */
export function parsePredimHandoff(
  params: URLSearchParams,
  fallbackTab: ElementType = "beam",
): PredimHandoff {
  const tab = resolveTab(params, fallbackTab);
  const spanM = readNumber(params, ["L", "spanM", "span"]);
  const designLoadKnM = readNumber(params, ["w", "designLoadKnM"]);
  const designLoadKnM2 = readNumber(params, [
    "qu",
    "designLoadKnM2",
    ...(tab === "slab" ? (["q"] as const) : []),
  ]);
  const tributaryAreaM2 = readNumber(params, ["At", "tributaryAreaM2", "at"]);
  const serviceLoadKnM2 = readNumber(params, [
    "qsvc",
    "serviceLoadKnM2",
    ...(tab === "column" ? (["q"] as const) : []),
  ]);
  const floors = readNumber(params, ["floors", "pisos"]);
  const source = params.get("from");

  const beam: Partial<BeamInputs> = {};
  if (spanM !== undefined) {
    beam.spanM = spanM;
  }
  if (designLoadKnM !== undefined) {
    beam.designLoadKnM = designLoadKnM;
  }

  const column: Partial<ColumnInputs> = {};
  if (tributaryAreaM2 !== undefined) {
    column.tributaryAreaM2 = tributaryAreaM2;
  }
  if (serviceLoadKnM2 !== undefined) {
    column.serviceLoadKnM2 = serviceLoadKnM2;
  }
  if (floors !== undefined) {
    column.floors = floors;
  }

  const slab: Partial<SlabInputs> = {};
  if (spanM !== undefined) {
    slab.spanM = spanM;
  }
  if (designLoadKnM2 !== undefined) {
    slab.designLoadKnM2 = designLoadKnM2;
  }

  const applied =
    designLoadKnM !== undefined ||
    designLoadKnM2 !== undefined ||
    tributaryAreaM2 !== undefined ||
    serviceLoadKnM2 !== undefined ||
    spanM !== undefined ||
    floors !== undefined;

  return {
    tab,
    beam,
    column,
    slab,
    source,
    applied,
  };
}

export function describeHandoffSource(source: string | null): string {
  switch (source) {
    case "combinaciones":
      return "Combinaciones NEC";
    case "tributarias":
      return "Tributarias";
    case "deflexion":
      return "Deflexión aprox.";
    case "zapatas":
      return "Zapatas PreDim";
    default:
      return "CivilKit EC";
  }
}
