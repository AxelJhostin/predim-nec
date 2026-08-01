"use client";

import { useState, type FormEvent } from "react";
import { ExamplePresets } from "@/components/ExamplePresets";
import { beamExamples } from "@/presets";
import { calculateBeam, type BeamInputs, type BeamResult } from "@/calculations";
import {
  Field,
  FormCard,
  SaveElementControl,
  SubmitButton,
  inputClass,
} from "./primitives";

export function BeamForm({
  onCalculate,
  onSave,
  onOpenProjectSummary,
}: {
  onCalculate: (result: BeamResult) => void;
  onSave: (label: string, result: BeamResult) => void;
  onOpenProjectSummary?: () => void;
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
          onOpenProjectSummary={onOpenProjectSummary}
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
