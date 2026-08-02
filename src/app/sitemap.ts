import type { MetadataRoute } from "next";
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
