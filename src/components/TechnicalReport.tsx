"use client";

import {
  ArrowLeft,
  Building2,
  FileCheck2,
  Printer,
  TriangleAlert,
} from "lucide-react";
import { ComplianceTable } from "@/components/ComplianceTable";
import {
  formatNumber,
  type CalculationResult,
} from "@/utils/necCalculations";
import { useProject } from "@/context/ProjectContext";

interface TechnicalReportProps {
  result: CalculationResult;
  onClose: () => void;
}

function parameterRows(result: CalculationResult) {
  if (result.kind === "beam") {
    return [
      ["Luz de la viga", `${formatNumber(result.inputs.spanM, 2)} m`],
      ["Tipo de apoyo", result.inputs.supportType],
      ["Carga de diseño", `${formatNumber(result.inputs.designLoadKnM)} kN/m`],
      ["Regla aplicada", `h = L / ${result.supportDivisor}`],
      ["Fluencia fy", `${formatNumber(result.inputs.steelYieldMpa)} MPa`],
      ["Recubrimiento", `${formatNumber(result.inputs.coverCm)} cm`],
    ];
  }
  if (result.kind === "column") {
    return [
      ["Área tributaria", `${formatNumber(result.inputs.tributaryAreaM2)} m²`],
      ["Número de pisos", `${result.inputs.floors} niveles`],
      ["Carga de servicio", `${formatNumber(result.appliedServiceLoadKnM2)} kN/m²`],
      ["Tipo de columna", result.inputs.columnType],
      ["Factor de posición", formatNumber(result.positionFactor, 2)],
      ["Factor de área", formatNumber(result.areaReductionFactor, 2)],
      ["Longitud libre", `${formatNumber(result.inputs.clearHeightM)} m`],
      ["Factor efectivo k", formatNumber(result.inputs.effectiveLengthFactor, 2)],
      ["Acero longitudinal As", `${formatNumber(result.inputs.longitudinalSteelCm2)} cm²`],
      ["Resistencia f'c", `${result.concreteStrengthMpa} MPa`],
    ];
  }
  return [
    ["Luz crítica", `${formatNumber(result.inputs.spanM, 2)} m`],
    [
      "Tipo de losa",
      result.inputs.slabType === "solid" ? "Maciza" : "Aligerada (nervada)",
    ],
    ["Relación aplicada", `L / ${result.divisor}`],
    ["Normativa de referencia", "NEC-SE-HM"],
  ];
}

function resultRows(result: CalculationResult) {
  if (result.kind === "beam") {
    return [
      ["Sección recomendada", `${formatNumber(result.widthCm)} × ${formatNumber(result.depthCm)} cm`],
      ["Inercia Ix", `${formatNumber(result.inertiaCm4, 0)} cm⁴`],
      ["Peso propio estimado", `${formatNumber(result.selfWeightKnM, 2)} kN/m`],
      ["Momento último Mu", `${formatNumber(result.ultimateMomentKnM, 2)} kN·m`],
      ["Resistencia φMn", `${formatNumber(result.designResistanceKnM, 2)} kN·m`],
    ];
  }
  if (result.kind === "column") {
    return [
      ["Sección recomendada", `${formatNumber(result.sideCm)} × ${formatNumber(result.sideCm)} cm`],
      ["Carga de servicio P", `${formatNumber(result.serviceLoadKn, 1)} kN`],
      ["Área requerida Ag", `${formatNumber(result.requiredAreaCm2, 0)} cm²`],
      ["Área bruta adoptada", `${formatNumber(result.grossAreaCm2, 0)} cm²`],
      ["Esbeltez λ", result.slenderness.toFixed(1)],
      ["Cuantía ρ", `${(result.steelRatio * 100).toFixed(2)}%`],
    ];
  }
  return [
    ["Espesor recomendado", `${formatNumber(result.thicknessCm)} cm`],
    ["Relación luz/peralte", `L / ${result.divisor}`],
  ];
}

export function TechnicalReport({ result, onClose }: TechnicalReportProps) {
  const { project } = useProject();
  const elementName =
    result.kind === "beam"
      ? "Viga de hormigón armado"
      : result.kind === "column"
        ? "Columna de hormigón armado"
        : "Losa de hormigón armado";
  const today = new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
  }).format(new Date());
  const projectDate = project.metadata.date
    ? new Intl.DateTimeFormat("es-EC", { dateStyle: "long" }).format(
        new Date(`${project.metadata.date}T00:00:00`),
      )
    : today;
  const projectMetadata = [
    ["Proyecto", project.metadata.name || "Sin definir"],
    ["Responsable", project.metadata.responsible || "Sin definir"],
    ["Institución", project.metadata.institution || "Sin definir"],
    ["Ubicación", project.metadata.location || "Ecuador"],
    ["Fecha", projectDate],
  ];

  return (
    <div className="report-screen min-h-screen bg-slate-100">
      <div className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Volver al cálculo
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E65100] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#C84600]"
          >
            <Printer aria-hidden="true" size={17} />
            Imprimir / guardar PDF
          </button>
        </div>
      </div>

      <main className="print-container mx-auto my-8 max-w-[1000px] bg-white p-6 shadow-xl sm:p-10">
        <header className="report-letterhead border-b-4 border-[#E65100] pb-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#E65100]">
                <Building2 aria-hidden="true" size={22} />
                <span className="text-sm font-extrabold uppercase tracking-[0.18em]">
                  PreDim NEC
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Reporte de predimensionamiento
              </h1>
              <p className="mt-1 text-sm text-slate-500">{elementName}</p>
            </div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Norma Ecuatoriana de la Construcción
            </p>
          </div>
          <dl className="report-metadata-grid mt-5 grid gap-px overflow-hidden rounded-lg border border-slate-300 bg-slate-300 sm:grid-cols-2 lg:grid-cols-5">
            {projectMetadata.map(([label, value]) => (
              <div key={label} className="bg-white p-3">
                <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {label}
                </dt>
                <dd className="mt-1.5 font-mono text-xs font-semibold text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <ReportSection number="01" title="Parámetros de entrada">
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {parameterRows(result).map(([label, value]) => (
              <div key={label} className="technical-border rounded-lg bg-slate-50 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {label}
                </dt>
                <dd className="mt-2 font-mono text-sm font-bold text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </ReportSection>

        <ReportSection number="02" title="Resultados de predimensionamiento">
          <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
            <div className="blueprint-grid flex min-h-64 items-center justify-center rounded-xl border border-slate-200 p-8">
              <div className="border-l-4 border-[#E65100] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Dimensión principal
                </p>
                <p className="mt-2 font-mono text-3xl font-black text-slate-950">
                  {resultRows(result)[0][1]}
                </p>
              </div>
            </div>
            <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200">
              {resultRows(result).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-xs font-semibold text-slate-500">{label}</dt>
                  <dd className="text-right font-mono text-sm font-bold text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ReportSection>

        <ReportSection number="03" title="Procedimiento y referencias">
          <ol className="space-y-4 rounded-xl border border-slate-200 p-5">
            {result.procedure.map((step) => (
              <li key={step.title}>
                <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-700">
                  {step.title}
                </p>
                <p className="mt-1 font-mono text-xs leading-5 text-slate-700">
                  {step.detail}
                </p>
                {step.reference && (
                  <p className="mt-1 text-[11px] leading-5 text-sky-800">
                    Referencia: {step.reference}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </ReportSection>

        <ReportSection number="04" title="Cumplimiento normativo">
          <div className="rounded-xl border border-slate-200">
            <ComplianceTable criteria={result.compliance} compact />
          </div>
        </ReportSection>

        <ReportSection number="05" title="Notas técnicas">
          <div className="flex gap-3 rounded-xl border-l-4 border-[#FACC15] bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <TriangleAlert aria-hidden="true" className="mt-0.5 shrink-0" size={20} />
            <ul className="list-disc space-y-1 pl-4">
              <li>Este documento corresponde únicamente a un predimensionamiento.</li>
              <li>Las cargas ingresadas y las condiciones de apoyo deben verificarse en el modelo estructural.</li>
              <li>Los criterios “No evaluado” requieren diseño y detallado de acero conforme a NEC-SE-HM.</li>
              <li>El diseño definitivo debe ser revisado y firmado por un profesional competente.</li>
            </ul>
          </div>
        </ReportSection>

        <footer className="print-footer report-signature mt-12 grid gap-12 border-t border-slate-300 pt-14 sm:grid-cols-2">
          <div className="border-t border-slate-500 pt-2 text-xs text-slate-500">
            <p>Firma del responsable</p>
            <span className="mt-1 block font-mono text-[10px]">
              {project.metadata.responsible || "Nombre y firma"}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 border-t border-slate-500 pt-2 text-xs text-slate-500">
            <span>
              Revisión estructural
              <br />
              <span className="font-mono text-[10px]">
                Nombre, registro profesional y firma
              </span>
            </span>
            <FileCheck2 aria-hidden="true" size={24} />
          </div>
          <p className="sm:col-span-2 text-[10px] text-slate-400">
            Generado con PreDim NEC · Hernández Axel · PUCE sede Portoviejo
          </p>
        </footer>
      </main>
    </div>
  );
}

function ReportSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="report-section mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm font-black text-[#E65100]">{number}</span>
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}
