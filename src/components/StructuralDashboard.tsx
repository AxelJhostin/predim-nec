"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Columns3,
  FolderKanban,
  Layers3,
  Menu,
  Minus,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  BeamForm,
  ColumnForm,
  SlabForm,
  TechnicalDisclaimer,
} from "@/components/forms";
import { BrandLogo } from "@/components/BrandLogo";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ProjectSummary } from "@/components/ProjectSummary";
import { TechnicalReport } from "@/components/TechnicalReport";
import { useProject } from "@/context/ProjectContext";
import {
  calculateBeam,
  calculateColumn,
  calculateSlab,
  type BeamResult,
  type CalculationResult,
  type ColumnResult,
  type ElementType,
  type SlabResult,
} from "@/calculations";
import {
  describeHandoffSource,
  type PredimHandoff,
} from "@/lib/predimHandoff";
import { PREDIM_NAME, SITE_NAME } from "@/lib/seo";

interface TabDefinition {
  id: ElementType;
  label: string;
  description: string;
  icon: LucideIcon;
}

const tabs: TabDefinition[] = [
  {
    id: "beam",
    label: "Vigas",
    description: "Sección b × h",
    icon: Minus,
  },
  {
    id: "column",
    label: "Columnas",
    description: "Carga y esbeltez",
    icon: Columns3,
  },
  {
    id: "slab",
    label: "Losas",
    description: "Espesor preliminar",
    icon: Layers3,
  },
];

const initialBeam = calculateBeam({
  spanM: 6,
  supportType: "Ambos extremos continuos",
  designLoadKnM: 8.5,
  steelYieldMpa: 420,
  coverCm: 4,
  concreteStrengthMpa: 21,
  stirrupDiameterMm: 10,
});
const initialColumn = calculateColumn({
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
const initialSlab = calculateSlab({
  spanM: 5,
  slabType: "solid",
  supportType: "Continua",
  designLoadKnM2: 8,
  steelYieldMpa: 420,
  concreteStrengthMpa: 21,
  coverCm: 2,
});

export function StructuralDashboard({
  initialTab = "beam",
  handoff,
}: {
  initialTab?: ElementType;
  /** Preferir pasar desde la página servidor (evita useSearchParams + Suspense). */
  handoff?: PredimHandoff;
}) {
  const beamPatch = handoff?.beam ?? {};
  const columnPatch = handoff?.column ?? {};
  const slabPatch = handoff?.slab ?? {};
  const hasBeamPatch = Object.keys(beamPatch).length > 0;
  const hasColumnPatch = Object.keys(columnPatch).length > 0;
  const hasSlabPatch = Object.keys(slabPatch).length > 0;

  const [activeTab, setActiveTab] = useState<ElementType>(
    handoff?.tab ?? initialTab,
  );
  const [beamResult, setBeamResult] = useState<BeamResult>(() =>
    hasBeamPatch
      ? calculateBeam({ ...initialBeam.inputs, ...beamPatch })
      : initialBeam,
  );
  const [columnResult, setColumnResult] = useState<ColumnResult>(() =>
    hasColumnPatch
      ? calculateColumn({ ...initialColumn.inputs, ...columnPatch })
      : initialColumn,
  );
  const [slabResult, setSlabResult] = useState<SlabResult>(() =>
    hasSlabPatch
      ? calculateSlab({ ...initialSlab.inputs, ...slabPatch })
      : initialSlab,
  );
  const [userCalculated, setUserCalculated] = useState<
    Record<ElementType, boolean>
  >({
    beam: hasBeamPatch,
    column: hasColumnPatch,
    slab: hasSlabPatch,
  });
  const [justUpdated, setJustUpdated] = useState(Boolean(handoff?.applied));
  const [liveMessage, setLiveMessage] = useState(
    handoff?.applied
      ? `Valores cargados desde ${describeHandoffSource(handoff.source)}.`
      : "",
  );
  const [reportOpen, setReportOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectSummaryOpen, setProjectSummaryOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { project, addElement, isHydrated } = useProject();

  const result =
    activeTab === "beam"
      ? beamResult
      : activeTab === "column"
        ? columnResult
        : slabResult;
  const activeDefinition = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const elementCount = isHydrated ? project.elements.length : "…";

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  function selectTab(tab: ElementType) {
    setActiveTab(tab);
    setProjectSummaryOpen(false);
    setMobileMenuOpen(false);
  }

  function openProjectSummary() {
    setProjectSummaryOpen(true);
    setMobileMenuOpen(false);
  }

  function focusResults() {
    const panel = resultsRef.current;
    if (!panel) {
      return;
    }
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    panel.focus({ preventScroll: true });
  }

  function handleCalculated<T extends CalculationResult>(
    kind: ElementType,
    next: T,
    apply: (value: T) => void,
  ) {
    apply(next);
    setUserCalculated((current) => ({ ...current, [kind]: true }));
    setJustUpdated(true);
    setLiveMessage(
      "Resultado actualizado. Revisa la sección de diseño simplificado.",
    );
    window.setTimeout(() => {
      focusResults();
    }, 50);
    window.setTimeout(() => setJustUpdated(false), 2200);
  }

  if (reportOpen) {
    return (
      <TechnicalReport
        result={result}
        onClose={() => setReportOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Cerrar navegación" : "Abrir navegación"}
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
            <Link href="/" className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-200">
              <BrandLogo size={36} priority />
              <div>
                <p className="text-base font-black tracking-tight text-slate-950">
                  {PREDIM_NAME}
                </p>
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
                  Módulo de {SITE_NAME}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openProjectSummary}
              aria-current={projectSummaryOpen ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                projectSummaryOpen
                  ? "border-sky-400 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700"
              }`}
            >
              <FolderKanban aria-hidden="true" size={16} />
              <span className="hidden sm:inline">Proyecto</span>
              <span className="rounded-full bg-sky-100 px-1.5 py-0.5 font-mono text-[10px] text-sky-800">
                {elementCount}
              </span>
            </button>
            <span className="hidden rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-700 ring-1 ring-inset ring-sky-200 sm:inline-flex">
              NEC-SE 2015
            </span>
            <a
              href="https://www.habitatyvivienda.gob.ec/documentos-normativos-nec-norma-ecuatoriana-de-la-construccion/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <BookOpen aria-hidden="true" size={16} />
              <span className="hidden sm:inline">Normativa NEC</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          id="primary-navigation"
          className={`fixed inset-y-16 left-0 z-30 w-64 border-r border-slate-200 bg-white p-4 transition-transform md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)] md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          } no-print`}
        >
          <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Estructura principal
          </p>
          <nav aria-label="Tipos de elemento" className="space-y-1.5">
            <button
              type="button"
              onClick={openProjectSummary}
              aria-current={projectSummaryOpen ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                projectSummaryOpen
                  ? "bg-sky-100 text-sky-900 ring-1 ring-inset ring-sky-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <FolderKanban aria-hidden="true" size={19} />
              <span>
                <span className="block text-sm font-bold">
                  Resumen & Memoria
                </span>
                <span className="block text-[11px] opacity-65">
                  {isHydrated
                    ? `${project.elements.length} elementos guardados`
                    : "Cargando proyecto…"}
                </span>
              </span>
            </button>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = !projectSummaryOpen && tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-sky-100 text-sky-900 ring-1 ring-inset ring-sky-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon aria-hidden="true" size={19} />
                  <span>
                    <span className="block text-sm font-bold">{tab.label}</span>
                    <span className="block text-[11px] opacity-65">
                      {tab.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Módulos disponibles</span>
              <span className="font-mono font-bold text-sky-700">3/3</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-full rounded-full bg-sky-600" />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              Proyecto guardado localmente, sin cuentas ni base de datos.
            </p>
          </div>
        </aside>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Cerrar navegación"
            className="no-print fixed inset-0 top-16 z-20 bg-slate-950/30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-7xl">
            <div className="dashboard-heading mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E65100]">
                Proyecto / Estructura principal /{" "}
                {projectSummaryOpen ? "Resumen & Memoria" : activeDefinition.label}
              </p>
              <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    {projectSummaryOpen
                      ? "Resumen de proyecto y memoria técnica"
                      : `Diseño simplificado de ${activeDefinition.label.toLowerCase()}`}
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    {projectSummaryOpen
                      ? "Inventario, metadatos y exportación del proyecto local."
                      : activeTab === "beam"
                        ? "Flexión, corte y propuesta de acero para anteproyecto."
                        : activeTab === "column"
                          ? "Carga axial, sección, acero longitudinal y estribos."
                          : "Espesor, flexión por metro y acero de temperatura."}
                  </p>
                </div>
                {!projectSummaryOpen && (
                  <a
                    href="#calculation-results"
                    className="no-print inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-700 xl:hidden"
                    onClick={(event) => {
                      event.preventDefault();
                      focusResults();
                    }}
                  >
                    Ver resultados
                  </a>
                )}
              </div>
            </div>

            {projectSummaryOpen ? (
              <ProjectSummary />
            ) : (
              <div className="grid items-start gap-6 xl:grid-cols-[minmax(340px,0.78fr)_minmax(0,1.22fr)]">
                <div>
                  {handoff?.applied && (
                    <div className="mb-4 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
                      Valores recibidos desde{" "}
                      <strong>{describeHandoffSource(handoff.source)}</strong>.
                      Revisa los campos y ajusta si tu enunciado lo pide.
                    </div>
                  )}
                  {activeTab === "beam" && (
                    <BeamForm
                      initialValues={beamPatch}
                      onOpenProjectSummary={openProjectSummary}
                      onCalculate={(next) =>
                        handleCalculated("beam", next, setBeamResult)
                      }
                      onSave={addElement}
                    />
                  )}
                  {activeTab === "column" && (
                    <ColumnForm
                      initialValues={columnPatch}
                      onOpenProjectSummary={openProjectSummary}
                      onCalculate={(next) =>
                        handleCalculated("column", next, setColumnResult)
                      }
                      onSave={addElement}
                    />
                  )}
                  {activeTab === "slab" && (
                    <SlabForm
                      initialValues={slabPatch}
                      onOpenProjectSummary={openProjectSummary}
                      onCalculate={(next) =>
                        handleCalculated("slab", next, setSlabResult)
                      }
                      onSave={addElement}
                    />
                  )}
                  <TechnicalDisclaimer />
                </div>
                <div ref={resultsRef}>
                  <ResultsPanel
                    result={result}
                    isDemo={!userCalculated[activeTab]}
                    justUpdated={justUpdated}
                    liveMessage={liveMessage}
                    onOpenReport={() => setReportOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="no-print border-t border-slate-200 bg-white px-4 py-6 md:ml-64">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {PREDIM_NAME}
            <span className="mx-1.5 text-slate-300" aria-hidden="true">
              ·
            </span>
            Hernández Axel · PUCE sede Portoviejo
          </p>
          <p>
            El diseño final requiere análisis estructural, combinaciones de
            carga, detallado y revisión profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}
