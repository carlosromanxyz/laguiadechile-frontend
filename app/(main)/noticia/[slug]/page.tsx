import { LDCDetailTemplate } from "@/components/templates/ldc-detail-template";
import { getNewsBySlug, getNewsSlugs, getRelatedNews } from "@/services/news";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface NoticiaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for all news articles
 */
export async function generateStaticParams() {
  return getNewsSlugs();
}

/**
 * Generate metadata for the noticia page
 */
export async function generateMetadata({
  params,
}: NoticiaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "Noticia no encontrada - La Guía de Chile",
    };
  }

  return {
    title: `${news.title} | La Guía de Chile`,
    description: news.excerpt,
    openGraph: {
      type: "article",
      title: news.title,
      description: news.excerpt,
      images: [news.image],
    },
  };
}

/**
 * Noticia (News Article) Detail Page - La Guía de Chile
 *
 * Displays a full news article:
 * - Hero with category/author/date/reading-time
 * - Featured image
 * - Article body (prose)
 * - Author card + share (sidebar)
 * - Related news
 */
export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const relatedNews = await getRelatedNews(news.id, news.category.slug, 3);

  return <LDCDetailTemplate kind="noticia" news={news} related={relatedNews} />;
}
