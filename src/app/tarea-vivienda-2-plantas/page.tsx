import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { formatNumber } from "@/calculations";
import {
  createPageMetadata,
  SITE_CREDIT,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo";
import { SCOPE_SHORT } from "@/lib/scope";
import {
  runVivienda2PlantasFlow,
  VIVIENDA_2P,
} from "@/lib/vivienda2Plantas";
import { OFFICIAL_NEC_HUBS } from "@/lib/officialNec";

export const metadata: Metadata = createPageMetadata({
  title: "Tarea guiada: vivienda de 2 plantas NEC",
  description:
    "Recorrido paso a paso Combinaciones → Tributarias → PreDim → Deflexión → Zapatas con datos coherentes de vivienda 2 pisos. CivilKit EC.",
  path: "/tarea-vivienda-2-plantas",
  keywords: [
    "tarea vivienda 2 plantas NEC",
    "predimensionamiento vivienda Ecuador",
    "plantilla PreDim NEC",
  ],
});

export default function Vivienda2PlantasTaskPage() {
  const flow = runVivienda2PlantasFlow();
  const s = VIVIENDA_2P;

  const steps = [
    {
      n: "01",
      title: "Combinaciones NEC",
      detail: `D = ${s.deadLoadKnM2} kN/m², L = ${s.liveLoadKnM2} kN/m² → q_u = ${formatNumber(flow.qu, 2)} kN/m² (gobierna ${flow.combinations.governing.label}). qservicio = ${formatNumber(flow.serviceLoadKnM2, 2)} kN/m².`,
      href: flow.links.combinations,
      cta: "Abrir Combinaciones",
    },
    {
      n: "02",
      title: "Tributarias",
      detail: `Columna interior 4×4 m → At = ${formatNumber(flow.tributaryColumn.tributaryAreaM2, 2)} m². Viga secundaria bt = ${s.beamTributaryWidthM} m → w = ${formatNumber(flow.wDesign, 2)} kN/m.`,
      href: flow.links.tributaryColumn,
      cta: "Abrir Tributarias",
    },
    {
      n: "03",
      title: "PreDim · Losa",
      detail: `Luz ${s.spanM} m, continua, q_u = ${formatNumber(flow.qu, 2)} → h ≈ ${formatNumber(flow.slab.thicknessCm)} cm.`,
      href: flow.links.slab,
      cta: "Abrir losa en PreDim",
    },
    {
      n: "04",
      title: "PreDim · Viga",
      detail: `w = ${formatNumber(flow.wDesign, 2)} kN/m, L = ${s.spanM} m → sección ≈ ${formatNumber(flow.beam.widthCm)} × ${formatNumber(flow.beam.depthCm)} cm · ${flow.beam.flexuralBarProposal}.`,
      href: flow.links.beam,
      cta: "Abrir viga en PreDim",
    },
    {
      n: "05",
      title: "PreDim · Columna",
      detail: `At = 16 m², 2 pisos, Central, q = 7 → ${formatNumber(flow.column.sideCm)} × ${formatNumber(flow.column.sideCm)} cm · ${flow.column.longitudinalBarProposal}. Pu ≈ ${formatNumber(flow.column.ultimateLoadKn, 1)} kN.`,
      href: flow.links.column,
      cta: "Abrir columna en PreDim",
    },
    {
      n: "06",
      title: "Deflexión (servicio)",
      detail: `Usa wservicio = ${formatNumber(flow.wService, 2)} kN/m (no q_u). Con la sección de viga: δ ≈ ${formatNumber(flow.deflection.deflectionMm, 2)} mm · ${flow.deflection.ok ? "cumple L/240" : "revisar peralte"}.`,
      href: flow.links.deflection,
      cta: "Abrir Deflexión",
    },
    {
      n: "07",
      title: "Zapata",
      detail: `Pservicio columna ≈ ${formatNumber(flow.column.serviceLoadKn, 1)} kN, qa = ${s.allowablePressureKnM2} kN/m² → ${formatNumber(flow.footing.sideCm)} × ${formatNumber(flow.footing.sideCm)} × ${formatNumber(flow.footing.thicknessCm)} cm.`,
      href: flow.links.footing,
      cta: "Abrir Zapatas",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-black">
            <BrandLogo size={34} priority />
            {SITE_NAME}
          </Link>
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
            {SITE_TAGLINE}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
          Flujo de tarea · verificado
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {flow.scenario.title}: recorrido guiado
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Datos coherentes de extremo a extremo (misma D, L, retícula y bt).
          Cada paso abre la herramienta con la carga lista. Alcance: anteproyecto
          académico; contrasta con la NEC oficial.
        </p>

        <dl className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="D / L" value={`${s.deadLoadKnM2} / ${s.liveLoadKnM2} kN/m²`} />
          <Metric label="Vano" value={`${s.bayLxM} × ${s.bayLyM} m`} />
          <Metric label="bt viga" value={`${s.beamTributaryWidthM} m (secundaria)`} />
          <Metric label="Pisos" value={`${s.floors}`} />
          <Metric label="q_u" value={`${formatNumber(flow.qu, 2)} kN/m²`} />
          <Metric label="w diseño" value={`${formatNumber(flow.wDesign, 2)} kN/m`} />
          <Metric label="At columna" value="16 m² (interior)" />
          <Metric label="qa" value={`${s.allowablePressureKnM2} kN/m²`} />
        </dl>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">Chequeos de coherencia aplicados</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Columna <strong>Central</strong> + tributaria <strong>interior</strong> (sin doble factor de esquina).</li>
            <li>Deflexión con <strong>w de servicio</strong> ({formatNumber(flow.wService, 2)} kN/m), no con q_u.</li>
            <li>Pu de columna ≈ 1.2·Pservicio (simplificación PreDim; el diseño final usa combinaciones completas).</li>
          </ul>
        </div>

        <ol className="mt-10 space-y-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-4">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-sky-600"
                  size={22}
                />
                <div>
                  <p className="font-mono text-[11px] font-bold text-[#E65100]">
                    {step.n}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.detail}
                  </p>
                </div>
              </div>
              <Link
                href={step.href}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#E65100] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C84600]"
              >
                {step.cta}
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/predim"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300"
          >
            Abrir PreDim (cargar plantilla en Proyecto)
          </Link>
          <Link
            href={flow.links.article}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300"
          >
            Leer artículo
          </Link>
          <a
            href={OFFICIAL_NEC_HUBS.mitNec}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-950 hover:border-sky-400"
          >
            NEC oficial (MIT)
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {SITE_CREDIT}
          </p>
          <p>{SCOPE_SHORT}</p>
        </div>
      </footer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm font-semibold text-slate-950">
        {value}
      </dd>
    </div>
  );
}
