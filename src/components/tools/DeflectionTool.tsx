"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  calculateDeflection,
  type DeflectionSupport,
} from "@/calculations/deflection";
import { formatNumber } from "@/calculations";
import { ToolkitShell } from "@/components/ToolkitShell";
import { moduleFaqs } from "@/lib/moduleFaqs";
import { buildPredimHref } from "@/lib/predimHandoff";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export function DeflectionTool() {
  const [spanM, setSpanM] = useState(6);
  const [designLoadKnM, setDesignLoadKnM] = useState(10);
  const [widthCm, setWidthCm] = useState(25);
  const [depthCm, setDepthCm] = useState(45);
  const [supportType, setSupportType] =
    useState<DeflectionSupport>("simple");
  const [concreteStrengthMpa, setConcreteStrengthMpa] = useState(21);
  const [limitRatio, setLimitRatio] = useState(240);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    try {
      return calculateDeflection({
        spanM,
        designLoadKnM,
        widthCm,
        depthCm,
        supportType,
        concreteStrengthMpa,
        limitRatio,
      });
    } catch {
      return null;
    }
  }, [
    spanM,
    designLoadKnM,
    widthCm,
    depthCm,
    supportType,
    concreteStrengthMpa,
    limitRatio,
  ]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      calculateDeflection({
        spanM,
        designLoadKnM,
        widthCm,
        depthCm,
        supportType,
        concreteStrengthMpa,
        limitRatio,
      });
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <ToolkitShell
      eyebrow="Intermedio · CivilKit EC"
      title="Deflexión aprox."
      description="Estimación elástica de deflexión inmediata en vigas rectangulares (sección bruta). Útil para chequear L/240 o L/360 en anteproyecto."
      faqs={moduleFaqs.deflection}
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
                label="δ inmediata"
                value={`${formatNumber(result.deflectionMm, 2)} mm`}
              />
              <Metric
                label={`Límite L/${formatNumber(result.limitRatio)}`}
                value={`${formatNumber(result.limitMm, 2)} mm`}
              />
              <Metric
                label="Ec"
                value={`${formatNumber(result.modulusGpa, 2)} GPa`}
              />
              <Metric
                label="I bruta"
                value={`${formatNumber(result.inertiaCm4, 0)} cm⁴`}
              />
            </dl>
            <p
              className={`rounded-lg border px-3 py-2.5 text-sm ${
                result.ok
                  ? "border-emerald-100 bg-emerald-50/80 text-emerald-900"
                  : "border-amber-100 bg-amber-50/80 text-amber-950"
              }`}
            >
              {result.ok
                ? `Cumple el límite L/${formatNumber(result.limitRatio)} (utilización ${formatNumber(result.utilization * 100, 1)}%).`
                : `Excede L/${formatNumber(result.limitRatio)}. Prueba mayor peralte o menor luz/carga.`}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildPredimHref({
                  tab: "beam",
                  designLoadKnM,
                  spanM,
                  source: "deflexion",
                })}
                className="inline-flex items-center justify-center rounded-lg bg-[#E65100] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C84600]"
              >
                Ajustar en PreDim
              </Link>
              <Link
                href="/geosecciones"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800"
              >
                GeoSecciones
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
            Define sección, luz y carga para estimar la deflexión.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
          Condición de apoyo
          <select
            className={inputClass}
            value={supportType}
            onChange={(event) =>
              setSupportType(event.target.value as DeflectionSupport)
            }
          >
            <option value="simple">Simplemente apoyada</option>
            <option value="one-continuous">Un extremo continuo</option>
            <option value="both-continuous">Ambos extremos continuos</option>
            <option value="cantilever">Voladizo</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Luz L" unit="m" value={spanM} onChange={setSpanM} step="0.1" />
          <NumberField
            label="Carga w"
            unit="kN/m"
            value={designLoadKnM}
            onChange={setDesignLoadKnM}
            step="0.1"
          />
          <NumberField label="Ancho b" unit="cm" value={widthCm} onChange={setWidthCm} />
          <NumberField label="Peralte h" unit="cm" value={depthCm} onChange={setDepthCm} />
          <NumberField
            label="f'c"
            unit="MPa"
            value={concreteStrengthMpa}
            onChange={setConcreteStrengthMpa}
          />
          <NumberField
            label="Límite L/n"
            unit="n"
            value={limitRatio}
            onChange={setLimitRatio}
          />
        </div>

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
          Calcular deflexión
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Usa sección bruta y Ec = 4700√f&apos;c. No aplica factores de larga
          duración ni I fisurada.
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
