/** Tipos públicos del dominio de cálculo NEC. */
export type ElementType = "beam" | "column" | "slab";
export type ComplianceStatus = "pass" | "fail" | "not-evaluated";

export interface ComplianceCriterion {
  criterion: string;
  calculated: string;
  limit: string;
  status: ComplianceStatus;
}

export interface CalculationStep {
  title: string;
  detail: string;
  reference?: string;
}

export type BeamSupportType =
  | "Simplemente apoyada"
  | "Un extremo continuo"
  | "Ambos extremos continuos"
  | "Voladizo";

export interface BeamInputs {
  spanM: number;
  supportType: BeamSupportType;
  designLoadKnM: number;
  steelYieldMpa: number;
  coverCm: number;
  concreteStrengthMpa: number;
  stirrupDiameterMm: number;
}

export interface BeamResult {
  kind: "beam";
  inputs: BeamInputs;
  widthCm: number;
  depthCm: number;
  inertiaCm4: number;
  selfWeightKnM: number;
  supportDivisor: number;
  momentDivisor: number;
  shearCoefficient: number;
  minimumDepthCm: number;
  effectiveDepthCm: number;
  /** @deprecated Usar requiredSteelAreaCm2; se mantiene por compatibilidad. */
  estimatedSteelAreaCm2: number;
  requiredSteelAreaCm2: number;
  providedSteelAreaCm2: number;
  steelRatio: number;
  minimumSteelRatio: number;
  maximumSteelRatio: number;
  flexuralBarProposal: string;
  ultimateMomentKnM: number;
  designResistanceKnM: number;
  ultimateShearKn: number;
  concreteShearKn: number;
  requiredShearSteelKn: number;
  stirrupProposal: string;
  stirrupSpacingCm: number;
  capacityAdjusted: boolean;
  minimumApplied: boolean;
  concreteStrengthMpa: number;
  compliance: ComplianceCriterion[];
  procedure: CalculationStep[];
}

export type ColumnType = "Central" | "Perimetral" | "Esquina";

export interface ColumnInputs {
  tributaryAreaM2: number;
  floors: number;
  columnType: ColumnType;
  serviceLoadKnM2: number;
  clearHeightM: number;
  effectiveLengthFactor: number;
  concreteStrengthMpa: number;
  steelYieldMpa: number;
  tieDiameterMm: number;
}

export interface ColumnResult {
  kind: "column";
  inputs: ColumnInputs;
  serviceLoadKn: number;
  ultimateLoadKn: number;
  designAxialResistanceKn: number;
  appliedServiceLoadKnM2: number;
  positionFactor: number;
  areaReductionFactor: number;
  requiredAreaCm2: number;
  sideCm: number;
  grossAreaCm2: number;
  requiredSteelAreaCm2: number;
  providedSteelAreaCm2: number;
  longitudinalBarProposal: string;
  tieProposal: string;
  tieSpacingCm: number;
  slenderness: number;
  steelRatio: number;
  minimumApplied: boolean;
  capacityAdjusted: boolean;
  concreteStrengthMpa: number;
  compliance: ComplianceCriterion[];
  procedure: CalculationStep[];
}

export type SlabSupportType = "Simplemente apoyada" | "Continua";

export interface SlabInputs {
  spanM: number;
  slabType: "solid" | "ribbed";
  supportType: SlabSupportType;
  designLoadKnM2: number;
  steelYieldMpa: number;
  concreteStrengthMpa: number;
  coverCm: number;
}

export interface SlabResult {
  kind: "slab";
  inputs: SlabInputs;
  thicknessCm: number;
  divisor: number;
  momentDivisor: number;
  effectiveDepthCm: number;
  ultimateMomentKnM: number;
  designResistanceKnM: number;
  requiredSteelAreaCm2PerM: number;
  providedSteelAreaCm2PerM: number;
  flexuralBarProposal: string;
  temperatureSteelProposal: string;
  steelRatio: number;
  minimumSteelRatio: number;
  concreteStrengthMpa: number;
  compliance: ComplianceCriterion[];
  procedure: CalculationStep[];
}

export type CalculationResult = BeamResult | ColumnResult | SlabResult;
