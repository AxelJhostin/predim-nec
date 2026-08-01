import { calculateBeam } from "./beam";
import { calculateColumn } from "./column";
import { calculateSlab } from "./slab";
import type { ElementType } from "./types";

export const ELEMENT_LABELS: Record<ElementType, string> = {
  beam: "Viga",
  column: "Columna",
  slab: "Losa",
};

/**
 * Registro de calculadoras por tipo de elemento.
 * Para añadir un módulo nuevo: crear `*.ts`, exportarlo en `index.ts`
 * y registrarlo aquí.
 */
export const calculators = {
  beam: calculateBeam,
  column: calculateColumn,
  slab: calculateSlab,
} as const;
