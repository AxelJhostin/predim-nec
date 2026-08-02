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
export {
  calculateSection,
  type SectionShape,
  type SectionInputs,
  type SectionResult,
} from "./sections";
export {
  convertUnits,
  listUnitCategories,
  listUnits,
  type UnitCategory,
  type UnitConversionInputs,
  type UnitConversionResult,
} from "./units";
export {
  calculateTributary,
  type TributaryTarget,
  type ColumnBayPosition,
  type TributaryInputs,
  type TributaryResult,
} from "./tributary";
export {
  calculateCombinations,
  type CombinationId,
  type CombinationInputs,
  type CombinationResult,
} from "./combinations";
export {
  calculateFooting,
  type FootingInputs,
  type FootingResult,
} from "./footing";
export {
  calculateDeflection,
  type DeflectionSupport,
  type DeflectionInputs,
  type DeflectionResult,
} from "./deflection";
export {
  calculateCalculus,
  listFunctionPresets,
  listCivilCases,
  type CalculusMode,
  type FunctionPresetId,
  type CivilCaseId,
  type CalculusInputs,
  type CalculusResult,
  type CalculusCivilInputs,
} from "./calculusCivil";
