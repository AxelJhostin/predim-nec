import type { CalculationResult, ElementType } from "@/calculations";
import {
  CALCULATION_VERSION,
  PROJECT_SCHEMA_VERSION,
} from "./constants";

export interface ProjectMetadata {
  name: string;
  responsible: string;
  location: string;
  institution: string;
  date: string;
  notes: string;
}

export interface SavedProjectElement {
  id: string;
  label: string;
  kind: ElementType;
  dimension: string;
  status: "PASA" | "NO PASA";
  savedAt: string;
  calculationVersion: typeof CALCULATION_VERSION;
  result: CalculationResult;
}

export interface LocalProject {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  metadata: ProjectMetadata;
  elements: SavedProjectElement[];
}
