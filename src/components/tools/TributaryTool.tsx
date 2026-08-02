"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  calculateTributary,
  type ColumnBayPosition,
  type TributaryTarget,
} from "@/calculations/tributary";
import { formatNumber } from "@/calculations";
import { ToolkitShell } from "@/components/ToolkitShell";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export function TributaryTool() {
  const [target, setTarget] = useState<TributaryTarget>("column");
  const [position, setPosition] = useState<ColumnBayPosition>("interior");
  const [bayLxM, setBayLxM] = useState(5);
  const [bayLyM, setBayLyM] = useState(4);
  const [columnServiceQ, setColumnServiceQ] = useState(8);
  const [tributaryWidthM, setTributaryWidthM] = useState(4);
  const [spanM, setSpanM] = useState(6);
  const [designLoadKnM2, setDesignLoadKnM2] = useState(9.2);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    try {
      if (target === "column") {
        return calculateTributary({
          target,
          position,
          bayLxM,
          bayLyM,
          serviceLoadKnM2: columnServiceQ,
        });
      }
      return calculateTributary({
        target,
        tributaryWidthM,
        spanM,
        designLoadKnM2,
      });
    } catch {
      return null;
    }
  }, [
    target,
    position,
    bayLxM,
    bayLyM,
    columnServiceQ,
    tributaryWidthM,
    spanM,
    designLoadKnM2,
  ]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      if (target === "column") {
        calculateTributary({
          target,
          position,
          bayLxM,
          bayLyM,
          serviceLoadKnM2: columnServiceQ,
        });
      } else {
        calculateTributary({
          target,
          tributaryWidthM,
          spanM,
          designLoadKnM2,
        });
      }
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <ToolkitShell
      eyebrow="Intermedio · CivilKit EC"
      title="Tributarias"
      description="Estima el área tributaria de columnas y el ancho tributario de vigas a partir de la retícula. Con q o q_u obtienes Pservicio o w listos para PreDim."
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
                label="Área tributaria"
                value={`${formatNumber(result.tributaryAreaM2, 2)} m²`}
              />
              {result.designLoadKnM !== null && (
                <Metric
                  label="w diseño"
                  value={`${formatNumber(result.designLoadKnM, 2)} kN/m`}
                />
              )}
              {result.serviceLoadKn !== null && (
                <Metric
                  label="P servicio"
                  value={`${formatNumber(result.serviceLoadKn, 2)} kN`}
                />
              )}
              {result.serviceLoadKnM2 !== null && target === "column" && (
                <Metric
                  label="q servicio"
                  value={`${formatNumber(result.serviceLoadKnM2, 2)} kN/m²`}
                />
              )}
            </dl>
            <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-sm text-sky-900">
              {result.predimHint}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/predim"
                className="inline-flex items-center justify-center rounded-lg bg-[#E65100] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C84600]"
              >
                Abrir PreDim
              </Link>
              <Link
                href="/combinaciones-nec"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800"
              >
                Combinaciones NEC
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
            Completa la geometría para estimar la tributaria.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
          Elemento receptor
          <select
            className={inputClass}
            value={target}
            onChange={(event) =>
              setTarget(event.target.value as TributaryTarget)
            }
          >
            <option value="column">Columna</option>
            <option value="beam">Viga</option>
          </select>
        </label>

        {target === "column" ? (
          <>
            <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
              Posición en la retícula
              <select
                className={inputClass}
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value as ColumnBayPosition)
                }
              >
                <option value="interior">Interior</option>
                <option value="edge">Borde</option>
                <option value="corner">Esquina</option>
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Vano Lx" unit="m" value={bayLxM} onChange={setBayLxM} />
              <NumberField label="Vano Ly" unit="m" value={bayLyM} onChange={setBayLyM} />
            </div>
            <NumberField
              label="q servicio (D+L)"
              unit="kN/m²"
              value={columnServiceQ}
              onChange={setColumnServiceQ}
              step="0.1"
            />
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Ancho tributario bt"
                unit="m"
                value={tributaryWidthM}
                onChange={setTributaryWidthM}
              />
              <NumberField
                label="Luz de viga L"
                unit="m"
                value={spanM}
                onChange={setSpanM}
              />
            </div>
            <NumberField
              label="q_u (de Combinaciones)"
              unit="kN/m²"
              value={designLoadKnM2}
              onChange={setDesignLoadKnM2}
              step="0.1"
            />
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
          Calcular tributaria
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Modelo simplificado de retícula rectangular. No sustituye el diagrama
          de áreas tributarias del plano estructural.
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
        <span className="font-mono text-[10px] font-medium normal-case text-slate-400">
          {unit}
        </span>
      </span>
      <input
        className={inputClass}
        type="number"
        min="0"
        step={step}
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
