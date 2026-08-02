import { describe, expect, it } from "vitest";
import { convertUnits } from "./units";

describe("convertUnits", () => {
  it("convierte 21 MPa a kgf/cm²", () => {
    const result = convertUnits({
      category: "stress",
      value: 21,
      fromUnitId: "MPa",
      toUnitId: "kgf_cm2",
    });
    // 1 MPa ≈ 10.197 kgf/cm²
    expect(result.result).toBeCloseTo(21 / 0.0980665, 3);
    expect(result.toLabel).toContain("kgf/cm²");
  });

  it("convierte metros a centímetros", () => {
    const result = convertUnits({
      category: "length",
      value: 1.5,
      fromUnitId: "m",
      toUnitId: "cm",
    });
    expect(result.result).toBeCloseTo(150, 8);
  });

  it("rechaza unidad fuera de categoría", () => {
    expect(() =>
      convertUnits({
        category: "force",
        value: 10,
        fromUnitId: "kN",
        toUnitId: "MPa",
      }),
    ).toThrow(/unidades válidas/i);
  });
});
