import { describe, expect, it } from "vitest";
import { calculateDeflection } from "./deflection";

describe("calculateDeflection", () => {
  it("calcula δ de viga simplemente apoyada", () => {
    const result = calculateDeflection({
      spanM: 6,
      designLoadKnM: 10,
      widthCm: 25,
      depthCm: 45,
      supportType: "simple",
      concreteStrengthMpa: 21,
      limitRatio: 240,
    });

    expect(result.deflectionMm).toBeGreaterThan(0);
    expect(result.limitMm).toBeCloseTo(6000 / 240, 5);
    expect(result.coefficient).toBeCloseTo(5 / 384, 8);
  });

  it("voladizo deflexiona más que apoyo simple con mismos datos", () => {
    const base = {
      spanM: 3,
      designLoadKnM: 8,
      widthCm: 25,
      depthCm: 40,
      concreteStrengthMpa: 21,
      limitRatio: 180,
    };
    const simple = calculateDeflection({ ...base, supportType: "simple" });
    const cantilever = calculateDeflection({
      ...base,
      supportType: "cantilever",
    });
    expect(cantilever.deflectionMm).toBeGreaterThan(simple.deflectionMm);
  });

  it("rechaza luz no positiva", () => {
    expect(() =>
      calculateDeflection({
        spanM: 0,
        designLoadKnM: 5,
        widthCm: 25,
        depthCm: 40,
        supportType: "simple",
        concreteStrengthMpa: 21,
      }),
    ).toThrow(/mayor que cero/i);
  });
});
