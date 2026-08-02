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
import type { ElementType } from "@/calculations";

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
    title: "Diseño simplificado de vigas de hormigón armado",
    description:
      "Obtén sección b × h, acero a flexión y estribos a partir de la luz, el apoyo y la carga. Es un cálculo de anteproyecto: el diseño final requiere análisis estructural, combinaciones de carga, detallado y revisión de un profesional.",
    initialTab: "beam",
    inputs: [
      "Luz libre de la viga en metros.",
      "Condición de apoyo: simple, continua o voladizo.",
      "Carga de diseño lineal en kN/m.",
      "f'c, fy, recubrimiento a d y diámetro de estribo.",
    ],
    criteria: [
      "Relaciones luz/peralte adoptadas por NEC-SE-HM mediante ACI 318.",
      "Diseño a flexión con As, cuantías y φMn ≥ Mu.",
      "Diseño a corte con Vu, Vc y propuesta de estribos.",
      "Alcance académico: no sustituye memoria firmada ni detallado sísmico.",
    ],
    steps: [
      "Selecciona Vigas y completa las condiciones del elemento.",
      "Revisa sección, acero longitudinal y estribos propuestos.",
      "Abre el procedimiento para comprobar fórmulas y referencias.",
      "Guarda el elemento o imprime la memoria, recordando el alcance técnico.",
    ],
  },
  column: {
    eyebrow: "Calculadora NEC para columnas",
    title: "Diseño simplificado de columnas de hormigón armado",
    description:
      "Estima Pu, sección, acero longitudinal y estribos según posición y carga tributaria. El diseño final requiere análisis estructural, combinaciones de carga, detallado y revisión de un profesional.",
    initialTab: "column",
    inputs: [
      "Área tributaria que descarga sobre la columna.",
      "Número de pisos soportados y carga de servicio en kN/m².",
      "Posición central, perimetral o esquinera.",
      "Altura libre, k, f'c, fy y diámetro de estribo.",
    ],
    criteria: [
      "Factor de posición y área según ubicación.",
      "Verificación φPn ≥ Pu para columna amarrada.",
      "Dimensión mínima 30 × 30 cm y 1% ≤ ρ ≤ 3%.",
      "Propuesta de varillas longitudinales y estribos.",
    ],
    steps: [
      "Selecciona Columnas e ingresa la geometría tributaria.",
      "Define la posición y la cantidad de niveles soportados.",
      "Revisa sección, φPn, acero longitudinal y estribos.",
      "Guarda el resultado recordando el alcance técnico.",
    ],
  },
  slab: {
    eyebrow: "Calculadora NEC para losas",
    title: "Diseño simplificado de losas macizas y nervadas",
    description:
      "Calcula espesor, momento por metro, acero a flexión y malla de temperatura. El diseño final requiere análisis estructural, combinaciones de carga, detallado y revisión de un profesional.",
    initialTab: "slab",
    inputs: [
      "Luz principal del paño en metros.",
      "Sistema macizo o nervado y condición de apoyo.",
      "Carga de diseño en kN/m², f'c, fy y recubrimiento.",
    ],
    criteria: [
      "Relación luz/25 (maciza) o luz/21 (nervada).",
      "Flexión por franja de 1 m con φMn ≥ Mu.",
      "Cuantía mínima y propuesta de barras c/c.",
      "Acero de temperatura / distribución documentado.",
    ],
    steps: [
      "Selecciona Losas e indica luz, sistema y carga.",
      "Revisa espesor, As y espaciamiento propuesto.",
      "Consulta el procedimiento y referencias NEC/ACI.",
      "Guarda o imprime la memoria con el alcance técnico.",
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
            <strong>Alcance técnico:</strong> esta herramienta sirve para
            anteproyecto y práctica académica. El diseño final requiere análisis
            estructural, combinaciones de carga, detallado y revisión de un
            profesional competente conforme a la NEC vigente.
          </div>

          <nav
            aria-label="Más recursos de CivilKit EC"
            className="mt-10 flex flex-wrap gap-3"
          >
            <ResourceLink href="/">CivilKit EC</ResourceLink>
            <ResourceLink href="/predim">PreDim completo</ResourceLink>
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
