"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  convertUnits,
  listUnitCategories,
  listUnits,
  type UnitCategory,
} from "@/calculations/units";
import { formatNumber } from "@/calculations";
import { ToolkitShell } from "@/components/ToolkitShell";
import { inputClass } from "@/components/tools/primitives";
import { moduleFaqs } from "@/lib/moduleFaqs";

export function UnitsTool() {
  const categories = listUnitCategories();
  const [category, setCategory] = useState<UnitCategory>("stress");
  const units = listUnits(category);
  const [fromUnitId, setFromUnitId] = useState(units[0]?.id ?? "MPa");
  const [toUnitId, setToUnitId] = useState(units[2]?.id ?? "kgf_cm2");
  const [value, setValue] = useState(21);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    try {
      return convertUnits({ category, value, fromUnitId, toUnitId });
    } catch {
      return null;
    }
  }, [category, value, fromUnitId, toUnitId]);

  function onCategoryChange(next: UnitCategory) {
    const nextUnits = listUnits(next);
    setCategory(next);
    setFromUnitId(nextUnits[0]?.id ?? "");
    setToUnitId(nextUnits[1]?.id ?? nextUnits[0]?.id ?? "");
    setError("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      convertUnits({ category, value, fromUnitId, toUnitId });
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  function swap() {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  }

  return (
    <ToolkitShell
      eyebrow="Básico · CivilKit EC"
      title="Unidades EC"
      description="Conversiones rápidas para ingeniería civil en Ecuador: longitud, fuerza, esfuerzo y cargas. Ideal para pasar de MPa a kgf/cm² o de kN a kgf."
      faqs={moduleFaqs.units}
      aside={
        result ? (
          <section className="structural-card p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
              Conversión
            </p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-950">
              {formatNumber(result.result, 6)}{" "}
              <span className="text-base font-semibold text-slate-500">
                {result.toLabel}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-600">{result.summary}</p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                Procedimiento
              </p>
              <p className="mt-1 font-mono text-xs leading-5 text-slate-700">
                {result.formula}
              </p>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Categoría: {result.categoryLabel}. Factores basados en equivalencias
              SI habituales en textos de pregrado.
            </p>
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
            Elige categoría, unidades y valor para convertir.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
          Categoría
          <select
            className={inputClass}
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value as UnitCategory)
            }
          >
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
          Valor
          <input
            className={inputClass}
            type="number"
            step="any"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
            Desde
            <select
              className={inputClass}
              value={fromUnitId}
              onChange={(event) => setFromUnitId(event.target.value)}
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={swap}
            className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-700 hover:border-sky-400"
          >
            Intercambiar
          </button>
          <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
            Hacia
            <select
              className={inputClass}
              value={toUnitId}
              onChange={(event) => setToUnitId(event.target.value)}
            >
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#E65100] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C84600]"
        >
          Convertir
        </button>
      </form>
    </ToolkitShell>
  );
}
