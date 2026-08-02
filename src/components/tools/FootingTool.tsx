"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { calculateFooting } from "@/calculations/footing";
import { formatNumber } from "@/calculations";
import { ToolkitShell } from "@/components/ToolkitShell";
import { buildPredimHref } from "@/lib/predimHandoff";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export function FootingTool() {
  const [serviceLoadKn, setServiceLoadKn] = useState(800);
  const [ultimateLoadKn, setUltimateLoadKn] = useState(960);
  const [allowablePressureKnM2, setAllowablePressureKnM2] = useState(200);
  const [columnSideCm, setColumnSideCm] = useState(40);
  const [concreteStrengthMpa, setConcreteStrengthMpa] = useState(21);
  const [steelYieldMpa, setSteelYieldMpa] = useState(420);
  const [coverCm, setCoverCm] = useState(7.5);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    try {
      return calculateFooting({
        serviceLoadKn,
        ultimateLoadKn,
        allowablePressureKnM2,
        columnSideCm,
        concreteStrengthMpa,
        steelYieldMpa,
        coverCm,
      });
    } catch {
      return null;
    }
  }, [
    serviceLoadKn,
    ultimateLoadKn,
    allowablePressureKnM2,
    columnSideCm,
    concreteStrengthMpa,
    steelYieldMpa,
    coverCm,
  ]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      calculateFooting({
        serviceLoadKn,
        ultimateLoadKn,
        allowablePressureKnM2,
        columnSideCm,
        concreteStrengthMpa,
        steelYieldMpa,
        coverCm,
      });
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <ToolkitShell
      eyebrow="Intermedio · CivilKit EC"
      title="Zapatas PreDim"
      description="Predimensionamiento de zapata aislada cuadrada: área por qa, espesor por corte/punzonamiento y malla inferior tentativa. Orientado a anteproyecto académico."
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
                label="Lado B"
                value={`${formatNumber(result.sideCm)} cm`}
              />
              <Metric
                label="Espesor h"
                value={`${formatNumber(result.thicknessCm)} cm`}
              />
              <Metric
                label="q servicio"
                value={`${formatNumber(result.servicePressureKnM2, 2)} kN/m²`}
              />
              <Metric
                label="Mu"
                value={`${formatNumber(result.ultimateMomentKnMPerM, 2)} kN·m/m`}
              />
              <Metric label="Acero" value={result.flexuralBarProposal} />
              <Metric
                label="As prov."
                value={`${formatNumber(result.providedSteelAreaCm2PerM, 2)} cm²/m`}
              />
            </dl>
            <ul className="space-y-2 border-t border-slate-200 pt-4">
              {result.compliance.map((item) => (
                <li
                  key={item.criterion}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    item.status === "pass"
                      ? "border-emerald-100 bg-emerald-50/70 text-emerald-900"
                      : "border-red-100 bg-red-50/70 text-red-800"
                  }`}
                >
                  <p className="font-semibold">{item.criterion}</p>
                  <p className="mt-0.5 font-mono text-xs">
                    {item.calculated} · {item.limit}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildPredimHref({
                  tab: "column",
                  source: "zapatas",
                })}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800"
              >
                PreDim columnas
              </Link>
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
            Ingresa la carga axial y qa para predimensionar la zapata.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="P servicio"
            unit="kN"
            value={serviceLoadKn}
            onChange={setServiceLoadKn}
          />
          <NumberField
            label="Pu (mayorada)"
            unit="kN"
            value={ultimateLoadKn}
            onChange={setUltimateLoadKn}
          />
          <NumberField
            label="qa suelo"
            unit="kN/m²"
            value={allowablePressureKnM2}
            onChange={setAllowablePressureKnM2}
          />
          <NumberField
            label="Lado columna c"
            unit="cm"
            value={columnSideCm}
            onChange={setColumnSideCm}
          />
          <NumberField
            label="f'c"
            unit="MPa"
            value={concreteStrengthMpa}
            onChange={setConcreteStrengthMpa}
          />
          <NumberField
            label="fy"
            unit="MPa"
            value={steelYieldMpa}
            onChange={setSteelYieldMpa}
          />
        </div>
        <NumberField
          label="Recubrimiento"
          unit="cm"
          value={coverCm}
          onChange={setCoverCm}
          step="0.5"
        />

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
          Predimensionar zapata
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Zapata cuadrada centrada, carga axial dominante. No incluye momento de
          volcamiento, suelo estratificado ni diseño sísmico de cimentación.
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
  step = "1",
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
