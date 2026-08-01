import {
  calculateBeam,
  calculateColumn,
  calculateSlab,
  type BeamInputs,
  type BeamSupportType,
  type CalculationResult,
  type ColumnInputs,
  type ColumnType,
  type ElementType,
  type SlabInputs,
  type SlabSupportType,
} from "@/calculations";
import {
  CALCULATION_VERSION,
  PROJECT_SCHEMA_VERSION,
} from "./constants";
import { getDimension } from "./savedElement";
import type { LocalProject, ProjectMetadata, SavedProjectElement } from "./types";

export interface MigrationReport {
  fromSchema: number;
  toSchema: number;
  recalculatedLabels: string[];
  droppedLabels: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isElementType(value: unknown): value is ElementType {
  return value === "beam" || value === "column" || value === "slab";
}

function asPositiveNumber(value: unknown, fallback?: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
}

function detectSchemaVersion(raw: Record<string, unknown>) {
  if (typeof raw.schemaVersion === "number" && Number.isFinite(raw.schemaVersion)) {
    return raw.schemaVersion;
  }
  // Proyectos previos al versionado explícito.
  if (isRecord(raw.metadata) && Array.isArray(raw.elements)) {
    return 0;
  }
  return -1;
}

function migrateMetadata(raw: unknown): ProjectMetadata {
  if (!isRecord(raw)) {
    throw new Error("Los metadatos del proyecto son inválidos.");
  }

  if (
    typeof raw.name !== "string" ||
    typeof raw.responsible !== "string" ||
    typeof raw.location !== "string" ||
    typeof raw.date !== "string"
  ) {
    throw new Error("Los metadatos del proyecto son inválidos.");
  }

  return {
    name: raw.name,
    responsible: raw.responsible,
    location: raw.location,
    institution: typeof raw.institution === "string" ? raw.institution : "",
    date: raw.date,
    notes: typeof raw.notes === "string" ? raw.notes : "",
  };
}

function needsRecalculation(
  kind: ElementType,
  calculationVersion: unknown,
  result: Record<string, unknown>,
) {
  if (calculationVersion !== CALCULATION_VERSION) {
    return true;
  }

  if (result.kind !== kind) {
    return true;
  }

  if (kind === "beam") {
    return !(
      typeof result.designResistanceKnM === "number" &&
      typeof result.stirrupProposal === "string" &&
      typeof result.flexuralBarProposal === "string"
    );
  }

  if (kind === "column") {
    return !(
      typeof result.ultimateLoadKn === "number" &&
      typeof result.designAxialResistanceKn === "number" &&
      typeof result.longitudinalBarProposal === "string" &&
      typeof result.tieProposal === "string"
    );
  }

  return !(
    typeof result.ultimateMomentKnM === "number" &&
    typeof result.flexuralBarProposal === "string" &&
    typeof result.temperatureSteelProposal === "string"
  );
}

function migrateBeamInputs(raw: Record<string, unknown>): BeamInputs {
  const supportType = raw.supportType;
  const validSupports: BeamSupportType[] = [
    "Simplemente apoyada",
    "Un extremo continuo",
    "Ambos extremos continuos",
    "Voladizo",
  ];
  if (typeof supportType !== "string" || !validSupports.includes(supportType as BeamSupportType)) {
    throw new Error("Apoyo de viga incompatible.");
  }

  const spanM = asPositiveNumber(raw.spanM);
  const designLoadKnM = asPositiveNumber(raw.designLoadKnM);
  const steelYieldMpa = asPositiveNumber(raw.steelYieldMpa, 420);
  const coverCm = asPositiveNumber(raw.coverCm, 4);
  const concreteStrengthMpa = asPositiveNumber(raw.concreteStrengthMpa, 21);
  const stirrupDiameterMm = asPositiveNumber(raw.stirrupDiameterMm, 10);

  if (!spanM || !designLoadKnM || !steelYieldMpa || !coverCm) {
    throw new Error("Entradas de viga incompletas.");
  }

  return {
    spanM,
    supportType: supportType as BeamSupportType,
    designLoadKnM,
    steelYieldMpa,
    coverCm,
    concreteStrengthMpa: concreteStrengthMpa ?? 21,
    stirrupDiameterMm: stirrupDiameterMm ?? 10,
  };
}

function migrateColumnInputs(raw: Record<string, unknown>): ColumnInputs {
  const columnType = raw.columnType;
  const validTypes: ColumnType[] = ["Central", "Perimetral", "Esquina"];
  if (typeof columnType !== "string" || !validTypes.includes(columnType as ColumnType)) {
    throw new Error("Tipo de columna incompatible.");
  }

  const tributaryAreaM2 = asPositiveNumber(raw.tributaryAreaM2);
  const floors = asPositiveNumber(raw.floors);
  const clearHeightM = asPositiveNumber(raw.clearHeightM);
  const effectiveLengthFactor = asPositiveNumber(raw.effectiveLengthFactor, 1);
  const serviceLoadKnM2 = asPositiveNumber(raw.serviceLoadKnM2, 8) ?? 8;
  const concreteStrengthMpa = asPositiveNumber(raw.concreteStrengthMpa, 21) ?? 21;
  const steelYieldMpa = asPositiveNumber(raw.steelYieldMpa, 420) ?? 420;
  const tieDiameterMm = asPositiveNumber(raw.tieDiameterMm, 10) ?? 10;

  if (!tributaryAreaM2 || !floors || !clearHeightM || !effectiveLengthFactor) {
    throw new Error("Entradas de columna incompletas.");
  }

  return {
    tributaryAreaM2,
    floors,
    columnType: columnType as ColumnType,
    serviceLoadKnM2,
    clearHeightM,
    effectiveLengthFactor,
    concreteStrengthMpa,
    steelYieldMpa,
    tieDiameterMm,
  };
}

function migrateSlabInputs(raw: Record<string, unknown>): SlabInputs {
  const slabType = raw.slabType === "ribbed" ? "ribbed" : "solid";
  const supportType =
    raw.supportType === "Simplemente apoyada" || raw.supportType === "Continua"
      ? (raw.supportType as SlabSupportType)
      : "Continua";

  const spanM = asPositiveNumber(raw.spanM);
  const designLoadKnM2 = asPositiveNumber(raw.designLoadKnM2, 8) ?? 8;
  const steelYieldMpa = asPositiveNumber(raw.steelYieldMpa, 420) ?? 420;
  const concreteStrengthMpa = asPositiveNumber(raw.concreteStrengthMpa, 21) ?? 21;
  const coverCm = asPositiveNumber(raw.coverCm, 2) ?? 2;

  if (!spanM) {
    throw new Error("Entradas de losa incompletas.");
  }

  return {
    spanM,
    slabType,
    supportType,
    designLoadKnM2,
    steelYieldMpa,
    concreteStrengthMpa,
    coverCm,
  };
}

function recalculateFromInputs(
  kind: ElementType,
  inputs: Record<string, unknown>,
): CalculationResult {
  if (kind === "beam") {
    return calculateBeam(migrateBeamInputs(inputs));
  }
  if (kind === "column") {
    return calculateColumn(migrateColumnInputs(inputs));
  }
  return calculateSlab(migrateSlabInputs(inputs));
}

function migrateElement(
  raw: unknown,
  report: MigrationReport,
): SavedProjectElement | null {
  if (!isRecord(raw)) {
    return null;
  }

  const label = typeof raw.label === "string" ? raw.label : "sin-etiqueta";
  if (
    typeof raw.id !== "string" ||
    typeof raw.label !== "string" ||
    !isElementType(raw.kind) ||
    (raw.status !== "PASA" && raw.status !== "NO PASA") ||
    typeof raw.savedAt !== "string" ||
    Number.isNaN(Date.parse(raw.savedAt)) ||
    !isRecord(raw.result)
  ) {
    report.droppedLabels.push(label);
    return null;
  }

  const kind = raw.kind;
  const resultRecord = raw.result;
  let result: CalculationResult;
  let calculationVersion =
    typeof raw.calculationVersion === "string"
      ? raw.calculationVersion
      : "legacy";

  try {
    if (needsRecalculation(kind, calculationVersion, resultRecord)) {
      if (!isRecord(resultRecord.inputs)) {
        throw new Error("Sin entradas para recalcular.");
      }
      result = recalculateFromInputs(kind, resultRecord.inputs);
      calculationVersion = CALCULATION_VERSION;
      report.recalculatedLabels.push(label);
    } else {
      result = resultRecord as unknown as CalculationResult;
      calculationVersion = CALCULATION_VERSION;
    }
  } catch {
    report.droppedLabels.push(label);
    return null;
  }

  if (result.kind !== kind) {
    report.droppedLabels.push(label);
    return null;
  }

  return {
    id: raw.id,
    label: raw.label.trim(),
    kind,
    dimension: getDimension(result),
    status: result.compliance.some((criterion) => criterion.status === "fail")
      ? "NO PASA"
      : "PASA",
    savedAt: raw.savedAt,
    calculationVersion: CALCULATION_VERSION,
    result,
  };
}

/**
 * Normaliza proyectos antiguos (schema 0 / resultados previos) al esquema actual.
 * Recalcula elementos con `calculationVersion` u forma de resultado obsoleta.
 */
export function migrateProject(value: unknown): {
  project: LocalProject;
  report: MigrationReport;
} {
  if (!isRecord(value)) {
    throw new Error("El archivo no corresponde a un proyecto PreDim NEC compatible.");
  }

  const fromSchema = detectSchemaVersion(value);
  if (fromSchema < 0 || fromSchema > PROJECT_SCHEMA_VERSION) {
    throw new Error("El archivo no corresponde a un proyecto PreDim NEC compatible.");
  }

  const report: MigrationReport = {
    fromSchema,
    toSchema: PROJECT_SCHEMA_VERSION,
    recalculatedLabels: [],
    droppedLabels: [],
  };

  const metadata = migrateMetadata(value.metadata);
  if (!Array.isArray(value.elements)) {
    throw new Error("La lista de elementos contiene datos incompatibles.");
  }

  const elements = value.elements
    .map((element) => migrateElement(element, report))
    .filter((element): element is SavedProjectElement => element !== null);

  return {
    project: {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      metadata,
      elements,
    },
    report,
  };
}
