import { BookOpenText, Download, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { ComplianceTable } from "@/components/ComplianceTable";
import {
  formatNumber,
  type CalculationResult,
} from "@/calculations";

function OverallStatus({ result }: { result: CalculationResult }) {
  const failed = result.compliance.filter(
    (criterion) => criterion.status === "fail",
  ).length;

  if (failed > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-700 ring-1 ring-inset ring-red-200">
        <ShieldAlert aria-hidden="true" size={13} />
        {failed} criterio{failed === 1 ? "" : "s"} por revisar
      </span>
    );
  }

  const minimumApplied =
    result.kind === "beam" || result.kind === "column"
      ? result.minimumApplied
      : false;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-inset ring-emerald-200">
      <ShieldCheck aria-hidden="true" size={13} />
      {minimumApplied ? "Mínimo NEC aplicado" : "Cumple criterios previos"}
    </span>
  );
}

function SectionSchematic({ result }: { result: CalculationResult }) {
  if (result.kind === "slab") {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-blueprint-grid">
        <div className="relative h-10 w-4/5 border-2 border-sky-700 bg-sky-100 shadow-[inset_0_-8px_0_rgba(2,132,199,0.12)]">
          <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full pl-2 font-mono text-[11px] font-bold text-sky-900 sm:-right-4 sm:text-xs">
            h = {formatNumber(result.thicknessCm)} cm
          </span>
        </div>
      </div>
    );
  }

  const width = result.kind === "beam" ? result.widthCm : result.sideCm;
  const height = result.kind === "beam" ? result.depthCm : result.sideCm;

  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-blueprint-grid">
      <div
        className={`relative border-[3px] border-slate-700 bg-slate-100 shadow-lg ${
          result.kind === "column" ? "h-40 w-40" : "h-44 w-28"
        }`}
      >
        {result.kind === "column" &&
          [
            "left-3 top-3",
            "right-3 top-3",
            "left-3 bottom-3",
            "right-3 bottom-3",
            "left-3 top-1/2 -translate-y-1/2",
            "right-3 top-1/2 -translate-y-1/2",
          ].map((position) => (
            <span
              key={position}
              className={`absolute h-3 w-3 rounded-full bg-orange-700 ${position}`}
            />
          ))}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-bold text-slate-700 sm:text-xs">
          b = {formatNumber(width)} cm
        </span>
        <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full pl-2 font-mono text-[11px] font-bold text-slate-700 sm:-right-3 sm:text-xs">
          h = {formatNumber(height)} cm
        </span>
      </div>
    </div>
  );
}

function ResultMetrics({ result }: { result: CalculationResult }) {
  if (result.kind === "beam") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Momento Mu" value={formatNumber(result.ultimateMomentKnM, 1)} unit="kN·m" />
        <Metric label="Resistencia φMn" value={formatNumber(result.designResistanceKnM, 1)} unit="kN·m" />
        <Metric label="As requerido" value={formatNumber(result.requiredSteelAreaCm2, 2)} unit="cm²" />
        <Metric label="Acero flexión" value={result.flexuralBarProposal} />
        <Metric label="Cortante Vu" value={formatNumber(result.ultimateShearKn, 1)} unit="kN" />
        <Metric label="φVc hormigón" value={formatNumber(0.75 * result.concreteShearKn, 1)} unit="kN" />
        <div className="col-span-2">
          <Metric label="Estribos" value={result.stirrupProposal} compact />
        </div>
      </div>
    );
  }

  if (result.kind === "column") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Pu" value={formatNumber(result.ultimateLoadKn, 1)} unit="kN" />
        <Metric label="φPn" value={formatNumber(result.designAxialResistanceKn, 1)} unit="kN" />
        <Metric label="As requerido" value={formatNumber(result.requiredSteelAreaCm2, 2)} unit="cm²" />
        <Metric label="Acero longitudinal" value={result.longitudinalBarProposal} />
        <Metric label="Esbeltez λ" value={result.slenderness.toFixed(1)} />
        <Metric label="Cuantía ρ" value={(result.steelRatio * 100).toFixed(2)} unit="%" />
        <div className="col-span-2">
          <Metric label="Estribos" value={result.tieProposal} compact />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="Mu" value={formatNumber(result.ultimateMomentKnM, 2)} unit="kN·m/m" />
      <Metric label="φMn" value={formatNumber(result.designResistanceKnM, 2)} unit="kN·m/m" />
      <Metric label="As flexión" value={formatNumber(result.requiredSteelAreaCm2PerM, 2)} unit="cm²/m" />
      <Metric label="Propuesta" value={result.flexuralBarProposal} />
      <div className="col-span-2">
        <Metric label="Temperatura / distribución" value={result.temperatureSteelProposal} compact />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  compact = false,
}: {
  label: string;
  value: string;
  unit?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 font-mono font-bold text-slate-950 ${
          compact ? "text-sm leading-5" : "text-lg"
        }`}
      >
        {value}
        {unit && <span className="ml-1 text-xs font-medium text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}

export function ResultsPanel({
  result,
  onOpenReport,
  isDemo = false,
  justUpdated = false,
  liveMessage = "",
}: {
  result: CalculationResult;
  onOpenReport: () => void;
  isDemo?: boolean;
  justUpdated?: boolean;
  liveMessage?: string;
}) {
  const section =
    result.kind === "beam"
      ? `${formatNumber(result.widthCm)} × ${formatNumber(result.depthCm)} cm`
      : result.kind === "column"
        ? `${formatNumber(result.sideCm)} × ${formatNumber(result.sideCm)} cm`
        : `${formatNumber(result.thicknessCm)} cm`;
  const title =
    result.kind === "beam" || result.kind === "column"
      ? "Sección y refuerzo sugeridos"
      : "Espesor y refuerzo sugeridos";
  const reinforcementLine =
    result.kind === "beam"
      ? `${result.flexuralBarProposal} · ${result.stirrupProposal}`
      : result.kind === "column"
        ? `${result.longitudinalBarProposal} · ${result.tieProposal}`
        : `${result.flexuralBarProposal}`;

  return (
    <section
      id="calculation-results"
      tabIndex={-1}
      className={`structural-card overflow-hidden outline-none transition ring-offset-2 ${
        justUpdated ? "result-panel-updated ring-2 ring-sky-400" : ""
      }`}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </p>
      <div className="border-b border-slate-200 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-700">
              Diseño simplificado NEC / ACI
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">{title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isDemo ? (
              <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800 ring-1 ring-inset ring-amber-200">
                Ejemplo inicial
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-800 ring-1 ring-inset ring-sky-200">
                Tu cálculo
              </span>
            )}
            <OverallStatus result={result} />
          </div>
        </div>

        {isDemo && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs leading-5 text-amber-950">
            Estos valores son un ejemplo de arranque. Pulsa{" "}
            <strong>Calcular predimensionamiento</strong> o elige un ejemplo
            listo para actualizar el resultado con tus datos.
          </p>
        )}

        <p className="mt-5 font-mono text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {section}
        </p>
        <p className="mt-2 font-mono text-sm font-semibold text-slate-600">
          {reinforcementLine}
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-[1.15fr_1fr]">
          <SectionSchematic result={result} />
          <div>
            <ResultMetrics result={result} />
            <div className="mt-3 flex gap-2 rounded-lg border-l-4 border-[#FACC15] bg-amber-50 p-3.5 text-xs leading-5 text-amber-950">
              <Info aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
              Diseño simplificado útil para anteproyecto. El diseño final
              requiere análisis estructural, combinaciones de carga, detallado y
              revisión de un profesional.
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between px-5 py-4 sm:px-7">
          <h3 className="text-sm font-bold text-slate-900">
            Cumplimiento normativo
          </h3>
          <span className="font-mono text-[10px] text-slate-400">NEC-SE</span>
        </div>
        <ComplianceTable criteria={result.compliance} compact />
      </div>

      <div className="border-t border-slate-200 px-5 py-5 sm:px-7">
        <details className="group rounded-xl border border-sky-200 bg-sky-50/60">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 text-sm font-bold text-sky-950">
            <BookOpenText aria-hidden="true" size={18} />
            Ver procedimiento paso a paso y referencias NEC
            <span className="ml-auto font-mono text-lg transition group-open:rotate-45">
              +
            </span>
          </summary>
          <ol className="space-y-4 border-t border-sky-200 px-4 py-5">
            {result.procedure.map((step) => (
              <li key={step.title}>
                <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-700">
                  {step.title}
                </p>
                <p className="mt-1 font-mono text-xs leading-6 text-slate-700">
                  {step.detail}
                </p>
                {step.reference && (
                  <p className="mt-1.5 text-[11px] leading-5 text-sky-800">
                    Referencia: {step.reference}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </details>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-5 sm:px-7">
        <button
          type="button"
          onClick={onOpenReport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-sky-500 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:w-auto"
        >
          <Download aria-hidden="true" size={17} />
          Exportar / imprimir reporte
        </button>
      </div>
    </section>
  );
}
