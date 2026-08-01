import type { ElementType } from "@/calculations";
import { PROJECT_SCHEMA_VERSION } from "./constants";
import type { LocalProject, SavedProjectElement } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isElementType(value: unknown): value is ElementType {
  return value === "beam" || value === "column" || value === "slab";
}

export function parseImportedProject(value: unknown): LocalProject {
  if (!isRecord(value) || value.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error("El archivo no corresponde a un proyecto PreDim NEC compatible.");
  }

  const metadata = value.metadata;
  const elements = value.elements;

  if (
    !isRecord(metadata) ||
    typeof metadata.name !== "string" ||
    typeof metadata.responsible !== "string" ||
    typeof metadata.location !== "string" ||
    typeof metadata.date !== "string" ||
    !Array.isArray(elements)
  ) {
    throw new Error("Los metadatos del proyecto son inválidos.");
  }

  const validElements = elements.every((element) => {
    if (
      !isRecord(element) ||
      typeof element.id !== "string" ||
      typeof element.label !== "string" ||
      !isElementType(element.kind) ||
      typeof element.dimension !== "string" ||
      (element.status !== "PASA" && element.status !== "NO PASA") ||
      typeof element.savedAt !== "string" ||
      element.calculationVersion !== "2026.1" ||
      !isRecord(element.result) ||
      Number.isNaN(Date.parse(element.savedAt))
    ) {
      return false;
    }

    return element.result.kind === element.kind;
  });

  if (!validElements) {
    throw new Error("La lista de elementos contiene datos incompatibles.");
  }

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    metadata: {
      name: metadata.name,
      responsible: metadata.responsible,
      location: metadata.location,
      institution:
        typeof metadata.institution === "string" ? metadata.institution : "",
      date: metadata.date,
      notes: typeof metadata.notes === "string" ? metadata.notes : "",
    },
    elements: elements as SavedProjectElement[],
  };
}
