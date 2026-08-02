"use client";

import { useState, type FormEvent } from "react";
import { ExamplePresets } from "@/components/ExamplePresets";
import { slabExamples } from "@/presets";
import { calculateSlab, type SlabInputs, type SlabResult } from "@/calculations";
import {
  Field,
  FormCard,
  SaveElementControl,
  SubmitButton,
  inputClass,
} from "./primitives";

const defaultSlabInputs: SlabInputs = {
  spanM: 5,
  slabType: "solid",
  supportType: "Continua",
  designLoadKnM2: 8,
  steelYieldMpa: 420,
  concreteStrengthMpa: 21,
  coverCm: 2,
};

export function SlabForm({
  onCalculate,
  onSave,
  onOpenProjectSummary,
  initialValues,
}: {
  onCalculate: (result: SlabResult) => void;
  onSave: (label: string, result: SlabResult) => void;
  onOpenProjectSummary?: () => void;
  initialValues?: Partial<SlabInputs>;
}) {
  const [values, setValues] = useState<SlabInputs>({
    ...defaultSlabInputs,
    ...initialValues,
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
          onOpenProjectSummary={onOpenProjectSummary}
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
