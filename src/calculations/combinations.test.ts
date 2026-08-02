import { describe, expect, it } from "vitest";
import { calculateCombinations } from "./combinations";

describe("calculateCombinations", () => {
  it("gobierna 1.2D+1.6L en vivienda típica", () => {
    const result = calculateCombinations({
      deadLoadKnM2: 5,
      liveLoadKnM2: 2,
    });
    expect(result.governing.id).toBe("1.2D+1.6L");
    expect(result.governing.valueKnM2).toBeCloseTo(1.2 * 5 + 1.6 * 2, 8);
    expect(result.serviceLoadKnM2).toBeCloseTo(7, 8);
  });

  it("gobierna 1.4D cuando L es nula", () => {
    const result = calculateCombinations({
      deadLoadKnM2: 6,
      liveLoadKnM2: 0,
    });
    expect(result.governing.id).toBe("1.4D");
    expect(result.governing.valueKnM2).toBeCloseTo(8.4, 8);
  });

  it("opcionalmente calcula w con ancho tributario", () => {
    const result = calculateCombinations({
      deadLoadKnM2: 5,
      liveLoadKnM2: 2,
      tributaryWidthM: 4,
    });
    expect(result.designLoadKnM).toBeCloseTo(result.governing.valueKnM2 * 4, 8);
  });

  it("rechaza D y L ambas cero", () => {
    expect(() =>
      calculateCombinations({ deadLoadKnM2: 0, liveLoadKnM2: 0 }),
    ).toThrow(/mayor que cero/i);
  });
});
