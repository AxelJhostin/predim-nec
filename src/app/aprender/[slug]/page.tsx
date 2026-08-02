import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoArticleLayout } from "@/components/SeoArticleLayout";
import {
  contentArticles,
  getContentArticle,
} from "@/lib/contentArticles";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return contentArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getContentArticle(slug);
  if (!article) {
    return {};
  }
  return createPageMetadata({
    title: article.title,
    description: article.description,
    path: `/aprender/${article.slug}`,
    keywords: article.keywords,
  });
}

export default async function AprenderArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getContentArticle(slug);
  if (!article) {
    notFound();
  }
  return <SeoArticleLayout article={article} />;
}
