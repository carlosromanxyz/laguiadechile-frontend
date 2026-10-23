import Image from "next/image";
import { LDCNewsArticleHero } from "@/components/organisms/ldc-news-article-hero";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCNewsAuthor } from "@/components/molecules/ldc-news-author";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { LDCNewsCard } from "@/components/molecules/ldc-news-card";
import {
  getNewsBySlug,
  getNewsSlugs,
  getRelatedNews,
  getReadingTime,
  isNewArticle,
} from "@/services/news";
import { notFound } from "next/navigation";
import { Share2 } from "lucide-react";
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

  const readingTime = getReadingTime(news.content);

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Noticias", href: "/noticias" },
    {
      label: news.category.name,
      href: `/noticias?categoria=${news.category.slug}`,
    },
    { label: news.title, href: "" },
  ];

  const relatedNews = await getRelatedNews(news.id, news.category.slug, 3);

  return (
    <>
      {/* Hero Section */}
      <LDCNewsArticleHero
        news={news}
        breadcrumbs={breadcrumbs}
        isNew={isNewArticle(news.createdAt)}
        readingTime={readingTime}
      />

      {/* Main Content */}
      <main>
        <LDCSection paddingY="md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Featured image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                  quality={85}
                />
              </div>

              {/* Body */}
              <article
                className="prose prose-base max-w-none text-muted-foreground dark:prose-invert
                  prose-headings:font-mulish prose-headings:text-foreground
                  prose-p:mb-4 prose-p:last:mb-0 prose-p:leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <LDCNewsAuthor
                author={news.author}
                createdAt={news.createdAt}
                readingTime={readingTime}
              />

              {/* Share */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-pink" />
                  Compartir
                </h3>
                <LDCSocialShareButtons title={news.title} variant="dark" />
              </div>
            </div>
          </div>
        </LDCSection>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <LDCSection paddingY="md" className="bg-muted/30">
            <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
              Noticias Relacionadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((related) => (
                <LDCNewsCard
                  key={related.id}
                  id={related.id}
                  title={related.title}
                  slug={related.slug}
                  excerpt={related.excerpt}
                  category={related.category}
                  author={related.author}
                  image={related.image}
                  featured={related.featured}
                  createdAt={related.createdAt}
                  updatedAt={related.updatedAt}
                />
              ))}
            </div>
          </LDCSection>
        )}
      </main>
    </>
  );
}
