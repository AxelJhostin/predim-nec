"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  calculateSection,
  type SectionInputs,
  type SectionShape,
} from "@/calculations/sections";
import { formatNumber } from "@/calculations";
import { ToolkitShell } from "@/components/ToolkitShell";
import { Metric, NumberField, inputClass } from "@/components/tools/primitives";
import { moduleFaqs } from "@/lib/moduleFaqs";

export function GeoSectionsTool() {
  const [shape, setShape] = useState<SectionShape>("rectangle");
  const [widthCm, setWidthCm] = useState(25);
  const [heightCm, setHeightCm] = useState(40);
  const [diameterCm, setDiameterCm] = useState(30);
  const [flangeWidthCm, setFlangeWidthCm] = useState(60);
  const [flangeThicknessCm, setFlangeThicknessCm] = useState(8);
  const [webWidthCm, setWebWidthCm] = useState(20);
  const [webHeightCm, setWebHeightCm] = useState(40);
  const [error, setError] = useState("");

  const inputs: SectionInputs = useMemo(() => {
    if (shape === "circle") {
      return { shape, diameterCm };
    }
    if (shape === "tee") {
      return {
        shape,
        flangeWidthCm,
        flangeThicknessCm,
        webWidthCm,
        webHeightCm,
      };
    }
    return { shape: "rectangle", widthCm, heightCm };
  }, [
    shape,
    widthCm,
    heightCm,
    diameterCm,
    flangeWidthCm,
    flangeThicknessCm,
    webWidthCm,
    webHeightCm,
  ]);

  const result = useMemo(() => {
    try {
      return calculateSection(inputs);
    } catch {
      return null;
    }
  }, [inputs]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      calculateSection(inputs);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los datos.");
    }
  }

  return (
    <ToolkitShell
      eyebrow="Básico · CivilKit EC"
      title="GeoSecciones"
      description="Calcula área, centroide, momentos de inercia, módulo de sección y radio de giro para secciones rectangulares, circulares y en T."
      faqs={moduleFaqs.geo}
      aside={
        result ? (
          <section className="structural-card p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700">
              Resultados
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">
              {result.summary}
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-2.5">
              <Metric label="Área A" value={`${formatNumber(result.areaCm2, 2)} cm²`} />
              <Metric
                label="Centroide ȳ"
                value={`${formatNumber(result.centroidYCm, 2)} cm`}
              />
              <Metric
                label="Ix"
                value={`${formatNumber(result.inertiaXCm4, 2)} cm⁴`}
              />
              <Metric
                label="Iy"
                value={`${formatNumber(result.inertiaYCm4, 2)} cm⁴`}
              />
              <Metric
                label="S superior"
                value={`${formatNumber(result.sectionModulusTopCm3, 2)} cm³`}
              />
              <Metric
                label="S inferior"
                value={`${formatNumber(result.sectionModulusBottomCm3, 2)} cm³`}
              />
              <Metric
                label="rx"
                value={`${formatNumber(result.radiusGyrationXCm, 2)} cm`}
              />
              <Metric
                label="ry"
                value={`${formatNumber(result.radiusGyrationYCm, 2)} cm`}
              />
            </dl>
            <ol className="mt-5 space-y-3 border-t border-slate-200 pt-4">
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
            Completa las dimensiones y pulsa calcular para ver las propiedades.
          </section>
        )
      }
    >
      <form onSubmit={submit} className="structural-card space-y-4 p-5 sm:p-6">
        <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-slate-600">
          Forma de la sección
          <select
            className={inputClass}
            value={shape}
            onChange={(event) => setShape(event.target.value as SectionShape)}
          >
            <option value="rectangle">Rectángulo</option>
            <option value="circle">Círculo</option>
            <option value="tee">T (ala + alma)</option>
          </select>
        </label>

        {shape === "rectangle" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Ancho b" unit="cm" value={widthCm} onChange={setWidthCm} />
            <NumberField label="Peralte h" unit="cm" value={heightCm} onChange={setHeightCm} />
          </div>
        )}

        {shape === "circle" && (
          <NumberField
            label="Diámetro D"
            unit="cm"
            value={diameterCm}
            onChange={setDiameterCm}
          />
        )}

        {shape === "tee" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Ancho del ala bf" unit="cm" value={flangeWidthCm} onChange={setFlangeWidthCm} />
            <NumberField label="Espesor del ala tf" unit="cm" value={flangeThicknessCm} onChange={setFlangeThicknessCm} />
            <NumberField label="Ancho del alma bw" unit="cm" value={webWidthCm} onChange={setWebWidthCm} />
            <NumberField label="Altura del alma hw" unit="cm" value={webHeightCm} onChange={setWebHeightCm} />
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-[#E65100] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C84600]"
        >
          Calcular propiedades
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Ejes: x horizontal (flexión fuerte habitual) e y vertical. La T asume
          simetría y ala superior continua.
        </p>
      </form>
    </ToolkitShell>
  );
}

