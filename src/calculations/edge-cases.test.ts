import { describe, expect, it } from "vitest";
import { calculateBeam } from "./beam";
import { calculateColumn } from "./column";
import { calculateSlab } from "./slab";

describe("casos borde de cálculo", () => {
  it("marca esbeltez NO conforme en columna muy esbelta", () => {
    const result = calculateColumn({
      tributaryAreaM2: 4,
      floors: 1,
      columnType: "Central",
      serviceLoadKnM2: 5,
      clearHeightM: 8,
      effectiveLengthFactor: 2,
      concreteStrengthMpa: 21,
      steelYieldMpa: 420,
      tieDiameterMm: 10,
    });

    const slenderness = result.compliance.find((item) =>
      item.criterion.includes("esbeltez"),
    );
    expect(result.slenderness).toBeGreaterThanOrEqual(40);
    expect(slenderness?.status).toBe("fail");
    expect(result.compliance.some((item) => item.status === "fail")).toBe(true);
  });

  it("voladizo produce Vu = wL y Mu = wL²/2", () => {
    const w = 5;
    const L = 1.5;
    const result = calculateBeam({
      spanM: L,
      supportType: "Voladizo",
      designLoadKnM: w,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: 21,
      stirrupDiameterMm: 10,
    });

    expect(result.shearCoefficient).toBe(1);
    expect(result.ultimateShearKn).toBeCloseTo(w * L, 5);
    expect(result.ultimateMomentKnM).toBeCloseTo((w * L ** 2) / 2, 5);
    expect(result.supportDivisor).toBe(8);
  });

  it("losa simplemente apoyada usa Mu = wL²/8", () => {
    const w = 6;
    const L = 4;
    const result = calculateSlab({
      spanM: L,
      slabType: "solid",
      supportType: "Simplemente apoyada",
      designLoadKnM2: w,
      steelYieldMpa: 420,
      concreteStrengthMpa: 21,
      coverCm: 2,
    });

    expect(result.momentDivisor).toBe(8);
    expect(result.ultimateMomentKnM).toBeCloseTo((w * L ** 2) / 8, 5);
  });

  it("aplica defaults de f'c y estribo cuando vienen inválidos en viga", () => {
    const result = calculateBeam({
      spanM: 5,
      supportType: "Simplemente apoyada",
      designLoadKnM: 8,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: Number.NaN,
      stirrupDiameterMm: -1,
    });

    expect(result.concreteStrengthMpa).toBe(21);
    expect(result.inputs.stirrupDiameterMm).toBe(10);
  });
});
