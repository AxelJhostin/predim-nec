"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { calculateCombinations } from "@/calculations/combinations";
import { formatNumber } from "@/calculations";
import { ToolkitShell } from "@/components/ToolkitShell";
import { buildPredimHref } from "@/lib/predimHandoff";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export function CombinationsTool() {
  const [deadLoadKnM2, setDeadLoadKnM2] = useState(5);
  const [liveLoadKnM2, setLiveLoadKnM2] = useState(2);
  const [useWidth, setUseWidth] = useState(true);
  const [tributaryWidthM, setTributaryWidthM] = useState(4);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    try {
      return calculateCombinations({
        deadLoadKnM2,
        liveLoadKnM2,
        tributaryWidthM: useWidth ? tributaryWidthM : undefined,
      });
    } catch {
      return null;
    }
  }, [deadLoadKnM2, liveLoadKnM2, useWidth, tributaryWidthM]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      calculateCombinations({
        deadLoadKnM2,
        liveLoadKnM2,
        tributaryWidthM: useWidth ? tributaryWidthM : undefined,
      });
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <ToolkitShell
      eyebrow="Intermedio · CivilKit EC"
      title="Combinaciones NEC"
      description="Combinaciones gravitacionales simplificadas (1.4D y 1.2D+1.6L) para anteproyecto académico. Obtén q_u y, si indicas el ancho tributario, la w de viga."
      aside={
        result ? (
          <section className="structural-card space-y-4 p-5 sm:p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
                Resultados
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-950">
                {result.summary}
              </h2>
            </div>
            <dl className="grid grid-cols-2 gap-2.5">
              <Metric
                label="q_u gobernante"
                value={`${formatNumber(result.governing.valueKnM2, 2)} kN/m²`}
              />
              <Metric
                label="q servicio"
                value={`${formatNumber(result.serviceLoadKnM2, 2)} kN/m²`}
              />
              {result.designLoadKnM !== null && (
                <Metric
                  label="w diseño"
                  value={`${formatNumber(result.designLoadKnM, 2)} kN/m`}
                />
              )}
            </dl>
            <ul className="space-y-2 border-t border-slate-200 pt-4">
              {result.cases.map((item) => (
                <li
                  key={item.id}
                  className={`rounded-md border px-3 py-2.5 ${
                    item.id === result.governing.id
                      ? "border-sky-200 bg-sky-50"
                      : "border-slate-100 bg-slate-50/80"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    {item.label}
                    {item.id === result.governing.id ? " · gobierna" : ""}
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-slate-950">
                    {formatNumber(item.valueKnM2, 3)} kN/m²
                  </p>
                </li>
              ))}
            </ul>
            <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-sm text-sky-900">
              {result.predimHint}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildPredimHref({
                  tab: "slab",
                  designLoadKnM2: result.governing.valueKnM2,
                  source: "combinaciones",
                })}
                className="inline-flex items-center justify-center rounded-lg bg-[#E65100] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C84600]"
              >
                Usar q_u en losa
              </Link>
              {result.designLoadKnM !== null && (
                <Link
                  href={buildPredimHref({
                    tab: "beam",
                    designLoadKnM: result.designLoadKnM,
                    source: "combinaciones",
                  })}
                  className="inline-flex items-center justify-center rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-900 hover:border-orange-300"
                >
                  Usar w en viga
                </Link>
              )}
              <Link
                href="/tributarias"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800"
              >
                Tributarias
              </Link>
            </div>
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
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
            Ingresa D y L para evaluar las combinaciones.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Carga muerta D"
            unit="kN/m²"
            value={deadLoadKnM2}
            onChange={setDeadLoadKnM2}
          />
          <NumberField
            label="Carga viva L"
            unit="kN/m²"
            value={liveLoadKnM2}
            onChange={setLiveLoadKnM2}
          />
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-1"
            checked={useWidth}
            onChange={(event) => setUseWidth(event.target.checked)}
          />
          <span>
            También calcular <span className="font-semibold">w</span> de viga
            con ancho tributario (opcional).
          </span>
        </label>

        {useWidth && (
          <NumberField
            label="Ancho tributario bt"
            unit="m"
            value={tributaryWidthM}
            onChange={setTributaryWidthM}
          />
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
          Calcular combinaciones
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Alcance educativo: solo gravedad básica. No incluye viento, sismo ni
          factores de uso especiales de NEC-SE-CG.
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
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
      <span className="flex items-center justify-between gap-2">
        {label}
        <span className="font-mono text-[10px] font-medium normal-case text-slate-400">
          {unit}
        </span>
      </span>
      <input
        className={inputClass}
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-sm font-semibold text-slate-950">
        {value}
      </dd>
    </div>
  );
}
