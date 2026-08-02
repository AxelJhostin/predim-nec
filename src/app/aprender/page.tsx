import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { contentArticles } from "@/lib/contentArticles";
import {
  createPageMetadata,
  SITE_CREDIT,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo";
import { SCOPE_SHORT } from "@/lib/scope";

export const metadata: Metadata = createPageMetadata({
  title: "Aprender NEC - Guías cortas de anteproyecto",
  description:
    "Artículos prácticos de CivilKit EC: área tributaria, combinaciones NEC, zapata aislada, deflexión L/240 y conversión MPa a kgf/cm².",
  path: "/aprender",
  keywords: [
    "aprender NEC Ecuador",
    "guía predimensionamiento",
    "área tributaria",
    "combinaciones de carga",
  ],
});

export default function AprenderHubPage() {
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
          Contenido
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Aprender NEC · guías cortas
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Textos prácticos para búsquedas de pregrado. Cada guía enlaza a la
          calculadora CivilKit correspondiente.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contentArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/aprender/${article.slug}`}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#E65100] hover:shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {article.eyebrow}
              </p>
              <h2 className="mt-2 text-lg font-bold text-slate-950">
                {article.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {article.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E65100]">
                Leer guía
                <ArrowRight aria-hidden="true" size={15} />
              </span>
            </Link>
          ))}
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
