"use client";

import { SCOPE_SHORT } from "@/lib/scope";

export function TechnicalDisclaimer() {
  return (
    <aside className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
      <p>
        <span className="font-semibold text-slate-700">Alcance técnico:</span>{" "}
        dimensiones y refuerzo simplificado para anteproyecto o práctica
        académica. {SCOPE_SHORT}
      </p>
    </aside>
  );
}
