import type { MetadataRoute } from "next";
import { contentArticles } from "@/lib/contentArticles";
import { liveModules } from "@/lib/modules";
import { calculatorPages, SITE_URL } from "@/lib/seo";

function modulePriority(id: string, level: string): number {
  if (id === "predim") return 0.95;
  if (id === "norma") return 0.92;
  if (level === "Contenido") return 0.9;
  if (level === "Intermedio") return 0.88;
  return 0.85;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const fromCatalog: MetadataRoute.Sitemap = liveModules
    .filter((module): module is typeof module & { href: string } =>
      Boolean(module.href),
    )
    .map((module) => ({
      url: `${SITE_URL}${module.href}`,
      lastModified,
      changeFrequency:
        module.id === "predim" || module.id === "learn" ? "weekly" : "monthly",
      priority: modulePriority(module.id, module.level),
    }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...fromCatalog,
    ...contentArticles.map((article) => ({
      url: `${SITE_URL}/aprender/${article.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...calculatorPages.map((page) => ({
      url: `${SITE_URL}${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
