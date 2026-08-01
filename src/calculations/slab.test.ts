import { describe, expect, it } from "vitest";
import { calculateSlab } from "./slab";
import type { SlabInputs } from "./types";

const baseInputs: SlabInputs = {
  spanM: 4.5,
  slabType: "solid",
  supportType: "Continua",
  designLoadKnM2: 8,
  steelYieldMpa: 420,
  concreteStrengthMpa: 21,
  coverCm: 2,
};

describe("calculateSlab", () => {
  it("estima espesor, φMn ≥ Mu y acero de temperatura", () => {
    const result = calculateSlab(baseInputs);

    expect(result.kind).toBe("slab");
    expect(result.divisor).toBe(25);
    expect(result.momentDivisor).toBe(11);
    expect(result.thicknessCm).toBeGreaterThanOrEqual(10);
    expect(result.designResistanceKnM).toBeGreaterThanOrEqual(
      result.ultimateMomentKnM,
    );
    expect(result.flexuralBarProposal).toMatch(/Ø\d+ mm @/);
    expect(result.temperatureSteelProposal.length).toBeGreaterThan(0);
    expect(result.compliance.every((item) => item.status === "pass")).toBe(
      true,
    );
  });

  it("usa L/21 para losa nervada", () => {
    const result = calculateSlab({
      ...baseInputs,
      spanM: 6,
      slabType: "ribbed",
      designLoadKnM2: 7,
      coverCm: 2.5,
    });

    expect(result.divisor).toBe(21);
    expect(result.thicknessCm).toBeGreaterThanOrEqual(12);
  });

  it("rechaza recubrimiento inválido", () => {
    expect(() => calculateSlab({ ...baseInputs, coverCm: 0 })).toThrow(
      /mayor que cero/i,
    );
  });
});
