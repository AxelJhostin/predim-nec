import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { ProjectProvider } from "@/context/ProjectContext";
import { StructuralDashboard } from "@/components/StructuralDashboard";
import type { ElementType } from "@/utils/necCalculations";

interface CalculatorContent {
  eyebrow: string;
  title: string;
  description: string;
  initialTab: ElementType;
  inputs: string[];
  criteria: string[];
  steps: string[];
}

export const calculatorContent: Record<ElementType, CalculatorContent> = {
  beam: {
    eyebrow: "Calculadora NEC para vigas",
    title: "Predimensionamiento de vigas de hormigón armado",
    description:
      "Obtén una sección preliminar b × h a partir de la luz, el tipo de apoyo y la carga lineal. La herramienta verifica de forma aproximada que la resistencia flexional supere el momento solicitado.",
    initialTab: "beam",
    inputs: [
      "Luz libre de la viga en metros.",
      "Condición de apoyo: simple, continua o voladizo.",
      "Carga de diseño lineal en kN/m.",
      "Resistencia del acero y recubrimiento para la estimación.",
    ],
    criteria: [
      "Relaciones luz/peralte adoptadas por NEC-SE-HM mediante ACI 318.",
      "Ancho preliminar igual a la mitad del peralte, con mínimo de 25 cm.",
      "Redondeo conservador al siguiente múltiplo de 5 cm.",
      "Comprobación preliminar de φMn ≥ Mu con cuantía de acero estimada.",
    ],
    steps: [
      "Selecciona Vigas y completa las condiciones del elemento.",
      "Revisa la sección recomendada y la tabla de cumplimiento.",
      "Abre el procedimiento para comprobar fórmulas, unidades y referencias.",
      "Guarda el elemento en el proyecto o imprime su memoria técnica.",
    ],
  },
  column: {
    eyebrow: "Calculadora NEC para columnas",
    title: "Predimensionamiento de columnas de hormigón armado",
    description:
      "Estima la carga axial y el área de hormigón requerida usando el área tributaria, número de pisos, carga de servicio y posición de la columna.",
    initialTab: "column",
    inputs: [
      "Área tributaria que descarga sobre la columna.",
      "Número de pisos soportados y carga de servicio en kN/m².",
      "Posición central, perimetral o esquinera.",
      "Altura libre y factor de longitud efectiva para revisar esbeltez.",
    ],
    criteria: [
      "Factor de posición que aumenta la demanda en bordes y esquinas.",
      "Área bruta preliminar obtenida con f’c = 21 MPa.",
      "Dimensión transversal mínima de 30 × 30 cm.",
      "Revisión preliminar de esbeltez y cuantía longitudinal informada.",
    ],
    steps: [
      "Selecciona Columnas e ingresa la geometría tributaria.",
      "Define la posición y la cantidad de niveles soportados.",
      "Comprueba carga, área requerida, dimensión propuesta y esbeltez.",
      "Consulta el procedimiento y guarda el resultado en tu proyecto.",
    ],
  },
  slab: {
    eyebrow: "Calculadora NEC para losas",
    title: "Predimensionamiento de losas macizas y nervadas",
    description:
      "Calcula un espesor inicial según la luz principal y el sistema de losa. El resultado sirve para comparar alternativas durante las primeras etapas del proyecto.",
    initialTab: "slab",
    inputs: [
      "Luz principal del paño en metros.",
      "Sistema de losa maciza o nervada.",
      "Condición geométrica representativa del paño.",
    ],
    criteria: [
      "Relación preliminar luz/25 para losa maciza.",
      "Relación preliminar luz/21 para losa nervada.",
      "Redondeo conservador al siguiente centímetro.",
      "Presentación explícita del criterio usado y sus limitaciones.",
    ],
    steps: [
      "Selecciona Losas e indica la luz principal.",
      "Escoge el sistema constructivo a evaluar.",
      "Compara el espesor calculado con las restricciones del proyecto.",
      "Guarda la alternativa y documenta el procedimiento.",
    ],
  },
};

export function CalculatorSeoPage({
  content,
}: {
  content: CalculatorContent;
}) {
  return (
    <>
      <ProjectProvider>
        <StructuralDashboard initialTab={content.initialTab} />
      </ProjectProvider>

      <article className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <header className="max-w-3xl">
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-[#E65100]">
              {content.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {content.description}
            </p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <InfoCard icon={Calculator} title="Datos de entrada">
              <BulletList items={content.inputs} />
            </InfoCard>
            <InfoCard icon={ShieldCheck} title="Criterios verificados">
              <BulletList items={content.criteria} />
            </InfoCard>
            <InfoCard icon={BookOpenCheck} title="Cómo usar el resultado">
              <ol className="space-y-3 text-sm leading-6 text-slate-600">
                {content.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-mono font-bold text-[#0284C7]">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </InfoCard>
          </div>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <strong>Alcance técnico:</strong> este cálculo es una estimación
            preliminar con fines académicos y de anteproyecto. No sustituye el
            análisis, diseño, detallado ni revisión de un ingeniero estructural
            responsable conforme a la NEC vigente.
          </div>

          <nav
            aria-label="Más recursos de predimensionamiento"
            className="mt-10 flex flex-wrap gap-3"
          >
            <ResourceLink href="/calculadora-vigas-nec">Vigas</ResourceLink>
            <ResourceLink href="/calculadora-columnas-nec">
              Columnas
            </ResourceLink>
            <ResourceLink href="/calculadora-losas-nec">Losas</ResourceLink>
            <ResourceLink href="/guia-predimensionamiento-nec">
              Guía y preguntas frecuentes
            </ResourceLink>
          </nav>
        </div>
      </article>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-sky-100 p-2 text-[#0284C7]">
          <Icon aria-hidden="true" size={20} />
        </span>
        <h2 className="font-bold text-slate-950">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm leading-6 text-slate-600">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E65100]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ResourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#E65100] hover:text-[#E65100]"
    >
      {children}
      <ArrowRight aria-hidden="true" size={16} />
    </Link>
  );
}
