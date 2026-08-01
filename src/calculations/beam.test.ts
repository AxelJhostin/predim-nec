import { describe, expect, it } from "vitest";
import { calculateBeam } from "./beam";
import type { BeamInputs } from "./types";

const baseInputs: BeamInputs = {
  spanM: 5,
  supportType: "Ambos extremos continuos",
  designLoadKnM: 7.5,
  steelYieldMpa: 420,
  coverCm: 4,
  concreteStrengthMpa: 21,
  stirrupDiameterMm: 10,
};

describe("calculateBeam", () => {
  it("devuelve sección, acero y cumplimiento sin fallos en caso típico", () => {
    const result = calculateBeam(baseInputs);

    expect(result.kind).toBe("beam");
    expect(result.widthCm).toBeGreaterThanOrEqual(25);
    expect(result.depthCm).toBeGreaterThan(0);
    expect(result.designResistanceKnM).toBeGreaterThanOrEqual(
      result.ultimateMomentKnM,
    );
    expect(result.flexuralBarProposal).toMatch(/\d+ Ø\d+ mm/);
    expect(result.stirrupProposal).toMatch(/Estribos/);
    expect(result.compliance.every((item) => item.status === "pass")).toBe(
      true,
    );
    expect(result.procedure.length).toBeGreaterThanOrEqual(4);
  });

  it("usa divisor de voladizo L/8 y demanda Mu = wL²/2", () => {
    const result = calculateBeam({
      ...baseInputs,
      spanM: 2,
      supportType: "Voladizo",
      designLoadKnM: 6,
    });

    expect(result.supportDivisor).toBe(8);
    expect(result.momentDivisor).toBe(2);
    expect(result.ultimateMomentKnM).toBeCloseTo((6 * 2 ** 2) / 2, 5);
  });

  it("rechaza luz no positiva", () => {
    expect(() => calculateBeam({ ...baseInputs, spanM: 0 })).toThrow(
      /mayor que cero/i,
    );
  });
});
