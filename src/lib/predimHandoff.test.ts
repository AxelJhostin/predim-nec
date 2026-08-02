import { describe, expect, it } from "vitest";
import {
  buildPredimHref,
  parsePredimHandoff,
} from "./predimHandoff";

describe("predimHandoff", () => {
  it("construye URL de viga con w y L", () => {
    const href = buildPredimHref({
      tab: "beam",
      designLoadKnM: 36.8,
      spanM: 6,
      source: "tributarias",
    });
    expect(href).toContain("tab=beam");
    expect(href).toContain("w=36.8");
    expect(href).toContain("L=6");
    expect(href).toContain("from=tributarias");
  });

  it("parsea alias de columna", () => {
    const handoff = parsePredimHandoff(
      new URLSearchParams("tab=column&At=20&q=8&floors=2"),
    );
    expect(handoff.tab).toBe("column");
    expect(handoff.column.tributaryAreaM2).toBe(20);
    expect(handoff.column.serviceLoadKnM2).toBe(8);
    expect(handoff.column.floors).toBe(2);
    expect(handoff.applied).toBe(true);
  });

  it("parsea losa con q como designLoadKnM2", () => {
    const handoff = parsePredimHandoff(
      new URLSearchParams("tab=slab&q=9.2&L=5"),
    );
    expect(handoff.slab.designLoadKnM2).toBe(9.2);
    expect(handoff.slab.spanM).toBe(5);
  });

  it("sin cargas marca applied=false pero respeta tab", () => {
    const handoff = parsePredimHandoff(new URLSearchParams("tab=viga"));
    expect(handoff.tab).toBe("beam");
    expect(handoff.applied).toBe(false);
  });
});
