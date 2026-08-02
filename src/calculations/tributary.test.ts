import { describe, expect, it } from "vitest";
import { calculateTributary } from "./tributary";

describe("calculateTributary", () => {
  it("columna interior: At = Lx · Ly", () => {
    const result = calculateTributary({
      target: "column",
      position: "interior",
      bayLxM: 5,
      bayLyM: 4,
    });
    expect(result.tributaryAreaM2).toBeCloseTo(20, 8);
  });

  it("columna esquina: At = 0.5 Lx · 0.5 Ly", () => {
    const result = calculateTributary({
      target: "column",
      position: "corner",
      bayLxM: 5,
      bayLyM: 4,
      serviceLoadKnM2: 8,
    });
    expect(result.tributaryAreaM2).toBeCloseTo(5, 8);
    expect(result.serviceLoadKn).toBeCloseTo(40, 8);
  });

  it("viga: w = q_u · bt", () => {
    const result = calculateTributary({
      target: "beam",
      tributaryWidthM: 4,
      spanM: 6,
      designLoadKnM2: 10,
    });
    expect(result.designLoadKnM).toBeCloseTo(40, 8);
    expect(result.tributaryAreaM2).toBeCloseTo(24, 8);
  });

  it("rechaza vanos no positivos", () => {
    expect(() =>
      calculateTributary({
        target: "column",
        position: "interior",
        bayLxM: 0,
        bayLyM: 4,
      }),
    ).toThrow(/mayor que cero/i);
  });
});
