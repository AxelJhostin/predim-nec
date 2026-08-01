"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Calculator,
  CircleHelp,
  Ruler,
  Save,
  ShieldCheck,
} from "lucide-react";
import { ExamplePresets } from "@/components/ExamplePresets";
import { SCOPE_SHORT } from "@/lib/scope";
import {
  beamExamples,
  columnExamples,
  slabExamples,
} from "@/lib/studyPresets";
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

function SaveElementControl({
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

export function BeamForm({
  onCalculate,
  onSave,
}: {
  onCalculate: (result: BeamResult) => void;
  onSave: (label: string, result: BeamResult) => void;
}) {
  const [values, setValues] = useState<BeamInputs>({
    spanM: 6,
    supportType: "Ambos extremos continuos",
    designLoadKnM: 8.5,
    steelYieldMpa: 420,
    coverCm: 4,
    concreteStrengthMpa: 21,
    stirrupDiameterMm: 10,
  });
  const [error, setError] = useState("");

  function applyExample(id: string) {
    const example = beamExamples.find((item) => item.id === id);
    if (!example) {
      return;
    }
    try {
      setValues(example.values);
      onCalculate(calculateBeam(example.values));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

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
      subtitle="Diseño simplificado a flexión y corte conforme a NEC-SE-HM / ACI 318."
      error={error}
    >
      <ExamplePresets options={beamExamples} onSelect={applyExample} />
      <form onSubmit={submit} className="space-y-5">
        <Field
          label="Luz de la viga (L)"
          unit="metros"
          help="Distancia entre apoyos o cara a cara de columnas. Usa la luz libre o la luz de cálculo que te indique tu enunciado."
        >
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
        <Field
          label="Tipo de apoyo"
          help="Define el divisor luz/peralte: simple L/16, un extremo continuo L/18.5, ambos continuos L/21 y voladizo L/8."
        >
          <select
            className={inputClass}
            value={values.supportType}
            onChange={(event) =>
              setValues({
                ...values,
                supportType: event.target.value as BeamInputs["supportType"],
              })
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
          unit="kN/m"
          hint="Carga lineal mayorada. Mu y Vu dependen del tipo de apoyo."
          help="Incluye peso propio estimado y sobrecargas lineales del caso. No copies valores de ejemplo sin revisarlos para tu proyecto."
        >
          <input
            className={inputClass}
            type="number"
            min="0.1"
            step="0.1"
            value={values.designLoadKnM}
            onChange={(event) =>
              setValues({
                ...values,
                designLoadKnM: Number(event.target.value),
              })
            }
          />
        </Field>
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.1em] text-slate-700">
            Parámetros avanzados
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="Fluencia del acero (fy)"
              unit="MPa"
              hint="Valor predeterminado para acero Grado 60."
            >
              <input
                className={inputClass}
                type="number"
                min="100"
                step="10"
                value={values.steelYieldMpa}
                onChange={(event) =>
                  setValues({
                    ...values,
                    steelYieldMpa: Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field
              label="Resistencia del hormigón (f'c)"
              unit="MPa"
              help="Resistencia especificada a compresión. 21 MPa es un valor típico de anteproyecto en Ecuador."
            >
              <input
                className={inputClass}
                type="number"
                min="17"
                step="1"
                value={values.concreteStrengthMpa}
                onChange={(event) =>
                  setValues({
                    ...values,
                    concreteStrengthMpa: Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field
              label="Recubrimiento a centroide (d = h − c)"
              unit="cm"
              help="Distancia desde la fibra extrema a tracción hasta el centroide del acero longitudinal."
            >
              <input
                className={inputClass}
                type="number"
                min="1"
                step="0.5"
                value={values.coverCm}
                onChange={(event) =>
                  setValues({
                    ...values,
                    coverCm: Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field
              label="Diámetro de estribo"
              unit="mm"
              help="Diámetro del acero transversal. Por defecto Ø10 mm a dos ramas."
            >
              <input
                className={inputClass}
                type="number"
                min="6"
                step="1"
                value={values.stirrupDiameterMm}
                onChange={(event) =>
                  setValues({
                    ...values,
                    stirrupDiameterMm: Number(event.target.value),
                  })
                }
              />
            </Field>
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-500">
            El cálculo propone As y estribos con φ = 0,90 (flexión) y φ = 0,75
            (corte). El diseño final requiere análisis estructural,
            combinaciones de carga, detallado y revisión de un profesional.
          </p>
        </details>
        <SubmitButton />
        <SaveElementControl
          defaultLabel="V-101"
          onSave={(label) => {
            const calculatedResult = calculateBeam(values);
            onCalculate(calculatedResult);
            onSave(label, calculatedResult);
          }}
        />
      </form>
    </FormCard>
  );
}

export function ColumnForm({
  onCalculate,
  onSave,
}: {
  onCalculate: (result: ColumnResult) => void;
  onSave: (label: string, result: ColumnResult) => void;
}) {
  const [values, setValues] = useState<ColumnInputs>({
    tributaryAreaM2: 25,
    floors: 5,
    columnType: "Central",
    serviceLoadKnM2: 8,
    clearHeightM: 3,
    effectiveLengthFactor: 1,
    concreteStrengthMpa: 21,
    steelYieldMpa: 420,
    tieDiameterMm: 10,
  });
  const [error, setError] = useState("");

  function setNumber(key: keyof ColumnInputs, value: string) {
    setValues({ ...values, [key]: Number(value) });
  }

  function applyExample(id: string) {
    const example = columnExamples.find((item) => item.id === id);
    if (!example) {
      return;
    }
    try {
      setValues(example.values);
      onCalculate(calculateColumn(example.values));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
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
      subtitle="Diseño simplificado a carga axial, acero longitudinal y estribos."
      error={error}
    >
      <ExamplePresets options={columnExamples} onSelect={applyExample} />
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Área tributaria (At)"
          unit="m²"
          help="Superficie de losa o cubierta que descarga sobre la columna. En planta rectangular suele aproximarse como (lx/2)×(ly/2) para interiores."
        >
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
        <Field
          label="Número de pisos"
          unit="niveles"
          help="Cantidad de niveles que aportan carga a la columna. Incluye el piso superior si también descarga."
        >
          <input
            className={inputClass}
            type="number"
            min="1"
            step="1"
            value={values.floors}
            onChange={(event) => setNumber("floors", event.target.value)}
          />
        </Field>
        <Field
          label="Tipo de columna"
          help="Central, perimetral o esquina cambian el factor de posición y el factor de área usado en la estimación."
        >
          <select
            className={inputClass}
            value={values.columnType}
            onChange={(event) =>
              setValues({
                ...values,
                columnType: event.target.value as ColumnInputs["columnType"],
              })
            }
          >
            <option>Central</option>
            <option>Perimetral</option>
            <option>Esquina</option>
          </select>
        </Field>
        <Field
          label="Carga de servicio (q)"
          unit="kN/m²"
          hint="Ingrese 0 para aplicar el valor residencial preliminar de 8,0 kN/m²."
          help="Carga muerta + viva promedio por m². Si dejas 0, PreDim NEC usa 8,0 kN/m² como valor residencial preliminar."
        >
          <input
            className={inputClass}
            type="number"
            min="0"
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
          help="Relaciona la longitud efectiva con la altura libre. k = 1,0 es una hipótesis conservadora inicial."
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
        <details className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.1em] text-slate-700">
            Parámetros avanzados
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="f'c" unit="MPa">
              <input
                className={inputClass}
                type="number"
                min="17"
                step="1"
                value={values.concreteStrengthMpa}
                onChange={(event) =>
                  setNumber("concreteStrengthMpa", event.target.value)
                }
              />
            </Field>
            <Field label="fy" unit="MPa">
              <input
                className={inputClass}
                type="number"
                min="100"
                step="10"
                value={values.steelYieldMpa}
                onChange={(event) =>
                  setNumber("steelYieldMpa", event.target.value)
                }
              />
            </Field>
            <Field label="Diámetro de estribo" unit="mm">
              <input
                className={inputClass}
                type="number"
                min="6"
                step="1"
                value={values.tieDiameterMm}
                onChange={(event) =>
                  setNumber("tieDiameterMm", event.target.value)
                }
              />
            </Field>
          </div>
        </details>
        <div className="sm:col-span-2">
          <SubmitButton />
          <SaveElementControl
            defaultLabel="C-1"
            onSave={(label) => {
              const calculatedResult = calculateColumn(values);
              onCalculate(calculatedResult);
              onSave(label, calculatedResult);
            }}
          />
        </div>
      </form>
    </FormCard>
  );
}

export function SlabForm({
  onCalculate,
  onSave,
}: {
  onCalculate: (result: SlabResult) => void;
  onSave: (label: string, result: SlabResult) => void;
}) {
  const [values, setValues] = useState<SlabInputs>({
    spanM: 5,
    slabType: "solid",
    supportType: "Continua",
    designLoadKnM2: 8,
    steelYieldMpa: 420,
    concreteStrengthMpa: 21,
    coverCm: 2,
  });
  const [error, setError] = useState("");

  function applyExample(id: string) {
    const example = slabExamples.find((item) => item.id === id);
    if (!example) {
      return;
    }
    try {
      setValues(example.values);
      onCalculate(calculateSlab(example.values));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

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
      subtitle="Diseño simplificado de espesor, flexión por metro y acero de temperatura."
      error={error}
    >
      <ExamplePresets options={slabExamples} onSelect={applyExample} />
      <form onSubmit={submit} className="space-y-5">
        <Field
          label="Luz crítica (L)"
          unit="metros"
          help="Usa la luz más desfavorable del paño. En losas rectangulares suele ser la menor luz entre apoyos."
        >
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
        <Field
          label="Tipo de losa"
          help="Maciza aplica L/25 y nervada L/21 como espesor de anteproyecto."
        >
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
        <Field
          label="Condición de apoyo"
          help="Simple usa Mu = wL²/8; continua usa Mu = wL²/11 por metro de ancho."
        >
          <select
            className={inputClass}
            value={values.supportType}
            onChange={(event) =>
              setValues({
                ...values,
                supportType: event.target.value as SlabInputs["supportType"],
              })
            }
          >
            <option>Simplemente apoyada</option>
            <option>Continua</option>
          </select>
        </Field>
        <Field
          label="Carga de diseño"
          unit="kN/m²"
          help="Carga uniformemente distribuida mayorada o de diseño sobre la losa."
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
        <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.1em] text-slate-700">
            Parámetros avanzados
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="f'c" unit="MPa">
              <input
                className={inputClass}
                type="number"
                min="17"
                step="1"
                value={values.concreteStrengthMpa}
                onChange={(event) =>
                  setValues({
                    ...values,
                    concreteStrengthMpa: Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field label="fy" unit="MPa">
              <input
                className={inputClass}
                type="number"
                min="100"
                step="10"
                value={values.steelYieldMpa}
                onChange={(event) =>
                  setValues({
                    ...values,
                    steelYieldMpa: Number(event.target.value),
                  })
                }
              />
            </Field>
            <Field label="Recubrimiento a d" unit="cm">
              <input
                className={inputClass}
                type="number"
                min="1"
                step="0.5"
                value={values.coverCm}
                onChange={(event) =>
                  setValues({
                    ...values,
                    coverCm: Number(event.target.value),
                  })
                }
              />
            </Field>
          </div>
        </details>
        <SubmitButton />
        <SaveElementControl
          defaultLabel="L-1"
          onSave={(label) => {
            const calculatedResult = calculateSlab(values);
            onCalculate(calculatedResult);
            onSave(label, calculatedResult);
          }}
        />
      </form>
    </FormCard>
  );
}

export function TechnicalDisclaimer() {
  return (
    <aside className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0" size={19} />
        <div className="leading-6">
          <p>
            <strong>Alcance técnico:</strong> esta herramienta calcula
            dimensiones y refuerzo simplificado de vigas, columnas y losas para
            anteproyecto o práctica académica.
          </p>
          <p className="mt-2 font-semibold">{SCOPE_SHORT}</p>
        </div>
      </div>
    </aside>
  );
}
