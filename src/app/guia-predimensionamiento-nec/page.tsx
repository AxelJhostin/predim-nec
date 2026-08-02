import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { liveModules } from "@/lib/modules";
import {
  createPageMetadata,
  PREDIM_NAME,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

const description =
  "Guía CivilKit EC: flujo de tarea NEC para pregrado en Ecuador, mapa de módulos (PreDim, tributarias, zapatas, deflexión) y preguntas frecuentes.";

export const metadata: Metadata = createPageMetadata({
  title: "Guía de predimensionamiento estructural según NEC",
  description,
  path: "/guia-predimensionamiento-nec",
});

const faqs = [
  {
    question: "¿Qué es el predimensionamiento estructural?",
    answer:
      "Es una estimación inicial de las dimensiones de vigas, columnas y losas. Sirve para plantear el sistema resistente, coordinar espacios y comenzar el análisis, pero no reemplaza el diseño estructural definitivo.",
  },
  {
    question: "¿PreDim NEC sustituye el cálculo de un ingeniero estructural?",
    answer:
      "No. La aplicación es una herramienta académica y de anteproyecto. El diseño final requiere un modelo estructural, combinaciones de carga, análisis sísmico, diseño y detallado completo, además de la revisión de un profesional responsable.",
  },
  {
    question: "¿Qué normativa utiliza la calculadora?",
    answer:
      "La herramienta documenta criterios de NEC-SE-HM y disposiciones de ACI 318 adoptadas por la NEC para hormigón armado. Cada resultado incluye el procedimiento y las referencias aplicadas.",
  },
  {
    question: "¿Los datos del proyecto se envían a un servidor?",
    answer:
      "No. Los proyectos se guardan localmente en el navegador mediante localStorage. El usuario puede exportarlos como JSON, importarlos en otro equipo o eliminarlos cuando lo necesite.",
  },
  {
    question: "¿Puedo obtener una memoria técnica en PDF?",
    answer:
      "Sí. La vista de reporte está optimizada para impresión. Desde el navegador se puede seleccionar Guardar como PDF y conservar el procedimiento, los resultados y la revisión de cumplimiento.",
  },
  {
    question: "¿Qué carga debo ingresar?",
    answer:
      "Debe usarse la carga correspondiente al proyecto y a su etapa de cálculo. Los valores sugeridos por la interfaz son únicamente ejemplos; no deben adoptarse sin verificar uso, materiales, geometría y combinaciones exigidas por la NEC.",
  },
  {
    question: "¿Cómo encadenar las herramientas de CivilKit EC?",
    answer:
      "Flujo típico de entrepiso: Combinaciones NEC (obtener q_u) → Tributarias (At o w) → PreDim (vigas/columnas/losas) → Deflexión aprox. (servicio) y Zapatas PreDim (cimentación preliminar). Los botones «Usar en PreDim» pasan la carga por URL.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guía de predimensionamiento NEC",
      item: `${SITE_URL}/guia-predimensionamiento-nec`,
    },
  ],
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-black">
            <BrandLogo size={36} priority />
            {SITE_NAME}
          </Link>
          <Link
            href="/predim"
            className="rounded-xl bg-[#E65100] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#C2410C]"
          >
            Abrir {PREDIM_NAME}
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#E65100]">
              Guía técnica introductoria
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Guía NEC estudiante · CivilKit EC
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Mapa de herramientas gratuitas para pregrado en Ecuador: desde
              cargas y tributarias hasta PreDim, deflexión y zapata preliminar.
              Resultados de anteproyecto; el diseño final es profesional.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#0284C7]">
              Mapa CivilKit
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Módulos disponibles
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Cada herramienta tiene URL propia, procedimiento visible y
              alcance educativo NEC.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveModules
              .filter((module) => module.href)
              .map((module, index) => (
                <CalculatorCard
                  key={module.id}
                  href={module.href!}
                  number={String(index + 1).padStart(2, "0")}
                  title={module.name}
                  description={module.description}
                />
              ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#0284C7]">
                Flujo recomendado
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Tarea de entrepiso + zapata
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Encadena los módulos de CivilKit y luego valida el sistema
                completo en un modelo estructural.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                "Definir uso, geometría, materiales y retícula (vanos, pisos).",
                "Combinaciones NEC → q_u; Tributarias → At o w.",
                "PreDim: losa, viga y columna; pegar cargas obtenidas.",
                "Deflexión aprox. (L/240) y Zapatas PreDim con P de columna.",
                "Modelar, verificar sismo/servicio y detallar con un profesional.",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[#0284C7]"
                    size={22}
                  />
                  <span className="leading-6 text-slate-700">
                    <strong className="mr-2 font-mono text-slate-950">
                      {String(index + 1).padStart(2, "0")}
                    </strong>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#E65100]">
              Preguntas frecuentes
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Antes de usar los resultados
            </h2>
            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 font-bold text-slate-950">
                    {faq.question}
                  </summary>
                  <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-8 text-center text-sm text-slate-400">
        <p>
          {SITE_NAME} · Suite educativa de ingeniería civil para Ecuador ·{" "}
          {PREDIM_NAME}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Hernández Axel · PUCE sede Portoviejo
        </p>
      </footer>
    </div>
  );
}

function CalculatorCard({
  href,
  number,
  title,
  description,
}: {
  href: string;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#E65100] hover:shadow-lg"
    >
      <span className="font-mono text-sm font-bold text-[#E65100]">
        {number}
      </span>
      <h2 className="mt-4 text-xl font-black text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0284C7]">
        Abrir calculadora
        <ArrowRight
          aria-hidden="true"
          className="transition group-hover:translate-x-1"
          size={16}
        />
      </span>
    </Link>
  );
}
