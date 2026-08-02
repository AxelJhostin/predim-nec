import { formatNumber } from "./format";

export type CalculusMode = "derivative" | "integral" | "civil";

export type FunctionPresetId =
  | "poly2"
  | "poly3"
  | "power"
  | "sin"
  | "cos"
  | "exp";

export type CivilCaseId =
  | "triangle-centroid"
  | "rectangle-centroid"
  | "rectangle-inertia-base";

export interface CalculusDerivativeInputs {
  mode: "derivative";
  preset: FunctionPresetId;
  /** Coeficientes según preset (ver docs en listFunctionPresets). */
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface CalculusIntegralInputs {
  mode: "integral";
  preset: FunctionPresetId;
  a: number;
  b: number;
  c: number;
  d: number;
  definite: boolean;
  lower?: number;
  upper?: number;
}

export interface CalculusCivilInputs {
  mode: "civil";
  civilCase: CivilCaseId;
  baseM: number;
  heightM: number;
}

export type CalculusInputs =
  | CalculusDerivativeInputs
  | CalculusIntegralInputs
  | CalculusCivilInputs;

export interface CalculusResult {
  kind: "calculus";
  mode: CalculusMode;
  expression: string;
  resultExpression: string;
  numericValue: number | null;
  summary: string;
  tip: string;
  procedure: { title: string; detail: string }[];
}

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} debe ser un número válido.`);
  }
}

function fmt(value: number, digits = 4) {
  return formatNumber(value, digits);
}

function term(coef: number, body: string, isFirst = false): string {
  if (Math.abs(coef) < 1e-12) {
    return "";
  }
  const abs = Math.abs(coef);
  const sign = coef < 0 ? " − " : isFirst ? "" : " + ";
  const gap = body && abs !== 1 ? "·" : "";
  if (isFirst) {
    if (coef < 0) {
      return body ? `−${abs === 1 ? "" : fmt(abs)}${gap}${body}` : `−${fmt(abs)}`;
    }
    return body ? `${abs === 1 ? "" : fmt(abs)}${gap}${body}` : fmt(abs);
  }
  if (!body) {
    return `${sign}${fmt(abs)}`;
  }
  return `${sign}${abs === 1 ? "" : fmt(abs)}${gap}${body}`;
}

function polyExpression(a0: number, a1: number, a2: number, a3 = 0) {
  const parts = [
    term(a3, "x³", true),
    term(a2, "x²", !a3),
    term(a1, "x", !a3 && !a2),
    term(a0, "", !a3 && !a2 && !a1),
  ].filter(Boolean);
  return parts.length ? parts.join("").replace(/^\+ /, "") : "0";
}

export function listFunctionPresets(): {
  id: FunctionPresetId;
  label: string;
  hint: string;
}[] {
  return [
    {
      id: "poly2",
      label: "Polinomio grado 2",
      hint: "f(x) = a + b·x + c·x²",
    },
    {
      id: "poly3",
      label: "Polinomio grado 3",
      hint: "f(x) = a + b·x + c·x² + d·x³",
    },
    {
      id: "power",
      label: "Potencia",
      hint: "f(x) = a·x^b  (b ≠ −1 en integral)",
    },
    {
      id: "sin",
      label: "Seno",
      hint: "f(x) = a·sen(b·x)",
    },
    {
      id: "cos",
      label: "Coseno",
      hint: "f(x) = a·cos(b·x)",
    },
    {
      id: "exp",
      label: "Exponencial",
      hint: "f(x) = a·e^(b·x)",
    },
  ];
}

export function listCivilCases(): {
  id: CivilCaseId;
  label: string;
  hint: string;
}[] {
  return [
    {
      id: "triangle-centroid",
      label: "Centroide de triángulo rectángulo",
      hint: "Base b, altura h — ȳ = h/3 desde la base",
    },
    {
      id: "rectangle-centroid",
      label: "Centroide de rectángulo",
      hint: "b × h — centroide en el centro geométrico",
    },
    {
      id: "rectangle-inertia-base",
      label: "Inercia de rectángulo (eje base)",
      hint: "Ix,base = b·h³/3 por integración",
    },
  ];
}

function describeFunction(
  preset: FunctionPresetId,
  a: number,
  b: number,
  c: number,
  d: number,
): string {
  switch (preset) {
    case "poly2":
      return polyExpression(a, b, c, 0);
    case "poly3":
      return polyExpression(a, b, c, d);
    case "power":
      return `${fmt(a)}·x^${fmt(b)}`;
    case "sin":
      return `${fmt(a)}·sen(${fmt(b)}·x)`;
    case "cos":
      return `${fmt(a)}·cos(${fmt(b)}·x)`;
    case "exp":
      return `${fmt(a)}·e^(${fmt(b)}·x)`;
  }
}

function differentiate(
  preset: FunctionPresetId,
  a: number,
  b: number,
  c: number,
  d: number,
): { expression: string; procedure: CalculusResult["procedure"] } {
  const f = describeFunction(preset, a, b, c, d);
  switch (preset) {
    case "poly2": {
      // (a + bx + cx²)' = b + 2c x
      const result = polyExpression(b, 2 * c, 0, 0);
      return {
        expression: result,
        procedure: [
          {
            title: "1. Función",
            detail: `f(x) = ${f}.`,
          },
          {
            title: "2. Regla de potencias",
            detail: `d/dx[k·xⁿ] = k·n·xⁿ⁻¹. Constante → 0; b·x → b; c·x² → 2c·x.`,
          },
          {
            title: "3. Resultado",
            detail: `f'(x) = ${result}.`,
          },
        ],
      };
    }
    case "poly3": {
      const result = polyExpression(b, 2 * c, 3 * d, 0);
      return {
        expression: result,
        procedure: [
          {
            title: "1. Función",
            detail: `f(x) = ${f}.`,
          },
          {
            title: "2. Término a término",
            detail: `a→0; b·x→b; c·x²→2c·x; d·x³→3d·x².`,
          },
          {
            title: "3. Resultado",
            detail: `f'(x) = ${result}.`,
          },
        ],
      };
    }
    case "power": {
      if (Math.abs(a) < 1e-12) {
        return {
          expression: "0",
          procedure: [
            {
              title: "1. Función nula",
              detail: "Si a = 0, f(x) = 0 y f'(x) = 0.",
            },
          ],
        };
      }
      const newPower = b - 1;
      const coef = a * b;
      const expression =
        Math.abs(newPower) < 1e-12
          ? fmt(coef)
          : `${fmt(coef)}·x^${fmt(newPower)}`;
      return {
        expression,
        procedure: [
          {
            title: "1. Función",
            detail: `f(x) = ${f}.`,
          },
          {
            title: "2. Regla de potencias",
            detail: `d/dx[a·xⁿ] = a·n·xⁿ⁻¹ = ${fmt(a)}·${fmt(b)}·x^${fmt(newPower)}.`,
          },
          {
            title: "3. Resultado",
            detail: `f'(x) = ${expression}.`,
          },
        ],
      };
    }
    case "sin": {
      if (Math.abs(b) < 1e-12) {
        return {
          expression: "0",
          procedure: [
            {
              title: "1. Seno constante",
              detail: "Si b = 0, sen(0)=0 (o constante 0·x) → derivada 0.",
            },
          ],
        };
      }
      const expression = `${fmt(a * b)}·cos(${fmt(b)}·x)`;
      return {
        expression,
        procedure: [
          {
            title: "1. Función",
            detail: `f(x) = ${f}.`,
          },
          {
            title: "2. Cadena",
            detail: `d/dx[sen(u)] = cos(u)·u' con u = ${fmt(b)}·x → u' = ${fmt(b)}.`,
          },
          {
            title: "3. Resultado",
            detail: `f'(x) = ${expression}.`,
          },
        ],
      };
    }
    case "cos": {
      if (Math.abs(b) < 1e-12) {
        return {
          expression: "0",
          procedure: [
            {
              title: "1. Coseno constante",
              detail: "Si b = 0, cos(0·x)=1 (constante si a·1) → derivada 0 del argumento nulo; aquí f'=0 si b=0.",
            },
          ],
        };
      }
      const expression = `${fmt(-a * b)}·sen(${fmt(b)}·x)`;
      return {
        expression,
        procedure: [
          {
            title: "1. Función",
            detail: `f(x) = ${f}.`,
          },
          {
            title: "2. Cadena",
            detail: `d/dx[cos(u)] = −sen(u)·u' con u = ${fmt(b)}·x.`,
          },
          {
            title: "3. Resultado",
            detail: `f'(x) = ${expression}.`,
          },
        ],
      };
    }
    case "exp": {
      if (Math.abs(b) < 1e-12) {
        return {
          expression: "0",
          procedure: [
            {
              title: "1. Exponencial constante",
              detail: "e^0 = 1 → f(x)=a (constante) → f'(x)=0.",
            },
          ],
        };
      }
      const expression = `${fmt(a * b)}·e^(${fmt(b)}·x)`;
      return {
        expression,
        procedure: [
          {
            title: "1. Función",
            detail: `f(x) = ${f}.`,
          },
          {
            title: "2. Cadena",
            detail: `d/dx[e^u] = e^u·u' con u = ${fmt(b)}·x → u' = ${fmt(b)}.`,
          },
          {
            title: "3. Resultado",
            detail: `f'(x) = ${expression}.`,
          },
        ],
      };
    }
  }
}

function antiderivativePoly(a0: number, a1: number, a2: number, a3: number) {
  // ∫ (a0 + a1 x + a2 x² + a3 x³) = a0 x + a1/2 x² + a2/3 x³ + a3/4 x⁴ + C
  const parts: string[] = [];
  if (Math.abs(a0) > 1e-12) {
    parts.push(term(a0, "x", parts.length === 0));
  }
  if (Math.abs(a1) > 1e-12) {
    parts.push(term(a1 / 2, "x²", parts.length === 0));
  }
  if (Math.abs(a2) > 1e-12) {
    parts.push(term(a2 / 3, "x³", parts.length === 0));
  }
  if (Math.abs(a3) > 1e-12) {
    parts.push(term(a3 / 4, "x⁴", parts.length === 0));
  }
  const body = parts.filter(Boolean).join("") || "0";
  return `${body} + C`;
}

function evaluateAntiderivPoly(
  x: number,
  a0: number,
  a1: number,
  a2: number,
  a3: number,
) {
  return a0 * x + (a1 / 2) * x ** 2 + (a2 / 3) * x ** 3 + (a3 / 4) * x ** 4;
}

function integrate(
  preset: FunctionPresetId,
  a: number,
  b: number,
  c: number,
  d: number,
  definite: boolean,
  lower: number,
  upper: number,
): {
  expression: string;
  numericValue: number | null;
  procedure: CalculusResult["procedure"];
} {
  const f = describeFunction(preset, a, b, c, d);

  if (definite) {
    assertFinite(lower, "El límite inferior");
    assertFinite(upper, "El límite superior");
  }

  switch (preset) {
    case "poly2":
    case "poly3": {
      const a3 = preset === "poly3" ? d : 0;
      const F = antiderivativePoly(a, b, c, a3);
      const procedure: CalculusResult["procedure"] = [
        {
          title: "1. Función",
          detail: `f(x) = ${f}.`,
        },
        {
          title: "2. Integral término a término",
          detail: `∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n≠−1). Así ∫f = ${F}.`,
        },
      ];
      if (!definite) {
        return { expression: F, numericValue: null, procedure };
      }
      const Fu = evaluateAntiderivPoly(upper, a, b, c, a3);
      const Fl = evaluateAntiderivPoly(lower, a, b, c, a3);
      const value = Fu - Fl;
      procedure.push({
        title: "3. Teorema fundamental",
        detail: `∫[${fmt(lower)}, ${fmt(upper)}] f = F(${fmt(upper)}) − F(${fmt(lower)}) = ${fmt(Fu)} − ${fmt(Fl)} = ${fmt(value)}.`,
      });
      return {
        expression: `${fmt(value)}`,
        numericValue: value,
        procedure,
      };
    }
    case "power": {
      if (Math.abs(b + 1) < 1e-12) {
        throw new Error(
          "Para ∫ a·x⁻¹ dx usa ln|x| (caso especial). Elige b ≠ −1 o trabaja a mano el logaritmo.",
        );
      }
      const newPower = b + 1;
      const coef = a / newPower;
      const F = `${fmt(coef)}·x^${fmt(newPower)} + C`;
      const procedure: CalculusResult["procedure"] = [
        {
          title: "1. Función",
          detail: `f(x) = ${f}.`,
        },
        {
          title: "2. Regla de potencias",
          detail: `∫ a·xⁿ dx = a·xⁿ⁺¹/(n+1) + C = ${F}.`,
        },
      ];
      if (!definite) {
        return { expression: F, numericValue: null, procedure };
      }
      if (lower < 0 || upper < 0) {
        // for non-integer powers may be complex; still compute if power integer-ish
      }
      const Fu = coef * upper ** newPower;
      const Fl = coef * lower ** newPower;
      const value = Fu - Fl;
      procedure.push({
        title: "3. Evaluación",
        detail: `F(${fmt(upper)}) − F(${fmt(lower)}) = ${fmt(value)}.`,
      });
      return { expression: fmt(value), numericValue: value, procedure };
    }
    case "sin": {
      if (Math.abs(b) < 1e-12) {
        throw new Error("En sen(b·x), b debe ser distinto de cero.");
      }
      const coef = -a / b;
      const F = `${fmt(coef)}·cos(${fmt(b)}·x) + C`;
      const procedure: CalculusResult["procedure"] = [
        {
          title: "1. Función",
          detail: `f(x) = ${f}.`,
        },
        {
          title: "2. Integral de seno",
          detail: `∫ sen(u) du = −cos(u). Con u=${fmt(b)}x, du=${fmt(b)} dx → ∫a sen(bx) dx = −(a/b) cos(bx) + C.`,
        },
      ];
      if (!definite) {
        return { expression: F, numericValue: null, procedure };
      }
      const Fu = coef * Math.cos(b * upper);
      const Fl = coef * Math.cos(b * lower);
      const value = Fu - Fl;
      procedure.push({
        title: "3. Evaluación",
        detail: `F(${fmt(upper)}) − F(${fmt(lower)}) = ${fmt(value)}.`,
      });
      return { expression: fmt(value), numericValue: value, procedure };
    }
    case "cos": {
      if (Math.abs(b) < 1e-12) {
        throw new Error("En cos(b·x), b debe ser distinto de cero.");
      }
      const coef = a / b;
      const F = `${fmt(coef)}·sen(${fmt(b)}·x) + C`;
      const procedure: CalculusResult["procedure"] = [
        {
          title: "1. Función",
          detail: `f(x) = ${f}.`,
        },
        {
          title: "2. Integral de coseno",
          detail: `∫ cos(u) du = sen(u). Resultado: (a/b) sen(bx) + C.`,
        },
      ];
      if (!definite) {
        return { expression: F, numericValue: null, procedure };
      }
      const Fu = coef * Math.sin(b * upper);
      const Fl = coef * Math.sin(b * lower);
      const value = Fu - Fl;
      procedure.push({
        title: "3. Evaluación",
        detail: `F(${fmt(upper)}) − F(${fmt(lower)}) = ${fmt(value)}.`,
      });
      return { expression: fmt(value), numericValue: value, procedure };
    }
    case "exp": {
      if (Math.abs(b) < 1e-12) {
        // ∫ a dx = a x + C
        const F = `${fmt(a)}·x + C`;
        if (!definite) {
          return {
            expression: F,
            numericValue: null,
            procedure: [
              {
                title: "1. Caso b = 0",
                detail: `e^0 = 1 → f(x) = ${fmt(a)}. ∫ = ${F}.`,
              },
            ],
          };
        }
        const value = a * (upper - lower);
        return {
          expression: fmt(value),
          numericValue: value,
          procedure: [
            {
              title: "1. Constante",
              detail: `∫[${fmt(lower)},${fmt(upper)}] ${fmt(a)} dx = ${fmt(value)}.`,
            },
          ],
        };
      }
      const coef = a / b;
      const F = `${fmt(coef)}·e^(${fmt(b)}·x) + C`;
      const procedure: CalculusResult["procedure"] = [
        {
          title: "1. Función",
          detail: `f(x) = ${f}.`,
        },
        {
          title: "2. Integral exponencial",
          detail: `∫ e^(bx) dx = (1/b) e^(bx) + C → ${F}.`,
        },
      ];
      if (!definite) {
        return { expression: F, numericValue: null, procedure };
      }
      const Fu = coef * Math.exp(b * upper);
      const Fl = coef * Math.exp(b * lower);
      const value = Fu - Fl;
      procedure.push({
        title: "3. Evaluación",
        detail: `F(${fmt(upper)}) − F(${fmt(lower)}) = ${fmt(value)}.`,
      });
      return { expression: fmt(value), numericValue: value, procedure };
    }
  }
}

function civilCase(inputs: CalculusCivilInputs): CalculusResult {
  const { baseM: b, heightM: h, civilCase: id } = inputs;
  if (!Number.isFinite(b) || b <= 0) {
    throw new Error("La base b debe ser mayor que cero.");
  }
  if (!Number.isFinite(h) || h <= 0) {
    throw new Error("La altura h debe ser mayor que cero.");
  }

  if (id === "triangle-centroid") {
    const area = (b * h) / 2;
    const xBar = b / 3;
    const yBar = h / 3;
    return {
      kind: "calculus",
      mode: "civil",
      expression: `Triángulo rectángulo b=${fmt(b)} · h=${fmt(h)}`,
      resultExpression: `A = ${fmt(area)}; x̄ = ${fmt(xBar)}; ȳ = ${fmt(yBar)}`,
      numericValue: yBar,
      summary: `Centroide: x̄ = b/3 = ${fmt(xBar)}, ȳ = h/3 = ${fmt(yBar)}`,
      tip: "Origen en el vértice del ángulo recto; x̄ hacia la base, ȳ hacia la altura.",
      procedure: [
        {
          title: "1. Área",
          detail: `A = ∫₀ᵇ y(x) dx con y = (h/b)·x → A = (h/b)·b²/2 = bh/2 = ${fmt(area)}.`,
        },
        {
          title: "2. Momento estático / centroide en x",
          detail: `x̄ = (1/A) ∫ x dA. Para triángulo rectángulo: x̄ = b/3 = ${fmt(xBar)}.`,
        },
        {
          title: "3. Centroide en y",
          detail: `ȳ = h/3 = ${fmt(yBar)} medido desde la base (o desde el cateto horizontal según el dibujo).`,
        },
      ],
    };
  }

  if (id === "rectangle-centroid") {
    const area = b * h;
    const xBar = b / 2;
    const yBar = h / 2;
    return {
      kind: "calculus",
      mode: "civil",
      expression: `Rectángulo b=${fmt(b)} · h=${fmt(h)}`,
      resultExpression: `A = ${fmt(area)}; x̄ = ${fmt(xBar)}; ȳ = ${fmt(yBar)}`,
      numericValue: yBar,
      summary: `Centroide en el centro: (${fmt(xBar)}, ${fmt(yBar)})`,
      tip: "Úsalo como control rápido antes de GeoSecciones o PreDim.",
      procedure: [
        {
          title: "1. Área",
          detail: `A = ∫₀ʰ ∫₀ᵇ dx dy = b·h = ${fmt(area)}.`,
        },
        {
          title: "2. Centroide",
          detail: `Por simetría, x̄ = b/2 = ${fmt(xBar)}, ȳ = h/2 = ${fmt(yBar)}.`,
        },
      ],
    };
  }

  // rectangle inertia about base
  const inertia = (b * h ** 3) / 3;
  const inertiaCentroid = (b * h ** 3) / 12;
  return {
    kind: "calculus",
    mode: "civil",
    expression: `Rectángulo b=${fmt(b)} · h=${fmt(h)}, eje en la base`,
    resultExpression: `Ix,base = ${fmt(inertia)} ; Ix,centroide = ${fmt(inertiaCentroid)}`,
    numericValue: inertia,
    summary: `Ix (base) = b·h³/3 = ${fmt(inertia)}`,
    tip: "Steiner: Ix,base = Ix,G + A·(h/2)² = bh³/12 + bh·(h/2)² = bh³/3.",
    procedure: [
      {
        title: "1. Definición",
        detail: `Ix = ∫ y² dA. Con franjas horizontales: dA = b·dy, y de 0 a h.`,
      },
      {
        title: "2. Integral",
        detail: `Ix = ∫₀ʰ y² · b dy = b·[y³/3]₀ʰ = b·h³/3 = ${fmt(inertia)}.`,
      },
      {
        title: "3. Relación con eje baricéntrico",
        detail: `Ix,G = b·h³/12 = ${fmt(inertiaCentroid)}. Verifica en GeoSecciones.`,
      },
    ],
  };
}

export function calculateCalculus(inputs: CalculusInputs): CalculusResult {
  if (inputs.mode === "civil") {
    return civilCase(inputs);
  }

  const { preset, a, b, c, d } = inputs;
  assertFinite(a, "El coeficiente a");
  assertFinite(b, "El coeficiente b");
  assertFinite(c, "El coeficiente c");
  assertFinite(d, "El coeficiente d");

  const expression = describeFunction(preset, a, b, c, d);

  if (inputs.mode === "derivative") {
    const diff = differentiate(preset, a, b, c, d);
    return {
      kind: "calculus",
      mode: "derivative",
      expression: `f(x) = ${expression}`,
      resultExpression: `f'(x) = ${diff.expression}`,
      numericValue: null,
      summary: `Derivada: ${diff.expression}`,
      tip: "Regla clave: d/dx[xⁿ] = n·xⁿ⁻¹. En sen/cos/exp usa la regla de la cadena.",
      procedure: diff.procedure,
    };
  }

  const lower = inputs.lower ?? 0;
  const upper = inputs.upper ?? 1;
  const integ = integrate(
    preset,
    a,
    b,
    c,
    d,
    inputs.definite,
    lower,
    upper,
  );

  return {
    kind: "calculus",
    mode: "integral",
    expression: inputs.definite
      ? `∫[${fmt(lower)}, ${fmt(upper)}] (${expression}) dx`
      : `∫ (${expression}) dx`,
    resultExpression: integ.expression,
    numericValue: integ.numericValue,
    summary: inputs.definite
      ? `Integral definida = ${integ.expression}`
      : `Antiderivada: ${integ.expression}`,
    tip: "Para definida: F(b) − F(a). Recuerda + C solo en indefinidas.",
    procedure: integ.procedure,
  };
}
