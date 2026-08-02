import type { CalculationResult } from "@/calculations";
import { BeamLoadDiagram } from "./BeamLoadDiagram";
import { ColumnLoadDiagram } from "./ColumnLoadDiagram";
import { SlabLoadDiagram } from "./SlabLoadDiagram";

const TITLES: Record<CalculationResult["kind"], string> = {
  beam: "Esquema · carga y sección",
  column: "Esquema · carga axial y sección",
  slab: "Esquema · carga superficial y espesor",
};

export function ElementLoadDiagram({ result }: { result: CalculationResult }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-blueprint-grid">
      <p className="border-b border-slate-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">
        {TITLES[result.kind]}
      </p>
      <div className="h-52 px-1 py-1 sm:h-56">
        {result.kind === "beam" ? (
          <BeamLoadDiagram result={result} />
        ) : result.kind === "column" ? (
          <ColumnLoadDiagram result={result} />
        ) : (
          <SlabLoadDiagram result={result} />
        )}
      </div>
    </div>
  );
}
