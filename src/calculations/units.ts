import { formatNumber } from "./format";

export type UnitCategory = "length" | "force" | "stress" | "lineLoad" | "areaLoad";

export interface UnitOption {
  id: string;
  label: string;
  /** Factor to SI base of the category. */
  toBase: number;
}

const categories: Record<
  UnitCategory,
  { label: string; baseLabel: string; units: UnitOption[] }
> = {
  length: {
    label: "Longitud",
    baseLabel: "m",
    units: [
      { id: "m", label: "m", toBase: 1 },
      { id: "cm", label: "cm", toBase: 0.01 },
      { id: "mm", label: "mm", toBase: 0.001 },
      { id: "in", label: "in", toBase: 0.0254 },
      { id: "ft", label: "ft", toBase: 0.3048 },
    ],
  },
  force: {
    label: "Fuerza",
    baseLabel: "kN",
    units: [
      { id: "kN", label: "kN", toBase: 1 },
      { id: "N", label: "N", toBase: 0.001 },
      { id: "kgf", label: "kgf", toBase: 0.00980665 },
      { id: "tf", label: "tf (tonelada-fuerza)", toBase: 9.80665 },
      { id: "lbf", label: "lbf", toBase: 0.00444822161526 },
    ],
  },
  stress: {
    label: "Esfuerzo / presión",
    baseLabel: "MPa",
    units: [
      { id: "MPa", label: "MPa (= N/mm²)", toBase: 1 },
      { id: "kPa", label: "kPa", toBase: 0.001 },
      { id: "kgf_cm2", label: "kgf/cm²", toBase: 0.0980665 },
      { id: "psi", label: "psi", toBase: 0.00689475729 },
      { id: "ksf", label: "ksf", toBase: 0.04788025889 },
    ],
  },
  lineLoad: {
    label: "Carga lineal",
    baseLabel: "kN/m",
    units: [
      { id: "kN_m", label: "kN/m", toBase: 1 },
      { id: "N_m", label: "N/m", toBase: 0.001 },
      { id: "kgf_m", label: "kgf/m", toBase: 0.00980665 },
      { id: "plf", label: "lbf/ft", toBase: 0.0145939029 },
    ],
  },
  areaLoad: {
    label: "Carga superficial",
    baseLabel: "kN/m²",
    units: [
      { id: "kN_m2", label: "kN/m²", toBase: 1 },
      { id: "kgf_m2", label: "kgf/m²", toBase: 0.00980665 },
      { id: "psf", label: "psf", toBase: 0.04788025889 },
      { id: "kPa_area", label: "kPa", toBase: 1 },
    ],
  },
};

export function listUnitCategories(): {
  id: UnitCategory;
  label: string;
  baseLabel: string;
}[] {
  return (Object.keys(categories) as UnitCategory[]).map((id) => ({
    id,
    label: categories[id].label,
    baseLabel: categories[id].baseLabel,
  }));
}

export function listUnits(category: UnitCategory): UnitOption[] {
  return categories[category].units;
}

export interface UnitConversionInputs {
  category: UnitCategory;
  value: number;
  fromUnitId: string;
  toUnitId: string;
}

export interface UnitConversionResult {
  kind: "units";
  inputs: UnitConversionInputs;
  result: number;
  fromLabel: string;
  toLabel: string;
  categoryLabel: string;
  formula: string;
  summary: string;
}

export function convertUnits(inputs: UnitConversionInputs): UnitConversionResult {
  if (!Number.isFinite(inputs.value)) {
    throw new Error("Ingresa un valor numérico válido.");
  }

  const category = categories[inputs.category];
  if (!category) {
    throw new Error("Categoría de unidades no válida.");
  }

  const from = category.units.find((unit) => unit.id === inputs.fromUnitId);
  const to = category.units.find((unit) => unit.id === inputs.toUnitId);
  if (!from || !to) {
    throw new Error("Selecciona unidades válidas de la misma categoría.");
  }

  const result = (inputs.value * from.toBase) / to.toBase;
  const formula = `${formatNumber(inputs.value, 6)} ${from.label} × (${formatNumber(from.toBase, 8)} ${category.baseLabel}/${from.label}) ÷ (${formatNumber(to.toBase, 8)} ${category.baseLabel}/${to.label})`;

  return {
    kind: "units",
    inputs,
    result,
    fromLabel: from.label,
    toLabel: to.label,
    categoryLabel: category.label,
    formula,
    summary: `${formatNumber(inputs.value, 4)} ${from.label} = ${formatNumber(result, 6)} ${to.label}`,
  };
}
