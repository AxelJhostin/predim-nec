/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ColumnResult } from "@/calculations";
import { ColumnForm } from "./ColumnForm";

describe("ColumnForm", () => {
  it("calcula una columna y expone φPn / acero", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn<(result: ColumnResult) => void>();

    render(<ColumnForm onCalculate={onCalculate} onSave={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /calcular predimensionamiento/i }),
    );

    const result = onCalculate.mock.calls[0]?.[0];
    expect(result?.kind).toBe("column");
    expect(result?.designAxialResistanceKn).toBeGreaterThan(0);
    expect(result?.longitudinalBarProposal).toMatch(/Ø/);
  });

  it("carga el ejemplo central", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn<(result: ColumnResult) => void>();

    render(<ColumnForm onCalculate={onCalculate} onSave={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Ejemplo Central" }));

    expect(onCalculate.mock.calls[0]?.[0]?.inputs.columnType).toBe("Central");
    expect(onCalculate.mock.calls[0]?.[0]?.inputs.floors).toBe(3);
  });
});
