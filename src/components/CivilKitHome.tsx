import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { toolkitModules } from "@/lib/modules";
import {
  PREDIM_NAME,
  SITE_CREDIT,
  SITE_NAME,
  SITE_TAGLINE,
  calculatorPages,
} from "@/lib/seo";
import { SCOPE_SHORT } from "@/lib/scope";

export function CivilKitHome() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo size={36} priority />
            <div>
              <p className="text-base font-black tracking-tight text-slate-950">
                {SITE_NAME}
              </p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
                {SITE_TAGLINE}
              </p>
            </div>
          </div>
          <Link
            href="/predim"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E65100] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#C84600]"
          >
            Abrir {PREDIM_NAME}
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(2,132,199,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(230,81,0,0.07),_transparent_50%)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              <GraduationCap aria-hidden="true" size={14} className="text-[#E65100]" />
              {SITE_TAGLINE}
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Herramientas gratuitas de ingeniería civil para Ecuador
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {SITE_NAME} reúne calculadoras académicas según la NEC: desde
              conceptos básicos hasta predimensionamiento de anteproyecto. Sin
              cuentas. Sin costo. Hecho para pregrado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/predim"
                className="inline-flex items-center gap-2 rounded-lg bg-[#E65100] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C84600]"
              >
                <Calculator aria-hidden="true" size={17} />
                Empezar con {PREDIM_NAME}
              </Link>
              <Link
                href="/aprender"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-700"
              >
                <BookOpen aria-hidden="true" size={17} />
                Aprender NEC
              </Link>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-500">
              <ShieldCheck
                aria-hidden="true"
                className="mr-1.5 inline align-text-bottom text-slate-400"
                size={15}
              />
              {SCOPE_SHORT}
            </p>
          </div>
        </section>

        <section
          aria-labelledby="modulos-title"
          className="mx-auto max-w-6xl px-4 py-14 sm:px-6"
        >
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700">
              Catálogo
            </p>
            <h2
              id="modulos-title"
              className="mt-2 text-3xl font-black tracking-tight text-slate-950"
            >
              Módulos de {SITE_NAME}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Suite completa para anteproyecto académico: básicos, flujo de
              cargas, PreDim, deflexión y zapatas. Siempre gratis y orientado a
              pregrado en Ecuador.
            </p>
          </div>

          <ol className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-4">
            {[
              {
                step: "01",
                title: "Combinaciones",
                href: "/combinaciones-nec",
                detail: "Obtén q_u",
              },
              {
                step: "02",
                title: "Tributarias",
                href: "/tributarias",
                detail: "At o w",
              },
              {
                step: "03",
                title: "PreDim",
                href: "/predim",
                detail: "Sección y acero",
              },
              {
                step: "04",
                title: "Zapata / δ",
                href: "/zapatas-predim",
                detail: "Cimentación y servicio",
              },
            ].map((item) => (
              <li key={item.step}>
                <Link
                  href={item.href}
                  className="block rounded-lg border border-transparent px-2 py-2 hover:border-sky-200 hover:bg-sky-50/60"
                >
                  <p className="font-mono text-[10px] font-bold text-[#E65100]">
                    {item.step}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-950">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            Los botones “Usar en PreDim” de Combinaciones y Tributarias pasan la
            carga por URL (deep-link).
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolkitModules.map((module) => {
              const isLive = module.status === "live" && module.href;
              const cardClass =
                "flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition";

              const body = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {module.level}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-950">
                        {module.name}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                        module.status === "live"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {module.status === "live" ? "Disponible" : "Próximamente"}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {module.description}
                  </p>
                  {isLive ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E65100]">
                      {module.cta ?? "Abrir"}
                      <ArrowRight aria-hidden="true" size={15} />
                    </span>
                  ) : (
                    <span className="mt-4 text-sm font-medium text-slate-400">
                      En roadmap
                    </span>
                  )}
                </>
              );

              return isLive ? (
                <Link
                  key={module.id}
                  href={module.href!}
                  className={`${cardClass} hover:border-[#E65100] hover:shadow-sm`}
                >
                  {body}
                </Link>
              ) : (
                <div
                  key={module.id}
                  className={`${cardClass} opacity-90`}
                  aria-disabled="true"
                >
                  {body}
                </div>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="predim-links-title"
          className="border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2
              id="predim-links-title"
              className="text-2xl font-black tracking-tight text-slate-950"
            >
              Accesos directos de {PREDIM_NAME}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Páginas indexables para vigas, columnas y losas. Útiles si llegas
              desde una búsqueda específica.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {calculatorPages.map((page) => (
                <Link
                  key={page.slug}
                  href={page.slug}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-sky-400 hover:bg-white"
                >
                  <span className="block text-sm font-bold text-slate-950">
                    {page.title.replace(" según NEC Ecuador", "")}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {page.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
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
