import { describe, expect, it } from "vitest";
import { calculateSection } from "./sections";

describe("calculateSection", () => {
  it("rectángulo 25×40: A, Ix y S conocidos", () => {
    const result = calculateSection({
      shape: "rectangle",
      widthCm: 25,
      heightCm: 40,
    });

    expect(result.areaCm2).toBe(1000);
    expect(result.inertiaXCm4).toBeCloseTo((25 * 40 ** 3) / 12, 5);
    expect(result.sectionModulusTopCm3).toBeCloseTo(result.inertiaXCm4 / 20, 5);
    expect(result.centroidYCm).toBe(20);
  });

  it("círculo usa π D⁴ / 64", () => {
    const D = 30;
    const result = calculateSection({ shape: "circle", diameterCm: D });
    expect(result.areaCm2).toBeCloseTo((Math.PI * D ** 2) / 4, 5);
    expect(result.inertiaXCm4).toBeCloseTo((Math.PI * D ** 4) / 64, 5);
  });

  it("sección T rechaza alma más ancha que el ala", () => {
    expect(() =>
      calculateSection({
        shape: "tee",
        flangeWidthCm: 20,
        flangeThicknessCm: 8,
        webWidthCm: 25,
        webHeightCm: 40,
      }),
    ).toThrow(/alma/i);
  });

  it("sección T devuelve centroide entre base y coronación", () => {
    const result = calculateSection({
      shape: "tee",
      flangeWidthCm: 60,
      flangeThicknessCm: 8,
      webWidthCm: 20,
      webHeightCm: 40,
    });
    expect(result.centroidYCm).toBeGreaterThan(20);
    expect(result.centroidYCm).toBeLessThan(48);
    expect(result.areaCm2).toBe(60 * 8 + 20 * 40);
  });
});
