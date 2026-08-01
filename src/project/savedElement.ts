import { formatNumber, type CalculationResult } from "@/calculations";
import {
  CALCULATION_VERSION,
  PROJECT_SCHEMA_VERSION,
} from "./constants";
import type { LocalProject, SavedProjectElement } from "./types";

export function getDimension(result: CalculationResult) {
  if (result.kind === "beam") {
    return `${formatNumber(result.widthCm)} × ${formatNumber(result.depthCm)} cm`;
  }

  if (result.kind === "column") {
    return `${formatNumber(result.sideCm)} × ${formatNumber(result.sideCm)} cm`;
  }

  return `h = ${formatNumber(result.thicknessCm)} cm`;
}

export function createSavedElement(
  label: string,
  result: CalculationResult,
): SavedProjectElement {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    label: label.trim(),
    kind: result.kind,
    dimension: getDimension(result),
    status: result.compliance.some((criterion) => criterion.status === "fail")
      ? "NO PASA"
      : "PASA",
    savedAt: new Date().toISOString(),
    calculationVersion: CALCULATION_VERSION,
    result,
  };
}

export function createEmptyProject(): LocalProject {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    metadata: {
      name: "",
      responsible: "",
      location: "",
      institution: "",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    },
    elements: [],
  };
}
