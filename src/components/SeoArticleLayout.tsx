import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import type { ContentArticle } from "@/lib/contentArticles";
import { SITE_CREDIT, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import { SCOPE_SHORT } from "@/lib/scope";

export function SeoArticleLayout({
  article,
}: {
  article: ContentArticle;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={34} priority />
            <div>
              <p className="text-base font-black tracking-tight text-slate-950">
                {SITE_NAME}
              </p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
                {SITE_TAGLINE}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/norma-nec"
              className="text-xs font-semibold text-slate-600 hover:text-sky-700"
            >
              Norma NEC
            </Link>
            <Link
              href="/aprender"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-700"
            >
              <ArrowLeft aria-hidden="true" size={14} />
              Aprender
            </Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
          {article.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{article.lead}</p>

        <div className="mt-10 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-slate-950">
                {section.heading}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-10 space-y-3">
          {article.toolHref && article.toolLabel && (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-600">
                Practica en CivilKit. Alcance educativo: no sustituye el diseño
                profesional.
              </p>
              <Link
                href={article.toolHref}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#E65100] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C84600]"
              >
                {article.toolLabel}
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </div>
          )}

          {article.officialHref && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-sm font-semibold text-sky-950">
                Fuente oficial (recomendado)
              </p>
              <p className="mt-1 text-sm text-sky-900/80">
                Contrasta siempre con el PDF vigente en el portal del Estado.
              </p>
              <a
                href={article.officialHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-900 hover:border-sky-500"
              >
                {article.officialLabel ?? "Abrir norma oficial"}
                <ExternalLink aria-hidden="true" size={15} />
              </a>
            </div>
          )}
        </div>
      </article>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {SITE_CREDIT}
          </p>
          <p>{SCOPE_SHORT}</p>
        </div>
      </footer>
    </div>
  );
}
