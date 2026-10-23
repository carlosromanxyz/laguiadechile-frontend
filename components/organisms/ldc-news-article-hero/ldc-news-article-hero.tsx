import { cn } from "@/lib/utils";
import Image from "next/image";
import { LDCBreadcrumbs } from "@/components/molecules/ldc-breadcrumbs";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCSocialShareButtons } from "@/components/molecules/ldc-social-share-buttons";
import { Star, Sparkles, CalendarDays, Clock } from "lucide-react";
import type { INews } from "@/interfaces/news";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface LDCNewsArticleHeroProps {
  news: INews;
  breadcrumbs: BreadcrumbItem[];
  /** Whether the article counts as recently published */
  isNew: boolean;
  /** Reading time in minutes */
  readingTime: number;
  className?: string;
}

/**
 * LDCNewsArticleHero - Hero Section for News Article Detail Pages
 *
 * Shows category/featured/new badges, title, and the article meta
 * (author with avatar, publication date, reading time) plus share buttons.
 * Does not use getIcon (category shown by name) to keep lint clean.
 */
export function LDCNewsArticleHero({
  news,
  breadcrumbs,
  isNew,
  readingTime,
  className,
}: LDCNewsArticleHeroProps) {
  const formattedDate = new Date(news.createdAt).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className={cn(
        "relative w-full bg-purple/20 pt-24 pb-8 md:pt-28 md:pb-12",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumbs */}
        <LDCBreadcrumbs items={breadcrumbs} variant="light" className="mb-6" />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LDCBadge variant="default">{news.category.name}</LDCBadge>
          {news.featured && (
            <LDCBadge variant="featured">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Destacado
            </LDCBadge>
          )}
          {isNew && (
            <LDCBadge variant="new">
              <Sparkles className="w-3 h-3 mr-1" />
              Nuevo
            </LDCBadge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mulish text-foreground mb-6 max-w-4xl">
          {news.title}
        </h1>

        {/* Meta & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Image
                src={news.author.avatar}
                alt={news.author.name}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <span className="font-medium text-foreground">
                {news.author.name}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-sm">
              <CalendarDays className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4" />
              {readingTime} min de lectura
            </span>
          </div>

          <LDCSocialShareButtons title={news.title} variant="dark" />
        </div>
      </div>
    </section>
  );
}
