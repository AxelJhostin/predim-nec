"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CalculationResult } from "@/calculations";
import {
  PROJECT_STORAGE_KEY,
  createEmptyProject,
  createSavedElement,
  parseImportedProject,
  type LocalProject,
  type ProjectMetadata,
} from "@/project";

export {
  PROJECT_STORAGE_KEY,
  PROJECT_SCHEMA_VERSION,
  CALCULATION_VERSION,
  getDimension,
  createSavedElement,
  createEmptyProject,
  parseImportedProject,
  parseImportedProjectWithReport,
  migrateProject,
} from "@/project";
export type {
  ProjectMetadata,
  SavedProjectElement,
  LocalProject,
  MigrationReport,
} from "@/project";

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

        const savedElement = createSavedElement(normalizedLabel, result);

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
