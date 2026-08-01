import { describe, expect, it } from "vitest";
import { calculateColumn } from "./column";
import type { ColumnInputs } from "./types";

const baseInputs: ColumnInputs = {
  tributaryAreaM2: 20,
  floors: 3,
  columnType: "Central",
  serviceLoadKnM2: 8,
  clearHeightM: 2.8,
  effectiveLengthFactor: 1,
  concreteStrengthMpa: 21,
  steelYieldMpa: 420,
  tieDiameterMm: 10,
};

describe("calculateColumn", () => {
  it("propone sección ≥ 30 cm con φPn ≥ Pu y cuantía entre 1% y 3%", () => {
    const result = calculateColumn(baseInputs);

    expect(result.kind).toBe("column");
    expect(result.sideCm).toBeGreaterThanOrEqual(30);
    expect(result.designAxialResistanceKn).toBeGreaterThanOrEqual(
      result.ultimateLoadKn,
    );
    expect(result.steelRatio).toBeGreaterThanOrEqual(0.01);
    expect(result.steelRatio).toBeLessThanOrEqual(0.03);
    expect(result.longitudinalBarProposal).toMatch(/\d+ Ø\d+ mm/);
    expect(result.tieProposal).toMatch(/Estribos/);
    expect(result.compliance.every((item) => item.status === "pass")).toBe(
      true,
    );
  });

  it("aplica Pu ≈ 1.2 × Pservicio", () => {
    const result = calculateColumn(baseInputs);
    expect(result.ultimateLoadKn).toBeCloseTo(1.2 * result.serviceLoadKn, 5);
  });

  it("rechaza área tributaria inválida", () => {
    expect(() =>
      calculateColumn({ ...baseInputs, tributaryAreaM2: -1 }),
    ).toThrow(/mayor que cero/i);
  });
});
