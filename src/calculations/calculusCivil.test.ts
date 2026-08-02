import { describe, expect, it } from "vitest";
import { calculateCalculus } from "./calculusCivil";

describe("calculateCalculus", () => {
  it("deriva polinomio a + bx + cx²", () => {
    const result = calculateCalculus({
      mode: "derivative",
      preset: "poly2",
      a: 3,
      b: 2,
      c: 1,
      d: 0,
    });
    expect(result.resultExpression).toContain("2");
    expect(result.procedure.length).toBeGreaterThanOrEqual(2);
  });

  it("integra x² de 0 a 1 → 1/3", () => {
    const result = calculateCalculus({
      mode: "integral",
      preset: "power",
      a: 1,
      b: 2,
      c: 0,
      d: 0,
      definite: true,
      lower: 0,
      upper: 1,
    });
    expect(result.numericValue).toBeCloseTo(1 / 3, 8);
  });

  it("rechaza ∫ x⁻¹", () => {
    expect(() =>
      calculateCalculus({
        mode: "integral",
        preset: "power",
        a: 1,
        b: -1,
        c: 0,
        d: 0,
        definite: false,
      }),
    ).toThrow(/ln/i);
  });

  it("centroide de triángulo: ȳ = h/3", () => {
    const result = calculateCalculus({
      mode: "civil",
      civilCase: "triangle-centroid",
      baseM: 6,
      heightM: 3,
    });
    expect(result.numericValue).toBeCloseTo(1, 8);
    expect(result.resultExpression).toMatch(/ȳ = 1/);
  });

  it("inercia rectángulo en la base: bh³/3", () => {
    const result = calculateCalculus({
      mode: "civil",
      civilCase: "rectangle-inertia-base",
      baseM: 0.25,
      heightM: 0.4,
    });
    expect(result.numericValue).toBeCloseTo((0.25 * 0.4 ** 3) / 3, 8);
  });
});
