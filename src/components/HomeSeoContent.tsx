import Link from "next/link";
import { ArrowRight, BookOpen, Columns3, Layers3, Minus } from "lucide-react";

const resources = [
  {
    href: "/calculadora-vigas-nec",
    title: "Calculadora de vigas NEC",
    description:
      "Estima ancho, peralte, momento último y resistencia flexional preliminar.",
    icon: Minus,
  },
  {
    href: "/calculadora-columnas-nec",
    title: "Calculadora de columnas NEC",
    description:
      "Obtén carga axial, área de hormigón, dimensión mínima y revisión de esbeltez.",
    icon: Columns3,
  },
  {
    href: "/calculadora-losas-nec",
    title: "Calculadora de losas NEC",
    description:
      "Compara espesores iniciales para sistemas de losa maciza y nervada.",
    icon: Layers3,
  },
  {
    href: "/guia-predimensionamiento-nec",
    title: "Guía de predimensionamiento",
    description:
      "Conoce el alcance, el flujo recomendado y las preguntas frecuentes.",
    icon: BookOpen,
  },
];

export function HomeSeoContent() {
  return (
    <section
      aria-labelledby="recursos-title"
      className="border-t border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#E65100]">
            Cálculo transparente
          </p>
          <h2
            id="recursos-title"
            className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl"
          >
            Herramientas de predimensionamiento estructural para Ecuador
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            PreDim NEC reúne calculadoras gratuitas, procedimientos explicados y
            una memoria técnica local para organizar alternativas de vigas,
            columnas y losas durante el anteproyecto.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {resources.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-[#E65100] hover:bg-white hover:shadow-md"
            >
              <span className="h-fit rounded-xl bg-sky-100 p-3 text-[#0284C7]">
                <Icon aria-hidden="true" size={22} />
              </span>
              <span>
                <span className="flex items-center gap-2 font-black text-slate-950">
                  {title}
                  <ArrowRight
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1"
                    size={16}
                  />
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
