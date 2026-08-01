"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Calculator, Info, Ruler, ShieldCheck } from "lucide-react";
import {
  calculateBeam,
  calculateColumn,
  calculateSlab,
  type BeamInputs,
  type BeamResult,
  type ColumnInputs,
  type ColumnResult,
  type SlabInputs,
  type SlabResult,
} from "@/utils/necCalculations";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

function Field({
  label,
  unit,
  hint,
  children,
}: {
  label: string;
  unit?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[0.11em] text-slate-600">
      <span className="flex items-center justify-between gap-3">
        {label}
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

function FormCard({
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

function SubmitButton() {
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

export function BeamForm({
  onCalculate,
}: {
  onCalculate: (result: BeamResult) => void;
}) {
  const [values, setValues] = useState<BeamInputs>({
    spanM: 6,
    supportType: "Ambos extremos continuos",
    designLoadKnM2: 8.5,
  });
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      onCalculate(calculateBeam(values));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <FormCard
      title="Parámetros de la viga"
      subtitle="Predimensionamiento geométrico inicial conforme a NEC-SE-HM."
      error={error}
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Luz de la viga (L)" unit="metros">
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.01"
            value={values.spanM}
            onChange={(event) =>
              setValues({ ...values, spanM: Number(event.target.value) })
            }
          />
        </Field>
        <Field label="Tipo de apoyo">
          <select
            className={inputClass}
            value={values.supportType}
            onChange={(event) =>
              setValues({ ...values, supportType: event.target.value })
            }
          >
            <option>Simplemente apoyada</option>
            <option>Un extremo continuo</option>
            <option>Ambos extremos continuos</option>
            <option>Voladizo</option>
          </select>
        </Field>
        <Field
          label="Carga de diseño"
          unit="kN/m²"
          hint="Dato informativo para la memoria; la regla L/12 controla este predimensionamiento."
        >
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.1"
            value={values.designLoadKnM2}
            onChange={(event) =>
              setValues({
                ...values,
                designLoadKnM2: Number(event.target.value),
              })
            }
          />
        </Field>
        <SubmitButton />
      </form>
    </FormCard>
  );
}

export function ColumnForm({
  onCalculate,
}: {
  onCalculate: (result: ColumnResult) => void;
}) {
  const [values, setValues] = useState<ColumnInputs>({
    tributaryAreaM2: 25,
    floors: 5,
    columnType: "Central",
    serviceLoadKnM2: 12,
    clearHeightM: 3,
    effectiveLengthFactor: 1,
    longitudinalSteelCm2: 20,
  });
  const [error, setError] = useState("");

  function setNumber(key: keyof ColumnInputs, value: string) {
    setValues({ ...values, [key]: Number(value) });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      onCalculate(calculateColumn(values));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <FormCard
      title="Parámetros de la columna"
      subtitle="Carga axial estimada, sección mínima y verificaciones geométricas."
      error={error}
    >
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field label="Área tributaria (At)" unit="m²">
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.1"
            value={values.tributaryAreaM2}
            onChange={(event) =>
              setNumber("tributaryAreaM2", event.target.value)
            }
          />
        </Field>
        <Field label="Número de pisos" unit="niveles">
          <input
            className={inputClass}
            type="number"
            min="1"
            step="1"
            value={values.floors}
            onChange={(event) => setNumber("floors", event.target.value)}
          />
        </Field>
        <Field label="Tipo de columna">
          <select
            className={inputClass}
            value={values.columnType}
            onChange={(event) =>
              setValues({ ...values, columnType: event.target.value })
            }
          >
            <option>Central</option>
            <option>Perimetral</option>
            <option>Esquina</option>
          </select>
        </Field>
        <Field label="Carga de servicio (q)" unit="kN/m²">
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.1"
            value={values.serviceLoadKnM2}
            onChange={(event) =>
              setNumber("serviceLoadKnM2", event.target.value)
            }
          />
        </Field>
        <Field label="Longitud libre" unit="m">
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.05"
            value={values.clearHeightM}
            onChange={(event) => setNumber("clearHeightM", event.target.value)}
          />
        </Field>
        <Field
          label="Factor de longitud (k)"
          hint="1,0 representa una condición conservadora articulada."
        >
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.05"
            value={values.effectiveLengthFactor}
            onChange={(event) =>
              setNumber("effectiveLengthFactor", event.target.value)
            }
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Acero longitudinal provisto (As)"
            unit="cm²"
            hint="Se usa únicamente para verificar la cuantía preliminar."
          >
            <input
              className={inputClass}
              type="number"
              min="0.1"
              step="0.1"
              value={values.longitudinalSteelCm2}
              onChange={(event) =>
                setNumber("longitudinalSteelCm2", event.target.value)
              }
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <SubmitButton />
        </div>
      </form>
    </FormCard>
  );
}

export function SlabForm({
  onCalculate,
}: {
  onCalculate: (result: SlabResult) => void;
}) {
  const [values, setValues] = useState<SlabInputs>({
    spanM: 5,
    slabType: "solid",
  });
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      onCalculate(calculateSlab(values));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <FormCard
      title="Parámetros de la losa"
      subtitle="Espesor preliminar por relación de luz para losa maciza o nervada."
      error={error}
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Luz crítica (L)" unit="metros">
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.01"
            value={values.spanM}
            onChange={(event) =>
              setValues({ ...values, spanM: Number(event.target.value) })
            }
          />
        </Field>
        <Field label="Tipo de losa">
          <select
            className={inputClass}
            value={values.slabType}
            onChange={(event) =>
              setValues({
                ...values,
                slabType: event.target.value as SlabInputs["slabType"],
              })
            }
          >
            <option value="solid">Maciza</option>
            <option value="ribbed">Aligerada (nervada)</option>
          </select>
        </Field>
        <div className="rounded-lg border-l-4 border-[#FACC15] bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <div className="flex gap-2">
            <Info aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
            <p>
              Se aplicará <strong>L/25</strong> para losa maciza y{" "}
              <strong>L/21</strong> para losa nervada.
            </p>
          </div>
        </div>
        <SubmitButton />
      </form>
    </FormCard>
  );
}

export function TechnicalDisclaimer() {
  return (
    <aside className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0" size={19} />
        <p className="leading-6">
          <strong>Predimensionamiento:</strong> estos resultados orientan la
          geometría inicial. El diseño final requiere análisis estructural,
          combinaciones de carga, detallado y revisión de un profesional.
        </p>
      </div>
    </aside>
  );
}
