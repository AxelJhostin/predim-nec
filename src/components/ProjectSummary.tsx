"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  CheckCircle2,
  Columns3,
  Download,
  FileJson,
  Layers3,
  Minus,
  Pencil,
  Printer,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  parseImportedProject,
  useProject,
  type ProjectMetadata,
} from "@/context/ProjectContext";

const metadataInputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

const kindLabels = {
  beam: "Viga",
  column: "Columna",
  slab: "Losa",
};

function MetadataField({
  label,
  field,
  type = "text",
  editing,
}: {
  label: string;
  field: keyof ProjectMetadata;
  type?: "text" | "date";
  editing: boolean;
}) {
  const { project, updateMetadata } = useProject();

  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#5A4138]">
        {label}
      </p>
      {editing ? (
        <input
          aria-label={label}
          type={type}
          className={metadataInputClass}
          value={project.metadata[field]}
          onChange={(event) => updateMetadata(field, event.target.value)}
        />
      ) : (
        <p className="mt-2 min-h-6 text-sm font-semibold text-[#0B1C30]">
          {project.metadata[field] || "Sin definir"}
        </p>
      )}
    </div>
  );
}

export function ProjectSummary() {
  const {
    project,
    isHydrated,
    updateMetadata,
    renameElement,
    removeElement,
    replaceProject,
    clearProject,
  } = useProject();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [metadataEditing, setMetadataEditing] = useState(false);
  const [filter, setFilter] = useState("");

  function exportProject() {
    const content = JSON.stringify(project, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "proyecto_predim_nec.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Proyecto exportado correctamente.");
    setError("");
  }

  async function importProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      if (file.size > 1_000_000) {
        throw new Error("El archivo supera el límite de 1 MB.");
      }

      const importedProject = parseImportedProject(
        JSON.parse(await file.text()) as unknown,
      );
      replaceProject(importedProject);
      setMessage(
        `Proyecto importado: ${importedProject.elements.length} elementos restaurados.`,
      );
      setError("");
    } catch (cause) {
      setMessage("");
      setError(
        cause instanceof Error
          ? cause.message
          : "No fue posible importar el proyecto.",
      );
    }
  }

  function resetProject() {
    if (
      window.confirm(
        "¿Crear un proyecto nuevo? Se eliminarán los metadatos y elementos guardados localmente.",
      )
    ) {
      clearProject();
      setMessage("Proyecto local reiniciado.");
      setError("");
    }
  }

  function startEditing(id: string, label: string) {
    setEditingId(id);
    setEditingLabel(label);
  }

  function saveLabel() {
    if (!editingId || !editingLabel.trim()) {
      return;
    }
    renameElement(editingId, editingLabel);
    setEditingId(null);
    setEditingLabel("");
  }

  function printProject() {
    setMetadataEditing(false);
    window.setTimeout(() => window.print(), 0);
  }

  const counts = project.elements.reduce(
    (total, element) => {
      total[element.kind] += 1;
      return total;
    },
    { beam: 0, column: 0, slab: 0 },
  );
  const passingElements = project.elements.filter(
    (element) => element.status === "PASA",
  ).length;
  const compliancePercentage = project.elements.length
    ? Math.round((passingElements / project.elements.length) * 100)
    : 0;
  const normalizedFilter = filter.trim().toLocaleLowerCase("es");
  const filteredElements = project.elements.filter((element) =>
    `${element.label} ${kindLabels[element.kind]} ${element.dimension}`
      .toLocaleLowerCase("es")
      .includes(normalizedFilter),
  );

  if (!isHydrated) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Cargando proyecto local…
      </div>
    );
  }

  return (
    <div className="project-print-container space-y-4">
      <div className="no-print flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2 font-mono text-xs text-[#5A4138]">
          <span>Proyectos</span>
          <span aria-hidden="true">›</span>
          <span className="font-bold text-[#E65100]">
            {project.metadata.name || "Proyecto sin nombre"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMetadataEditing(true)}
            className="inline-flex items-center gap-2 rounded border border-[#8F7066] bg-white px-4 py-2.5 text-xs font-bold text-[#0B1C30] hover:bg-slate-50"
          >
            <Pencil aria-hidden="true" size={15} />
            Editar metadatos
          </button>
          <button
            type="button"
            onClick={() => {
              setMetadataEditing(false);
              setMessage("Metadatos guardados localmente.");
            }}
            className="inline-flex items-center gap-2 rounded bg-[#E65100] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#C84600]"
          >
            <Save aria-hidden="true" size={15} />
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={resetProject}
            className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100"
          >
            <RotateCcw aria-hidden="true" size={15} />
            Nuevo proyecto
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-[#E3BFB2] bg-white p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <MetadataField
            label="Proyecto"
            field="name"
            editing={metadataEditing}
          />
          <MetadataField
            label="Ubicación"
            field="location"
            editing={metadataEditing}
          />
          <MetadataField
            label="Ingeniero / estudiante"
            field="responsible"
            editing={metadataEditing}
          />
          <MetadataField
            label="Universidad / institución"
            field="institution"
            editing={metadataEditing}
          />
          <MetadataField
            label="Fecha"
            field="date"
            type="date"
            editing={metadataEditing}
          />
        </div>
      </section>

      {message && (
        <p className="no-print rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="no-print rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total vigas" value={counts.beam} icon={Minus} />
        <StatCard label="Total columnas" value={counts.column} icon={Columns3} />
        <StatCard label="Total losas" value={counts.slab} icon={Layers3} />
        <StatCard
          label="Estado NEC"
          value={
            project.elements.length
              ? `${compliancePercentage}% PASA`
              : "SIN DATOS"
          }
          icon={CheckCircle2}
          success={compliancePercentage === 100 && project.elements.length > 0}
        />
      </section>

      <section className="overflow-hidden rounded-lg border border-[#E3BFB2] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#E3BFB2] px-5 py-4 sm:flex-row sm:items-center">
          <h3 className="text-lg font-bold text-[#0B1C30]">
            Inventario de elementos estructurales
          </h3>
          <label className="no-print flex items-center gap-2 rounded border border-[#E3BFB2] bg-[#EFF4FF] px-3 py-2">
            <Search aria-hidden="true" size={16} className="text-[#5A4138]" />
            <span className="sr-only">Filtrar elementos</span>
            <input
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-500 sm:w-52"
              placeholder="Filtrar por ID o tipo…"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          </label>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E3BFB2] bg-[#DCE9FF] font-mono text-[10px] uppercase tracking-[0.13em] text-[#5A4138]">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-4">Tipo</th>
              <th className="px-5 py-4">Dimensión</th>
              <th className="px-5 py-4">Norma NEC</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3BFB2]">
            {filteredElements.map((element, index) => (
              <tr
                key={element.id}
                className={`hover:bg-slate-100/80 ${index % 2 ? "bg-slate-50" : "bg-white"}`}
              >
                <td className="px-5 py-4">
                  {editingId === element.id ? (
                    <input
                      autoFocus
                      className="w-36 rounded-md border border-sky-400 px-2 py-1.5 font-mono text-sm outline-none ring-2 ring-sky-100"
                      value={editingLabel}
                      onChange={(event) => setEditingLabel(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") saveLabel();
                        if (event.key === "Escape") setEditingId(null);
                      }}
                    />
                  ) : (
                    <span className="font-mono text-sm font-bold text-[#0284C7]">
                      {element.label}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {kindLabels[element.kind]}
                </td>
                <td className="px-5 py-4 font-mono text-sm text-slate-700">
                  {element.dimension}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {element.kind === "column"
                    ? "NEC-SE-HM / DS"
                    : "NEC-SE-HM"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      element.status === "PASA"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {element.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    {editingId === element.id ? (
                      <>
                        <button
                          type="button"
                          aria-label={`Guardar etiqueta de ${element.label}`}
                          onClick={saveLabel}
                          className="rounded-md p-2 text-emerald-700 hover:bg-emerald-50"
                        >
                          <Save aria-hidden="true" size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label="Cancelar edición"
                          onClick={() => setEditingId(null)}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                        >
                          <X aria-hidden="true" size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Editar ${element.label}`}
                        onClick={() => startEditing(element.id, element.label)}
                        className="rounded-md p-2 text-sky-700 hover:bg-sky-50"
                      >
                        <Pencil aria-hidden="true" size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={`Eliminar ${element.label}`}
                      onClick={() => removeElement(element.id)}
                      className="rounded-md p-2 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredElements.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center text-slate-500">
            <FileJson aria-hidden="true" size={30} />
            <p className="text-sm font-semibold">
              {project.elements.length
                ? "No hay elementos que coincidan con el filtro."
                : "Aún no hay elementos guardados."}
            </p>
            <p className="text-xs">
              {project.elements.length
                ? "Prueba con otra etiqueta o tipo de elemento."
                : "Calcula una sección y usa “Guardar elemento al proyecto”."}
            </p>
          </div>
        )}
        </div>
      </section>

      <section className="rounded-lg border border-[#E3BFB2] bg-white p-5 sm:p-6">
        <label
          className="block text-lg font-bold text-[#0B1C30]"
          htmlFor="project-notes"
        >
          Notas y observaciones del proyecto
        </label>
        <textarea
          id="project-notes"
          rows={4}
          className="mt-4 w-full rounded-lg border border-[#E3BFB2] bg-white p-4 text-sm leading-6 text-slate-700 outline-none focus:border-[#E65100] focus:ring-4 focus:ring-orange-100"
          placeholder="Ingrese comentarios sobre el diseño estructural, consideraciones de carga o detalles de cimentación…"
          value={project.metadata.notes}
          onChange={(event) => updateMetadata("notes", event.target.value)}
        />
        <p className="mt-2 font-mono text-[10px] italic text-[#5A4138]">
          Autoguardado local activo.
        </p>
      </section>

      <section className="no-print flex flex-col items-start justify-between gap-4 rounded-lg border border-[#E3BFB2] bg-[#DCE9FF] p-5 md:flex-row md:items-center">
        <div>
          <h4 className="text-lg font-bold text-[#E65100]">
            Generar reporte final
          </h4>
          <p className="mt-1 text-sm text-[#5A4138]">
            Memoria consolidada del proyecto bajo criterios NEC.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={printProject}
            className="inline-flex items-center gap-2 rounded bg-[#0284C7] px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-700"
          >
            <Printer aria-hidden="true" size={16} />
            Imprimir / guardar PDF
          </button>
          <button
            type="button"
            onClick={exportProject}
            className="inline-flex items-center gap-2 rounded border border-[#0284C7] bg-white px-4 py-2.5 text-xs font-bold text-[#0284C7] hover:bg-sky-50"
          >
            <Download aria-hidden="true" size={16} />
            Descargar .JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded border border-[#8F7066] bg-white px-4 py-2.5 text-xs font-bold text-[#5A4138] hover:bg-slate-50"
          >
            <Upload aria-hidden="true" size={16} />
            Importar proyecto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={importProject}
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  success = false,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  success?: boolean;
}) {
  return (
    <div className="group flex items-center justify-between rounded-lg border border-[#E3BFB2] bg-white p-4 transition hover:border-[#E65100]">
      <div>
        <p className="font-mono text-xs text-[#5A4138]">{label}</p>
        <p
          className={`mt-2 font-mono text-2xl font-bold ${
            success ? "text-emerald-700" : "text-[#E65100]"
          }`}
        >
          {value}
        </p>
      </div>
      <Icon
        aria-hidden="true"
        size={23}
        className={success ? "text-emerald-500" : "text-[#E3BFB2]"}
      />
    </div>
  );
}
