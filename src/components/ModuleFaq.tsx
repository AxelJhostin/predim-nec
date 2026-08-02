import { serializeJsonLd } from "@/lib/seo";
import type { FaqItem } from "@/lib/moduleFaqs";

export function ModuleFaq({
  faqs,
  title = "Preguntas frecuentes",
}: {
  faqs: readonly FaqItem[];
  title?: string;
}) {
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

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <h2 className="text-lg font-bold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-slate-950">
              {faq.question}
            </summary>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
