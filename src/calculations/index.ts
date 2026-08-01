/**
 * Dominio de cálculo PreDim NEC.
 * API pública estable: calculate*, tipos de resultado y formatNumber.
 */
export type {
  ElementType,
  ComplianceStatus,
  ComplianceCriterion,
  CalculationStep,
  BeamSupportType,
  BeamInputs,
  BeamResult,
  ColumnType,
  ColumnInputs,
  ColumnResult,
  SlabSupportType,
  SlabInputs,
  SlabResult,
  CalculationResult,
} from "./types";

export { formatNumber } from "./format";
export { calculateBeam } from "./beam";
export { calculateColumn } from "./column";
export { calculateSlab } from "./slab";

export { calculators, ELEMENT_LABELS } from "./registry";
