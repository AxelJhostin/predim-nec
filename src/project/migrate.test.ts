import { describe, expect, it } from "vitest";
import {
  CALCULATION_VERSION,
  PROJECT_SCHEMA_VERSION,
  parseImportedProjectWithReport,
} from "@/project";

describe("migraciones de proyecto", () => {
  it("migra schema 0 sin schemaVersion y recalcula columna antigua", () => {
    const legacy = {
      metadata: {
        name: "Legacy",
        responsible: "Estudiante",
        location: "Manabí",
        date: "2025-01-10",
      },
      elements: [
        {
          id: "c-old",
          label: "C-LEGACY",
          kind: "column",
          dimension: "30 × 30 cm",
          status: "PASA",
          savedAt: "2025-01-10T12:00:00.000Z",
          calculationVersion: "2025.1",
          result: {
            kind: "column",
            inputs: {
              tributaryAreaM2: 20,
              floors: 3,
              columnType: "Central",
              serviceLoadKnM2: 8,
              clearHeightM: 2.8,
              effectiveLengthFactor: 1,
              longitudinalSteelCm2: 20,
            },
            sideCm: 30,
            // Forma antigua incompleta a propósito.
          },
        },
      ],
    };

    const { project, report } = parseImportedProjectWithReport(legacy);

    expect(project.schemaVersion).toBe(PROJECT_SCHEMA_VERSION);
    expect(project.metadata.institution).toBe("");
    expect(report.fromSchema).toBe(0);
    expect(report.recalculatedLabels).toContain("C-LEGACY");
    expect(project.elements).toHaveLength(1);
    expect(project.elements[0]?.calculationVersion).toBe(CALCULATION_VERSION);
    expect(project.elements[0]?.result).toMatchObject({
      kind: "column",
      ultimateLoadKn: expect.any(Number),
      longitudinalBarProposal: expect.any(String),
      tieProposal: expect.any(String),
    });
  });

  it("migra losa antigua sin campos nuevos recalculando desde inputs", () => {
    const legacy = {
      schemaVersion: 1,
      metadata: {
        name: "Losa vieja",
        responsible: "A",
        location: "B",
        institution: "PUCE",
        date: "2025-06-01",
        notes: "",
      },
      elements: [
        {
          id: "l-old",
          label: "L-OLD",
          kind: "slab",
          dimension: "h = 18 cm",
          status: "PASA",
          savedAt: "2025-06-01T10:00:00.000Z",
          calculationVersion: "2025.1",
          result: {
            kind: "slab",
            inputs: {
              spanM: 4.5,
              slabType: "solid",
              steelYieldMpa: 420,
            },
            thicknessCm: 18,
          },
        },
      ],
    };

    const { project, report } = parseImportedProjectWithReport(legacy);
    expect(report.recalculatedLabels).toContain("L-OLD");
    expect(project.elements[0]?.result).toMatchObject({
      kind: "slab",
      flexuralBarProposal: expect.any(String),
      temperatureSteelProposal: expect.any(String),
    });
  });

  it("descarta elementos irrecuperables y conserva los válidos", () => {
    const mixed = {
      schemaVersion: 1,
      metadata: {
        name: "Mixto",
        responsible: "A",
        location: "B",
        date: "2026-01-01",
      },
      elements: [
        {
          id: "bad",
          label: "BAD",
          kind: "beam",
          dimension: "?",
          status: "PASA",
          savedAt: "2026-01-01T00:00:00.000Z",
          calculationVersion: "2025.1",
          result: {
            kind: "beam",
            // sin inputs → no se puede recalcular
          },
        },
        {
          id: "ok",
          label: "V-OK",
          kind: "beam",
          dimension: "25 × 30 cm",
          status: "PASA",
          savedAt: "2026-01-01T00:00:00.000Z",
          calculationVersion: "2025.1",
          result: {
            kind: "beam",
            inputs: {
              spanM: 5,
              supportType: "Ambos extremos continuos",
              designLoadKnM: 7.5,
              steelYieldMpa: 420,
              coverCm: 4,
              concreteStrengthMpa: 21,
              stirrupDiameterMm: 10,
            },
          },
        },
      ],
    };

    const { project, report } = parseImportedProjectWithReport(mixed);
    expect(report.droppedLabels).toContain("BAD");
    expect(report.recalculatedLabels).toContain("V-OK");
    expect(project.elements.map((element) => element.label)).toEqual(["V-OK"]);
  });

  it("rechaza schema futuro desconocido", () => {
    expect(() =>
      parseImportedProjectWithReport({
        schemaVersion: 99,
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
