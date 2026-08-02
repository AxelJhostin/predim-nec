import { describe, expect, it } from "vitest";
import { calculateFooting } from "./footing";

describe("calculateFooting", () => {
  it("dimensiona zapata cuadrada con qa típica", () => {
    const result = calculateFooting({
      serviceLoadKn: 800,
      allowablePressureKnM2: 200,
      columnSideCm: 40,
      concreteStrengthMpa: 21,
      steelYieldMpa: 420,
      coverCm: 7.5,
    });

    expect(result.requiredAreaM2).toBeCloseTo(4, 5);
    expect(result.sideCm).toBeGreaterThanOrEqual(200);
    expect(result.thicknessCm).toBeGreaterThanOrEqual(30);
    expect(result.servicePressureKnM2).toBeLessThanOrEqual(200 * 1.001);
    expect(result.flexuralBarProposal).toMatch(/Ø/);
  });

  it("aumenta espesor si el voladizo es grande", () => {
    const result = calculateFooting({
      serviceLoadKn: 1200,
      ultimateLoadKn: 1600,
      allowablePressureKnM2: 150,
      columnSideCm: 35,
      concreteStrengthMpa: 21,
      steelYieldMpa: 420,
      coverCm: 7.5,
    });

    expect(result.thicknessCm).toBeGreaterThanOrEqual(30);
    expect(
      result.compliance.every((item) => item.status !== "fail"),
    ).toBe(true);
  });

  it("rechaza qa no positiva", () => {
    expect(() =>
      calculateFooting({
        serviceLoadKn: 500,
        allowablePressureKnM2: 0,
        columnSideCm: 40,
        concreteStrengthMpa: 21,
        steelYieldMpa: 420,
        coverCm: 7.5,
      }),
    ).toThrow(/mayor que cero/i);
  });
});
