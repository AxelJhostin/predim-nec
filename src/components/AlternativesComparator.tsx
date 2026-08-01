"use client";

import { useMemo, useState } from "react";
import { GitCompareArrows } from "lucide-react";
import {
  useProject,
  type SavedProjectElement,
} from "@/context/ProjectContext";
import {
  formatNumber,
  type CalculationResult,
  type ElementType,
} from "@/utils/necCalculations";

const kindLabels: Record<ElementType, string> = {
  beam: "Vigas",
  column: "Columnas",
  slab: "Losas",
};

function metricRows(result: CalculationResult): [string, string][] {
  if (result.kind === "beam") {
    return [
      ["Sección", `${formatNumber(result.widthCm)} × ${formatNumber(result.depthCm)} cm`],
      ["Mu", `${formatNumber(result.ultimateMomentKnM, 2)} kN·m`],
      ["φMn", `${formatNumber(result.designResistanceKnM, 2)} kN·m`],
      ["Acero flexión", result.flexuralBarProposal ?? "—"],
      ["Estribos", result.stirrupProposal ?? "—"],
      ["Vu", `${formatNumber(result.ultimateShearKn ?? 0, 1)} kN`],
    ];
  }

  if (result.kind === "column") {
    return [
      ["Sección", `${formatNumber(result.sideCm)} × ${formatNumber(result.sideCm)} cm`],
      ["Pu", `${formatNumber(result.ultimateLoadKn, 1)} kN`],
      ["φPn", `${formatNumber(result.designAxialResistanceKn, 1)} kN`],
      ["Acero", result.longitudinalBarProposal ?? "—"],
      ["Estribos", result.tieProposal ?? "—"],
      ["Esbeltez λ", result.slenderness.toFixed(1)],
    ];
  }

  return [
    ["Espesor", `${formatNumber(result.thicknessCm)} cm`],
    ["Mu", `${formatNumber(result.ultimateMomentKnM, 2)} kN·m/m`],
    ["φMn", `${formatNumber(result.designResistanceKnM, 2)} kN·m/m`],
    ["Acero flexión", result.flexuralBarProposal ?? "—"],
    ["Temperatura", result.temperatureSteelProposal ?? "—"],
    ["Sistema", result.inputs.slabType === "solid" ? "Maciza" : "Nervada"],
  ];
}

function recommendation(selected: SavedProjectElement[]) {
  if (selected.length < 2) {
    return "Selecciona al menos dos elementos del mismo tipo para comparar.";
  }

  const passing = selected.filter((element) => element.status === "PASA");
  if (passing.length === 0) {
    return "Ninguna alternativa cumple todos los criterios preliminares. Revisa cargas, luces o apoyos.";
  }

  if (selected[0].kind === "beam") {
    const sorted = [...passing].sort((left, right) => {
      if (left.result.kind !== "beam" || right.result.kind !== "beam") {
        return 0;
      }
      const leftArea = left.result.widthCm * left.result.depthCm;
      const rightArea = right.result.widthCm * right.result.depthCm;
      return leftArea - rightArea;
    });
    return `Entre las que cumplen, ${sorted[0].label} tiene la menor área bruta preliminar. Úsala como punto de partida y valida el diseño completo.`;
  }

  if (selected[0].kind === "column") {
    const sorted = [...passing].sort((left, right) => {
      if (left.result.kind !== "column" || right.result.kind !== "column") {
        return 0;
      }
      return left.result.sideCm - right.result.sideCm;
    });
    return `Entre las que cumplen, ${sorted[0].label} propone la sección más compacta. Verifica esbeltez y detallado sísmico en el diseño final.`;
  }

  const sorted = [...passing].sort((left, right) => {
    if (left.result.kind !== "slab" || right.result.kind !== "slab") {
      return 0;
    }
    return left.result.thicknessCm - right.result.thicknessCm;
  });
  return `Entre las que cumplen, ${sorted[0].label} tiene el menor espesor preliminar. Contrasta peso propio y constructibilidad antes de decidir.`;
}

export function AlternativesComparator() {
  const { project } = useProject();
  const [kind, setKind] = useState<ElementType>("beam");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const candidates = useMemo(
    () => project.elements.filter((element) => element.kind === kind),
    [kind, project.elements],
  );

  const selected = candidates.filter((element) =>
    selectedIds.includes(element.id),
  );

  function toggle(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= 3) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  }

  function changeKind(nextKind: ElementType) {
    setKind(nextKind);
    setSelectedIds([]);
  }

  return (
    <section className="rounded-lg border border-[#E3BFB2] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#0284C7]">
            <GitCompareArrows aria-hidden="true" size={18} />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
              Comparador de alternativas
            </p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-[#0B1C30]">
            Contrasta hasta 3 opciones guardadas
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Ideal para decidir entre secciones de tarea o anteproyecto.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(kindLabels) as ElementType[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => changeKind(option)}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                kind === option
                  ? "bg-[#0284C7] text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:border-sky-400"
              }`}
            >
              {kindLabels[option]}
            </button>
          ))}
        </div>
      </div>

      {candidates.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          Aún no hay {kindLabels[kind].toLowerCase()} guardadas. Calcula y guarda
          elementos, o carga una plantilla de tarea.
        </p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {candidates.map((element) => {
              const active = selectedIds.includes(element.id);
              return (
                <button
                  key={element.id}
                  type="button"
                  onClick={() => toggle(element.id)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                    active
                      ? "border-sky-600 bg-sky-50 text-sky-900"
                      : "border-slate-300 bg-white text-slate-700 hover:border-sky-400"
                  }`}
                >
                  <span className="block font-mono font-bold">{element.label}</span>
                  <span className="mt-0.5 block text-[11px] opacity-80">
                    {element.dimension} · {element.status}
                  </span>
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selected.map((element) => (
                <article
                  key={element.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#0284C7]">
                        {element.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {element.dimension}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                        element.status === "PASA"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {element.status}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2">
                    {metricRows(element.result).map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-xs"
                      >
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="font-mono font-semibold text-slate-900">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          )}

          <p className="mt-5 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">
            {recommendation(selected)}
          </p>
        </>
      )}
    </section>
  );
}
