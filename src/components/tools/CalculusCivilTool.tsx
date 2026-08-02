"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  calculateCalculus,
  listCivilCases,
  listFunctionPresets,
  type CalculusMode,
  type CivilCaseId,
  type FunctionPresetId,
} from "@/calculations/calculusCivil";
import { ToolkitShell } from "@/components/ToolkitShell";
import { moduleFaqs } from "@/lib/moduleFaqs";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export function CalculusCivilTool() {
  const presets = listFunctionPresets();
  const civilCases = listCivilCases();
  const [mode, setMode] = useState<CalculusMode>("derivative");
  const [preset, setPreset] = useState<FunctionPresetId>("poly2");
  const [civilCase, setCivilCase] =
    useState<CivilCaseId>("triangle-centroid");
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(1);
  const [d, setD] = useState(0);
  const [definite, setDefinite] = useState(false);
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(1);
  const [baseM, setBaseM] = useState(0.3);
  const [heightM, setHeightM] = useState(0.5);
  const [error, setError] = useState("");

  const activeHint =
    mode === "civil"
      ? civilCases.find((item) => item.id === civilCase)?.hint
      : presets.find((item) => item.id === preset)?.hint;

  const result = useMemo(() => {
    try {
      if (mode === "civil") {
        return calculateCalculus({
          mode,
          civilCase,
          baseM,
          heightM,
        });
      }
      if (mode === "derivative") {
        return calculateCalculus({
          mode,
          preset,
          a,
          b,
          c,
          d,
        });
      }
      return calculateCalculus({
        mode: "integral",
        preset,
        a,
        b,
        c,
        d,
        definite,
        lower,
        upper,
      });
    } catch {
      return null;
    }
  }, [
    mode,
    preset,
    civilCase,
    a,
    b,
    c,
    d,
    definite,
    lower,
    upper,
    baseM,
    heightM,
  ]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      if (mode === "civil") {
        calculateCalculus({ mode, civilCase, baseM, heightM });
      } else if (mode === "derivative") {
        calculateCalculus({ mode, preset, a, b, c, d });
      } else {
        calculateCalculus({
          mode: "integral",
          preset,
          a,
          b,
          c,
          d,
          definite,
          lower,
          upper,
        });
      }
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  const showC = preset === "poly2" || preset === "poly3";
  const showD = preset === "poly3";
  const coefLabels =
    preset === "power"
      ? { a: "Coeficiente a", b: "Exponente n", c: "—", d: "—" }
      : preset === "sin" || preset === "cos" || preset === "exp"
        ? { a: "Coeficiente a", b: "Factor b (en bx)", c: "—", d: "—" }
        : {
            a: "Constante a",
            b: "Coef. de x (b)",
            c: "Coef. de x² (c)",
            d: "Coef. de x³ (d)",
          };

  return (
    <ToolkitShell
      eyebrow="Básico · CivilKit EC"
      title="Cálculo para civil"
      description="Derivadas e integrales de funciones usuales, con paso a paso. Incluye centroides e inercia por integración para conectar con secciones."
      faqs={moduleFaqs.calculus}
      aside={
        result ? (
          <section className="structural-card space-y-4 p-5 sm:p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
                Resultado
              </p>
              <p className="mt-2 font-mono text-sm text-slate-600">
                {result.expression}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                {result.resultExpression}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{result.summary}</p>
            </div>
            <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-sm text-sky-900">
              {result.tip}
            </p>
            <ol className="space-y-3 border-t border-slate-200 pt-4">
              {result.procedure.map((step) => (
                <li key={step.title}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">
                    {step.title}
                  </p>
                  <p className="mt-1 font-mono text-xs leading-5 text-slate-700">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>
            {mode === "civil" && (
              <Link
                href="/geosecciones"
                className="inline-flex text-sm font-semibold text-[#E65100] hover:underline"
              >
                Verificar en GeoSecciones →
              </Link>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
            Elige el modo y pulsa calcular para ver fórmulas y pasos.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
          Modo
          <select
            className={inputClass}
            value={mode}
            onChange={(event) => setMode(event.target.value as CalculusMode)}
          >
            <option value="derivative">Derivada</option>
            <option value="integral">Integral</option>
            <option value="civil">Centroide / inercia (civil)</option>
          </select>
        </label>

        {mode === "civil" ? (
          <>
            <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
              Caso
              <select
                className={inputClass}
                value={civilCase}
                onChange={(event) =>
                  setCivilCase(event.target.value as CivilCaseId)
                }
              >
                {civilCases.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Base b" unit="m" value={baseM} onChange={setBaseM} step="0.01" />
              <NumberField label="Altura h" unit="m" value={heightM} onChange={setHeightM} step="0.01" />
            </div>
          </>
        ) : (
          <>
            <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
              Función
              <select
                className={inputClass}
                value={preset}
                onChange={(event) =>
                  setPreset(event.target.value as FunctionPresetId)
                }
              >
                {presets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-slate-500">{activeHint}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label={coefLabels.a} unit="" value={a} onChange={setA} step="0.1" />
              <NumberField label={coefLabels.b} unit="" value={b} onChange={setB} step="0.1" />
              {showC && (
                <NumberField label={coefLabels.c} unit="" value={c} onChange={setC} step="0.1" />
              )}
              {showD && (
                <NumberField label={coefLabels.d} unit="" value={d} onChange={setD} step="0.1" />
              )}
            </div>
            {mode === "integral" && (
              <>
                <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={definite}
                    onChange={(event) => setDefinite(event.target.checked)}
                  />
                  <span>Integral definida (límites a y b)</span>
                </label>
                {definite && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField label="Límite inferior" unit="" value={lower} onChange={setLower} step="0.1" />
                    <NumberField label="Límite superior" unit="" value={upper} onChange={setUpper} step="0.1" />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#E65100] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C84600]"
        >
          Calcular con pasos
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Casos frecuentes de cálculo I. No cubre integración por partes ni
          fracciones parciales. Apoyo académico, no examen automático.
        </p>
      </form>
    </ToolkitShell>
  );
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  step = "0.1",
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
      <span className="flex items-center justify-between gap-2">
        {label}
        {unit ? (
          <span className="font-mono text-[10px] font-medium normal-case text-slate-400">
            {unit}
          </span>
        ) : null}
      </span>
      <input
        className={inputClass}
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
