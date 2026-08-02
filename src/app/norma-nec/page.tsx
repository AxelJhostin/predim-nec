import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  createPageMetadata,
  SITE_CREDIT,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo";
import { SCOPE_SHORT } from "@/lib/scope";
import {
  necAxisLabels,
  officialNecChapters,
  OFFICIAL_NEC_HUBS,
} from "@/lib/officialNec";

export const metadata: Metadata = createPageMetadata({
  title: "Norma NEC oficial - Capítulos y descargas",
  description:
    "Enlaces oficiales a la Norma Ecuatoriana de la Construcción (NEC): capítulos NEC-SE, NEC-HS, guías prácticas MIDUVI/MIT. Recurso para estudiantes de ingeniería civil en Ecuador.",
  path: "/norma-nec",
  keywords: [
    "Norma Ecuatoriana de la Construcción",
    "descargar NEC oficial",
    "NEC-SE-HM",
    "NEC-SE-CG",
    "NEC-SE-DS PDF",
    "MIDUVI NEC",
  ],
});

const hubs = [
  {
    title: "Portal NEC · MIT",
    detail: "Rectoría técnica y descarga de capítulos (fuente principal).",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    title: "Documentos NEC · MIDUVI",
    detail: "Capítulos y guías prácticas publicadas por MIDUVI.",
    href: OFFICIAL_NEC_HUBS.miduviChapters,
  },
  {
    title: "Presentación NEC · MIDUVI",
    detail: "Contexto y marco legal de la norma.",
    href: OFFICIAL_NEC_HUBS.miduviIntro,
  },
];

export default function NormaNecPage() {
  const axes = ["SE", "HS", "SB", "GUIA"] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-black">
            <BrandLogo size={34} priority />
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/aprender"
              className="text-xs font-semibold text-slate-600 hover:text-sky-700"
            >
              Aprender
            </Link>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
              {SITE_TAGLINE}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
          Fuente oficial
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Norma Ecuatoriana de la Construcción (NEC)
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Aquí reunimos los enlaces oficiales para que descargues los capítulos
          vigentes. CivilKit EC no aloja PDFs: te manda a MIT y MIDUVI. Las
          calculadoras son apoyo académico; la norma oficial manda.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {hubs.map((hub) => (
            <a
              key={hub.href}
              href={hub.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#E65100] hover:shadow-sm"
            >
              <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                {hub.title}
                <ExternalLink aria-hidden="true" size={14} className="text-slate-400" />
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{hub.detail}</p>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Tip: en el portal oficial busca el código del capítulo (p. ej.{" "}
          <strong>NEC-SE-HM</strong>) y descarga la edición publicada allí. No
          uses copias sin fecha ni fuente.
        </div>

        {axes.map((axis) => {
          const chapters = officialNecChapters.filter(
            (chapter) => chapter.axis === axis,
          );
          if (chapters.length === 0) {
            return null;
          }
          return (
            <section key={axis} className="mt-14">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                {necAxisLabels[axis]}
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {chapters.map((chapter) => (
                  <article
                    key={chapter.code}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <p className="font-mono text-[11px] font-bold text-[#E65100]">
                      {chapter.code}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">
                      {chapter.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {chapter.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={chapter.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Ver en portal oficial
                        <ArrowUpRight aria-hidden="true" size={14} />
                      </a>
                      {chapter.relatedToolHref && (
                        <Link
                          href={chapter.relatedToolHref}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800"
                        >
                          {chapter.relatedToolLabel}
                        </Link>
                      )}
                      {chapter.relatedArticleSlug && (
                        <Link
                          href={`/aprender/${chapter.relatedArticleSlug}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-800"
                        >
                          <BookOpen aria-hidden="true" size={13} />
                          Guía corta
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-14 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black text-slate-950">
            Guías CivilKit relacionadas
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Artículos propios para estudiar el flujo de anteproyecto y luego
            contrastar con el PDF oficial.
          </p>
          <Link
            href="/aprender"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#E65100] hover:underline"
          >
            Ir a Aprender NEC
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </section>
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
