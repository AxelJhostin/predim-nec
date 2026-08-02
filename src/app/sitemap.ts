import type { MetadataRoute } from "next";
import { contentArticles } from "@/lib/contentArticles";
import { calculatorPages, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/predim`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/aprender`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/norma-nec`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.92,
    },
    ...contentArticles.map((article) => ({
      url: `${SITE_URL}/aprender/${article.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/geosecciones`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/unidades-ec`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/tributarias`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/combinaciones-nec`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/zapatas-predim`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/deflexion-aprox`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...calculatorPages.map((page) => ({
      url: `${SITE_URL}${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}/guia-predimensionamiento-nec`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
