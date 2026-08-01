import { formatNumber } from "./format";

export const CONCRETE_UNIT_WEIGHT_KN_M3 = 24;
export const FLEXURE_PHI = 0.9;
export const SHEAR_PHI = 0.75;
export const DEFAULT_SERVICE_LOAD_KN_M2 = 8;
export const DEFAULT_FC_MPA = 21;
export const DEFAULT_STIRRUP_DIAMETER_MM = 10;
export const BAR_DIAMETERS_MM = [12, 14, 16, 18, 20, 22, 25] as const;

export function roundUpToFive(value: number) {
  return Math.ceil(value / 5) * 5;
}

export function roundUpToHalf(value: number) {
  return Math.ceil(value * 2) / 2;
}

export function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} debe ser mayor que cero.`);
  }
}

export function barAreaMm2(diameterMm: number) {
  return (Math.PI * diameterMm ** 2) / 4;
}

export function beta1(fcMpa: number) {
  if (fcMpa <= 28) {
    return 0.85;
  }
  return Math.max(0.65, 0.85 - (0.05 * (fcMpa - 28)) / 7);
}

export function flexuralCapacityKnM(
  asMm2: number,
  widthMm: number,
  depthMm: number,
  fyMpa: number,
  fcMpa: number,
) {
  const aMm = (asMm2 * fyMpa) / (0.85 * fcMpa * widthMm);
  const nominalMomentNmm = asMm2 * fyMpa * (depthMm - aMm / 2);
  return (FLEXURE_PHI * nominalMomentNmm) / 1_000_000;
}

export { formatNumber };
