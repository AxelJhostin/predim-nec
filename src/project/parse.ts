import { migrateProject, type MigrationReport } from "./migrate";
import type { LocalProject } from "./types";

export type { MigrationReport };

/**
 * Importa/hidrata un proyecto: migra esquemas antiguos y normaliza resultados.
 */
export function parseImportedProject(value: unknown): LocalProject {
  return migrateProject(value).project;
}

/**
 * Igual que `parseImportedProject`, pero expone el reporte de migración.
 */
export function parseImportedProjectWithReport(value: unknown): {
  project: LocalProject;
  report: MigrationReport;
} {
  return migrateProject(value);
}
