"use client";

import { useRef, useState, type ChangeEvent } from "react";
import {
  Download,
  FileJson,
  Pencil,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X,
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
}: {
  label: string;
  field: keyof ProjectMetadata;
  type?: "text" | "date";
}) {
  const { project, updateMetadata } = useProject();

  return (
    <label className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
      {label}
      <input
        type={type}
        className={metadataInputClass}
        value={project.metadata[field]}
        onChange={(event) => updateMetadata(field, event.target.value)}
      />
    </label>
  );
}

export function ProjectSummary() {
  const {
    project,
    isHydrated,
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

  if (!isHydrated) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Cargando proyecto local…
      </div>
    );
  }

  return (
    <section className="structural-card overflow-hidden">
      <div className="border-b border-slate-200 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E65100]">
              Persistencia local
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Resumen del proyecto
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Los datos se guardan únicamente en este navegador.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportProject}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:border-sky-500 hover:text-sky-700"
            >
              <Download aria-hidden="true" size={16} />
              Exportar JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:border-sky-500 hover:text-sky-700"
            >
              <Upload aria-hidden="true" size={16} />
              Importar JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={importProject}
            />
            <button
              type="button"
              onClick={resetProject}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100"
            >
              <RotateCcw aria-hidden="true" size={16} />
              Nuevo / limpiar
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetadataField label="Nombre del proyecto" field="name" />
          <MetadataField label="Ingeniero / estudiante" field="responsible" />
          <MetadataField label="Ubicación / universidad" field="location" />
          <MetadataField label="Fecha" field="date" type="date" />
        </div>

        {message && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-[0.13em] text-slate-500">
              <th className="px-5 py-4">Etiqueta</th>
              <th className="px-5 py-4">Tipo</th>
              <th className="px-5 py-4">Dimensión</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Guardado</th>
              <th className="px-5 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {project.elements.map((element) => (
              <tr key={element.id} className="hover:bg-slate-50/70">
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
                    <span className="font-mono text-sm font-bold text-slate-900">
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
                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {new Intl.DateTimeFormat("es-EC", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(element.savedAt))}
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

        {project.elements.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center text-slate-500">
            <FileJson aria-hidden="true" size={30} />
            <p className="text-sm font-semibold">Aún no hay elementos guardados.</p>
            <p className="text-xs">
              Calcula una sección y usa “Guardar elemento al proyecto”.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
