import { describe, expect, it } from "vitest";
import { calculateBeam } from "@/calculations";
import {
  PROJECT_SCHEMA_VERSION,
  createEmptyProject,
  createSavedElement,
  parseImportedProject,
} from "@/project";

describe("project model", () => {
  it("crea un proyecto vacío con schema vigente", () => {
    const project = createEmptyProject();
    expect(project.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
    expect(project.elements).toEqual([]);
    expect(project.metadata.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("empaqueta un resultado de cálculo como elemento guardado", () => {
    const result = calculateBeam({
      spanM: 5,
      supportType: "Ambos extremos continuos",
      designLoadKnM: 7.5,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: 21,
      stirrupDiameterMm: 10,
    });
    const element = createSavedElement("  V-101  ", result);

    expect(element.label).toBe("V-101");
    expect(element.kind).toBe("beam");
    expect(element.dimension).toMatch(/cm/);
    expect(element.status).toBe("PASA");
    expect(element.calculationVersion).toBe("2026.1");
    expect(element.result.kind).toBe("beam");
  });

  it("parsea un JSON de proyecto válido", () => {
    const result = calculateBeam({
      spanM: 5,
      supportType: "Ambos extremos continuos",
      designLoadKnM: 7.5,
      steelYieldMpa: 420,
      coverCm: 4,
      concreteStrengthMpa: 21,
      stirrupDiameterMm: 10,
    });
    const source = {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      metadata: {
        name: "Demo",
        responsible: "Axel",
        location: "Portoviejo",
        institution: "PUCE",
        date: "2026-08-01",
        notes: "",
      },
      elements: [createSavedElement("V-1", result)],
    };

    const parsed = parseImportedProject(source);
    expect(parsed.metadata.name).toBe("Demo");
    expect(parsed.elements).toHaveLength(1);
    expect(parsed.elements[0]?.label).toBe("V-1");
  });

  it("rechaza schema incompatible", () => {
    expect(() =>
      parseImportedProject({
        schemaVersion: 999,
        metadata: {
          name: "X",
          responsible: "Y",
          location: "Z",
          date: "2026-01-01",
        },
        elements: [],
      }),
    ).toThrow(/compatible/i);
  });
});
