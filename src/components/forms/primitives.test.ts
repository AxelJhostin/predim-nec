import { describe, expect, it } from "vitest";
import { suggestNextLabel } from "./primitives";

describe("suggestNextLabel", () => {
  it("incrementa el sufijo numérico", () => {
    expect(suggestNextLabel("V-101")).toBe("V-102");
    expect(suggestNextLabel("C-09")).toBe("C-10");
  });

  it("deja igual etiquetas sin número final", () => {
    expect(suggestNextLabel("VIGA-A")).toBe("VIGA-A");
  });
});
