"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatNumber,
  type CalculationResult,
  type ElementType,
} from "@/utils/necCalculations";

export const PROJECT_STORAGE_KEY = "predim_nec_active_project";
export const PROJECT_SCHEMA_VERSION = 1;

export interface ProjectMetadata {
  name: string;
  responsible: string;
  location: string;
  date: string;
}

export interface SavedProjectElement {
  id: string;
  label: string;
  kind: ElementType;
  dimension: string;
  status: "PASA" | "NO PASA";
  savedAt: string;
  calculationVersion: "2026.1";
  result: CalculationResult;
}

export interface LocalProject {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  metadata: ProjectMetadata;
  elements: SavedProjectElement[];
}

interface ProjectContextValue {
  project: LocalProject;
  isHydrated: boolean;
  updateMetadata: (field: keyof ProjectMetadata, value: string) => void;
  addElement: (label: string, result: CalculationResult) => void;
  renameElement: (id: string, label: string) => void;
  removeElement: (id: string) => void;
  replaceProject: (project: LocalProject) => void;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyProject(): LocalProject {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    metadata: {
      name: "",
      responsible: "",
      location: "",
      date: today(),
    },
    elements: [],
  };
}

function getDimension(result: CalculationResult) {
  if (result.kind === "beam") {
    return `${formatNumber(result.widthCm)} × ${formatNumber(result.depthCm)} cm`;
  }

  if (result.kind === "column") {
    return `${formatNumber(result.sideCm)} × ${formatNumber(result.sideCm)} cm`;
  }

  return `h = ${formatNumber(result.thicknessCm)} cm`;
}

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

  return value as unknown as LocalProject;
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<LocalProject>(createEmptyProject);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      try {
        const storedProject = window.localStorage.getItem(PROJECT_STORAGE_KEY);
        if (storedProject) {
          setProject(parseImportedProject(JSON.parse(storedProject)));
        }
      } catch {
        window.localStorage.removeItem(PROJECT_STORAGE_KEY);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project));
    } catch {
      // The project remains usable in memory if storage is unavailable or full.
    }
  }, [isHydrated, project]);

  const value = useMemo<ProjectContextValue>(
    () => ({
      project,
      isHydrated,
      updateMetadata(field, fieldValue) {
        setProject((current) => ({
          ...current,
          metadata: { ...current.metadata, [field]: fieldValue },
        }));
      },
      addElement(label, result) {
        const normalizedLabel = label.trim();
        if (!normalizedLabel) {
          throw new Error("Ingresa una etiqueta para guardar el elemento.");
        }

        const savedElement: SavedProjectElement = {
          id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
          label: normalizedLabel,
          kind: result.kind,
          dimension: getDimension(result),
          status: result.compliance.some((criterion) => criterion.status === "fail")
            ? "NO PASA"
            : "PASA",
          savedAt: new Date().toISOString(),
          calculationVersion: "2026.1",
          result,
        };

        setProject((current) => ({
          ...current,
          elements: [...current.elements, savedElement],
        }));
      },
      renameElement(id, label) {
        const normalizedLabel = label.trim();
        if (!normalizedLabel) {
          return;
        }

        setProject((current) => ({
          ...current,
          elements: current.elements.map((element) =>
            element.id === id ? { ...element, label: normalizedLabel } : element,
          ),
        }));
      },
      removeElement(id) {
        setProject((current) => ({
          ...current,
          elements: current.elements.filter((element) => element.id !== id),
        }));
      },
      replaceProject(importedProject) {
        setProject(importedProject);
      },
      clearProject() {
        setProject(createEmptyProject());
      },
    }),
    [isHydrated, project],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject debe utilizarse dentro de ProjectProvider.");
  }
  return context;
}
