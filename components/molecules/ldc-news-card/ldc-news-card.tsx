"use client";

import { cn } from "@/lib/utils";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import Link from "next/link";
import Image from "next/image";
import { Star, Calendar, User } from "lucide-react";
import { isNewArticle, isUpdatedArticle } from "@/services/news";
import { getIcon } from "@/lib/get-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LDCNewsCardProps {
  /** Article ID */
  id: number;
  /** Article title */
  title: string;
  /** Article slug for URL */
  slug: string;
  /** Article excerpt/summary */
  excerpt: string;
  /** Category info */
  category: {
    name: string;
    slug: string;
    icon: string;
  };
  /** Author info */
  author: {
    name: string;
    avatar: string;
  };
  /** Image URL */
  image: string;
  /** Is featured */
  featured: boolean;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCNewsCard - News Article Card Component
 *
 * Card displaying a news article with image, badges, title, excerpt, and author info.
 * Features hover effects, responsive layout, and support for long titles.
 */
export function LDCNewsCard({
  title,
  slug,
  excerpt,
  category,
  author,
  image,
  featured,
  createdAt,
  updatedAt,
  className,
}: LDCNewsCardProps) {
  const isNew = isNewArticle(createdAt);
  const isUpdated = isUpdatedArticle(createdAt, updatedAt);

  // Format date in Spanish
  const formattedDate = new Date(createdAt).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <TooltipProvider delayDuration={300}>
      <article
        className={cn(
          "group bg-card rounded-lg overflow-hidden border border-border",
          "hover:shadow-lg transition-all duration-300",
          featured && "ring-2 ring-yellow",
          className
        )}
      >
        {/* Image */}
        <Link
          href={`/noticia/${slug}`}
          className="block relative aspect-[16/9] overflow-hidden bg-muted"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            quality={85}
          />

          {/* Featured pattern overlay */}
          {featured && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none z-[1]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23ffbe0b' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* Badges Overlay - Top */}
          <div className="absolute top-2 left-2 right-2 flex gap-1.5 flex-wrap z-10">
            {featured && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <LDCBadge variant="featured">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Destacado
                    </LDCBadge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Artículo destacado por el equipo editorial</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isNew && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <LDCBadge variant="new">Nuevo</LDCBadge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Publicado en los últimos 7 días</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isUpdated && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <LDCBadge variant="updated">Actualizado</LDCBadge>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Este artículo ha sido actualizado recientemente</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Category Badge - Bottom */}
          <div className="absolute bottom-2 left-2 z-10">
            <LDCBadge variant="default">
              {renderCategoryIcon(category.icon)}
              {category.name}
            </LDCBadge>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title - supports long titles with line-clamp */}
          <Link href={`/noticia/${slug}`}>
            <h3 className="text-base font-bold font-mulish text-foreground line-clamp-2 hover:text-pink dark:hover:text-yellow transition-colors">
              {title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>

          {/* Footer: Author and Date */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
            {/* Author */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-muted-foreground truncate">
                {author.name}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Calendar className="w-3 h-3" />
              <time dateTime={createdAt}>{formattedDate}</time>
            </div>
          </div>
        </div>
      </article>
    </TooltipProvider>
  );
}

// Helper function to render category icon
function renderCategoryIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}
