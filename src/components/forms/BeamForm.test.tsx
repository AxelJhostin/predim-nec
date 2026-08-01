/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { BeamResult } from "@/calculations";
import { BeamForm } from "./BeamForm";

describe("BeamForm", () => {
  it("calcula al enviar el formulario y entrega un BeamResult", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn<(result: BeamResult) => void>();
    const onSave = vi.fn();

    render(<BeamForm onCalculate={onCalculate} onSave={onSave} />);

    await user.click(
      screen.getByRole("button", { name: /calcular predimensionamiento/i }),
    );

    expect(onCalculate).toHaveBeenCalledTimes(1);
    const result = onCalculate.mock.calls[0]?.[0];
    expect(result?.kind).toBe("beam");
    expect(result?.flexuralBarProposal).toMatch(/Ø/);
    expect(result?.stirrupProposal).toMatch(/Estribos/);
  });

  it("aplica un ejemplo listo y recalcula", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn<(result: BeamResult) => void>();

    render(<BeamForm onCalculate={onCalculate} onSave={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Ejemplo Residencial" }),
    );

    expect(onCalculate).toHaveBeenCalledTimes(1);
    expect(onCalculate.mock.calls[0]?.[0]?.inputs.spanM).toBe(5);
    expect(onCalculate.mock.calls[0]?.[0]?.inputs.supportType).toBe(
      "Ambos extremos continuos",
    );
  });

  it("guarda el elemento con la etiqueta indicada", async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn<(result: BeamResult) => void>();
    const onSave = vi.fn();
    const onOpenProjectSummary = vi.fn();

    render(
      <BeamForm
        onCalculate={onCalculate}
        onSave={onSave}
        onOpenProjectSummary={onOpenProjectSummary}
      />,
    );

    const labelInput = screen.getByPlaceholderText("Ej. V-101");
    await user.clear(labelInput);
    await user.type(labelInput, "V-DEMO");
    await user.click(screen.getByRole("button", { name: /guardar elemento/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0]?.[0]).toBe("V-DEMO");
    expect(onSave.mock.calls[0]?.[1]?.kind).toBe("beam");
    expect(onCalculate).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /ver en resumen/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ver en resumen/i }));
    expect(onOpenProjectSummary).toHaveBeenCalledTimes(1);
    expect(labelInput).toHaveValue("V-DEMO");
  });
});
