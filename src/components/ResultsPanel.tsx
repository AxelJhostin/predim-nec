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
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
        <ShieldAlert aria-hidden="true" size={14} />
        {failed} criterio{failed === 1 ? "" : "s"} por revisar
      </span>
    );
  }

  const minimumApplied =
    result.kind === "beam" || result.kind === "column"
      ? result.minimumApplied
      : false;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
      <ShieldCheck aria-hidden="true" size={14} />
      {minimumApplied ? "Mínimo NEC aplicado" : "Criterios previos OK"}
    </span>
  );
}

function SectionSchematic({ result }: { result: CalculationResult }) {
  if (result.kind === "slab") {
    return (
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blueprint-grid sm:h-48">
        <div className="relative h-10 w-4/5 border-2 border-sky-700 bg-sky-100/90">
          <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full pl-2 font-mono text-[11px] font-semibold text-sky-900 sm:text-xs">
            h = {formatNumber(result.thicknessCm)} cm
          </span>
        </div>
      </div>
    );
  }

  const width = result.kind === "beam" ? result.widthCm : result.sideCm;
  const height = result.kind === "beam" ? result.depthCm : result.sideCm;

  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blueprint-grid sm:h-64">
      <div
        className={`relative border-[3px] border-slate-700 bg-slate-100 ${
          result.kind === "column"
            ? "h-36 w-36 sm:h-40 sm:w-40"
            : "h-40 w-24 sm:h-44 sm:w-28"
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
              className={`absolute h-2.5 w-2.5 rounded-full bg-orange-700 ${position}`}
            />
          ))}
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] font-semibold text-slate-700 sm:text-xs">
          b = {formatNumber(width)} cm
        </span>
        <span className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full pl-2 font-mono text-[11px] font-semibold text-slate-700 sm:text-xs">
          h = {formatNumber(height)} cm
        </span>
      </div>
    </div>
  );
}

function ResultMetrics({ result }: { result: CalculationResult }) {
  if (result.kind === "beam") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
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
      <div className="grid grid-cols-2 gap-2.5">
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
    <div className="grid grid-cols-2 gap-2.5">
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
    <div className="rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-0.5 font-mono font-semibold text-slate-950 ${
          compact ? "text-sm leading-5" : "text-base sm:text-lg"
        }`}
      >
        {value}
        {unit && (
          <span className="ml-1 text-[11px] font-medium text-slate-500">{unit}</span>
        )}
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
      className={`structural-card overflow-hidden outline-none ${
        justUpdated ? "result-panel-updated" : ""
      }`}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {liveMessage}
      </p>

      <div className="border-b border-slate-200 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
              Resultados
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              {title}
            </h2>
          </div>
          {!isDemo && <OverallStatus result={result} />}
        </div>

        {isDemo ? (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Ejemplo de arranque. Usa{" "}
            <span className="font-semibold text-slate-700">
              Calcular predimensionamiento
            </span>{" "}
            o un ejemplo listo para actualizar estos valores.
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Tu cálculo actual</p>
        )}

        <p className="mt-5 font-mono text-4xl font-bold tracking-tight text-slate-950 sm:text-[2.75rem]">
          {section}
        </p>
        <p className="mt-1.5 max-w-xl font-mono text-sm leading-6 text-slate-600">
          {reinforcementLine}
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_1fr] md:items-start">
          <SectionSchematic result={result} />
          <div className="space-y-3">
            <ResultMetrics result={result} />
            <p className="flex gap-2 text-[12px] leading-5 text-slate-500">
              <Info
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-slate-400"
                size={15}
              />
              Anteproyecto académico. El diseño final requiere análisis,
              combinaciones, detallado y revisión profesional.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between px-5 py-3.5 sm:px-7">
          <h3 className="text-sm font-semibold text-slate-900">
            Cumplimiento normativo
          </h3>
          <span className="font-mono text-[10px] text-slate-400">NEC-SE</span>
        </div>
        <ComplianceTable criteria={result.compliance} compact />
      </div>

      <div className="border-t border-slate-200 px-5 py-4 sm:px-7">
        <details className="group rounded-lg border border-slate-200 bg-slate-50/50">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-800">
            <BookOpenText aria-hidden="true" className="text-sky-700" size={17} />
            Procedimiento y referencias NEC
            <span className="ml-auto font-mono text-base text-slate-400 transition group-open:rotate-45">
              +
            </span>
          </summary>
          <ol className="space-y-4 border-t border-slate-200 px-4 py-4">
            {result.procedure.map((step) => (
              <li key={step.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">
                  {step.title}
                </p>
                <p className="mt-1 font-mono text-xs leading-6 text-slate-700">
                  {step.detail}
                </p>
                {step.reference && (
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {step.reference}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </details>
      </div>

      <div className="border-t border-slate-200 px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={onOpenReport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-sky-500 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:w-auto"
        >
          <Download aria-hidden="true" size={16} />
          Exportar / imprimir reporte
        </button>
      </div>
    </section>
  );
}
