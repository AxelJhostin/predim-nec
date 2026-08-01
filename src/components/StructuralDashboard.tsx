"use client";

import { useState } from "react";
import {
  BookOpen,
  Building2,
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
} from "@/components/CalculatorForms";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ProjectSummary } from "@/components/ProjectSummary";
import { TechnicalReport } from "@/components/TechnicalReport";
import { useProject } from "@/context/ProjectContext";
import {
  calculateBeam,
  calculateColumn,
  calculateSlab,
  type BeamResult,
  type ColumnResult,
  type ElementType,
  type SlabResult,
} from "@/utils/necCalculations";

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
});
const initialColumn = calculateColumn({
  tributaryAreaM2: 25,
  floors: 5,
  columnType: "Central",
  serviceLoadKnM2: 8,
  clearHeightM: 3,
  effectiveLengthFactor: 1,
  longitudinalSteelCm2: 20,
});
const initialSlab = calculateSlab({ spanM: 5, slabType: "solid" });

export function StructuralDashboard({
  initialTab = "beam",
}: {
  initialTab?: ElementType;
}) {
  const [activeTab, setActiveTab] = useState<ElementType>(initialTab);
  const [beamResult, setBeamResult] = useState<BeamResult>(initialBeam);
  const [columnResult, setColumnResult] =
    useState<ColumnResult>(initialColumn);
  const [slabResult, setSlabResult] = useState<SlabResult>(initialSlab);
  const [reportOpen, setReportOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectSummaryOpen, setProjectSummaryOpen] = useState(false);
  const { project, addElement } = useProject();

  const result =
    activeTab === "beam"
      ? beamResult
      : activeTab === "column"
        ? columnResult
        : slabResult;
  const activeDefinition = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  function selectTab(tab: ElementType) {
    setActiveTab(tab);
    setProjectSummaryOpen(false);
    setMobileMenuOpen(false);
  }

  function openProjectSummary() {
    setProjectSummaryOpen(true);
    setMobileMenuOpen(false);
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
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E65100] text-white">
              <Building2 aria-hidden="true" size={20} />
            </div>
            <div>
              <p className="text-base font-black tracking-tight text-slate-950">
                PreDim NEC
              </p>
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:block">
                Predimensionamiento Ecuador
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openProjectSummary}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-sky-400 hover:text-sky-700"
            >
              <FolderKanban aria-hidden="true" size={16} />
              <span className="hidden sm:inline">Proyecto</span>
              <span className="rounded-full bg-sky-100 px-1.5 py-0.5 font-mono text-[10px] text-sky-800">
                {project.elements.length}
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
                  {project.elements.length} elementos guardados
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
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E65100]">
                Proyecto / Estructura principal /{" "}
                {projectSummaryOpen ? "Resumen & Memoria" : activeDefinition.label}
              </p>
              <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    {projectSummaryOpen
                      ? "Resumen de proyecto y memoria técnica"
                      : `Predimensionamiento de ${activeDefinition.label.toLowerCase()}`}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {projectSummaryOpen
                      ? "Inventario consolidado, metadatos y exportación del proyecto local."
                      : "Estimación geométrica rápida con criterios de la Norma Ecuatoriana de la Construcción."}
                  </p>
                </div>
                <p className="font-mono text-xs text-slate-400">Unidades SI</p>
              </div>
            </div>

            {projectSummaryOpen ? (
              <ProjectSummary />
            ) : (
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(340px,0.78fr)_minmax(0,1.22fr)]">
              <div>
                {activeTab === "beam" && (
                  <BeamForm onCalculate={setBeamResult} onSave={addElement} />
                )}
                {activeTab === "column" && (
                  <ColumnForm
                    onCalculate={setColumnResult}
                    onSave={addElement}
                  />
                )}
                {activeTab === "slab" && (
                  <SlabForm onCalculate={setSlabResult} onSave={addElement} />
                )}
                <TechnicalDisclaimer />
              </div>
              <ResultsPanel
                result={result}
                onOpenReport={() => setReportOpen(true)}
              />
            </div>
            )}
          </div>
        </main>
      </div>

      <footer className="no-print border-t border-slate-200 bg-white px-4 py-6 md:ml-64">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 PreDim NEC · Herramienta educativa gratuita</p>
          <p>Los resultados no sustituyen una memoria de cálculo firmada.</p>
        </div>
      </footer>
    </div>
  );
}
