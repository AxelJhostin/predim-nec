"use client";

import { useState, type ReactNode } from "react";
import { Calculator, CircleHelp, Ruler, Save } from "lucide-react";

export const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

export function Field({
  label,
  unit,
  hint,
  help,
  children,
}: {
  label: string;
  unit?: string;
  hint?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[0.11em] text-slate-600">
      <span className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5">
          {label}
          {help && (
            <button
              type="button"
              className="group relative inline-flex rounded-full text-slate-400 transition hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
              aria-label={`Ayuda: ${label}`}
              title={help}
              onClick={(event) => event.preventDefault()}
            >
              <CircleHelp aria-hidden="true" size={14} />
              <span className="pointer-events-none absolute left-0 top-6 z-20 hidden w-56 rounded-lg border border-slate-200 bg-white p-3 text-left text-[11px] font-normal normal-case leading-5 tracking-normal text-slate-600 shadow-lg group-hover:block group-focus:block sm:left-auto sm:right-0">
                {help}
              </span>
            </button>
          )}
        </span>
        {unit && (
          <span className="font-mono text-[10px] font-medium normal-case tracking-normal text-slate-400">
            {unit}
          </span>
        )}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-slate-500">
          {hint}
        </span>
      )}
    </label>
  );
}

export function FormCard({
  title,
  subtitle,
  error,
  children,
}: {
  title: string;
  subtitle: string;
  error: string;
  children: ReactNode;
}) {
  return (
    <section className="structural-card p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-lg bg-orange-50 p-2.5 text-orange-700">
          <Ruler aria-hidden="true" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </section>
  );
}

export function SubmitButton() {
  return (
    <button
      type="submit"
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#E65100] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#C84600] focus:outline-none focus:ring-4 focus:ring-orange-200 active:scale-[0.99]"
    >
      <Calculator aria-hidden="true" size={18} />
      Calcular predimensionamiento
    </button>
  );
}

export function SaveElementControl({
  defaultLabel,
  onSave,
}: {
  defaultLabel: string;
  onSave: (label: string) => void;
}) {
  const [label, setLabel] = useState(defaultLabel);
  const [feedback, setFeedback] = useState("");

  function save() {
    try {
      onSave(label);
      setFeedback(`Elemento ${label.trim()} guardado.`);
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : "No se pudo guardar.");
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50/60 p-4">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-sky-900">
        Etiqueta del elemento
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            className="min-w-0 flex-1 rounded-lg border border-sky-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
              setFeedback("");
            }}
            placeholder="Ej. V-101"
          />
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-800"
          >
            <Save aria-hidden="true" size={15} />
            Guardar elemento
          </button>
        </div>
      </label>
      {feedback && (
        <p className="mt-2 text-[11px] normal-case tracking-normal text-sky-800">
          {feedback}
        </p>
      )}
    </div>
  );
}
