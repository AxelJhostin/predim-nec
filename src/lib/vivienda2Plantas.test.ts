import { describe, expect, it } from "vitest";
import { runVivienda2PlantasFlow, VIVIENDA_2P } from "./vivienda2Plantas";

describe("runVivienda2PlantasFlow", () => {
  const flow = runVivienda2PlantasFlow();

  it("usa exactamente 2 pisos y retícula 4×4", () => {
    expect(VIVIENDA_2P.floors).toBe(2);
    expect(flow.tributaryColumn.tributaryAreaM2).toBeCloseTo(16, 8);
  });

  it("combinaciones: gobierna 1.2D+1.6L → q_u = 9.2", () => {
    expect(flow.combinations.governing.id).toBe("1.2D+1.6L");
    expect(flow.qu).toBeCloseTo(9.2, 8);
    expect(flow.serviceLoadKnM2).toBeCloseTo(7, 8);
  });

  it("viga secundaria: w = q_u · bt = 18.4 kN/m", () => {
    expect(flow.wDesign).toBeCloseTo(18.4, 8);
    expect(flow.tributaryBeam.designLoadKnM).toBeCloseTo(18.4, 8);
  });

  it("deflexión usa w de servicio, no q_u", () => {
    expect(flow.wService).toBeCloseTo(14, 8);
    expect(flow.deflection.inputs.designLoadKnM).toBeCloseTo(14, 8);
    expect(flow.deflection.ok).toBe(true);
  });

  it("columna interior Central sin doble conteo de esquina", () => {
    expect(flow.column.inputs.columnType).toBe("Central");
    expect(flow.column.inputs.floors).toBe(2);
    expect(flow.column.sideCm).toBeGreaterThanOrEqual(30);
    expect(flow.column.serviceLoadKn).toBeCloseTo(
      1.1 * 7 * 16 * 2,
      5,
    );
  });

  it("produce secciones y zapata razonables", () => {
    expect(flow.slab.thicknessCm).toBeGreaterThanOrEqual(10);
    // L/21 continua con L=4 m → h mín ≈ 20 cm; ancho constructivo ≥ 25 cm.
    expect(flow.beam.depthCm).toBeGreaterThanOrEqual(20);
    expect(flow.beam.widthCm).toBeGreaterThanOrEqual(25);
    expect(flow.footing.sideCm).toBeGreaterThanOrEqual(100);
    expect(
      flow.footing.compliance.every((item) => item.status !== "fail"),
    ).toBe(true);
  });

  it("deep-links PreDim llevan cargas coherentes", () => {
    expect(flow.links.slab).toContain("tab=slab");
    expect(flow.links.slab).toContain("q=9.2");
    expect(flow.links.beam).toContain("w=18.4");
    expect(flow.links.column).toContain("At=16");
    expect(flow.links.column).toContain("floors=2");
  });
});
