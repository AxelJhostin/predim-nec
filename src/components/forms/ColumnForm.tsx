"use client";

import { useState, type FormEvent } from "react";
import { ExamplePresets } from "@/components/ExamplePresets";
import { columnExamples } from "@/presets";
import {
  calculateColumn,
  type ColumnInputs,
  type ColumnResult,
} from "@/calculations";
import {
  Field,
  FormCard,
  SaveElementControl,
  SubmitButton,
  inputClass,
} from "./primitives";

export function ColumnForm({
  onCalculate,
  onSave,
  onOpenProjectSummary,
}: {
  onCalculate: (result: ColumnResult) => void;
  onSave: (label: string, result: ColumnResult) => void;
  onOpenProjectSummary?: () => void;
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
            onOpenProjectSummary={onOpenProjectSummary}
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
