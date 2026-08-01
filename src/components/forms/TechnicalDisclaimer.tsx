"use client";

import { ShieldCheck } from "lucide-react";
import { SCOPE_SHORT } from "@/lib/scope";

export function TechnicalDisclaimer() {
  return (
    <aside className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0" size={19} />
        <div className="leading-6">
          <p>
            <strong>Alcance técnico:</strong> esta herramienta calcula
            dimensiones y refuerzo simplificado de vigas, columnas y losas para
            anteproyecto o práctica académica.
          </p>
          <p className="mt-2 font-semibold">{SCOPE_SHORT}</p>
        </div>
      </div>
    </aside>
  );
}
