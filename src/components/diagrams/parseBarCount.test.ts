import { describe, expect, it } from "vitest";
import { parseBarCount } from "./parseBarCount";

describe("parseBarCount", () => {
  it("lee conteo al inicio de la propuesta", () => {
    expect(parseBarCount("6 Ø16 mm")).toBe(6);
    expect(parseBarCount("4Ø12 mm")).toBe(4);
  });

  it("usa fallback si no hay conteo (malla / espaciamiento)", () => {
    expect(parseBarCount("Ø10 mm @ 20 cm", 4)).toBe(4);
    expect(parseBarCount("", 6)).toBe(6);
  });

  it("acota conteos extremos", () => {
    expect(parseBarCount("20 Ø25 mm")).toBe(16);
    expect(parseBarCount("0 Ø10 mm", 4)).toBe(4);
  });
});
