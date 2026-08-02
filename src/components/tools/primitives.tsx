"use client";

import { inputClass } from "@/components/forms/primitives";

/** Primarios compartidos por herramientas ToolkitShell (no PreDim). */
export { inputClass };

export function NumberField({
  label,
  unit,
  value,
  onChange,
  step = "0.1",
  min,
}: {
  label: string;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  min?: number | string;
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
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
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
