"use client";

import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import { LDCDetailsLink } from "@/components/atoms/ldc-details-link";
import { LDCFeaturedRibbon } from "@/components/atoms/ldc-featured-ribbon";
import { LDCLocationLink } from "@/components/atoms/ldc-location-link";
import Link from "next/link";
import Image from "next/image";
import { Star, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isNewArticle, isUpdatedArticle } from "@/lib/format/news";
import { getIcon } from "@/lib/get-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LDCNewsCardDefaultProps {
  /** Variante completa (listados y relacionadas); es la de por defecto */
  variant?: "default";
  /** Article ID */
  id: string;
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

interface LDCNewsCardPostProps {
  /** Variante compacta de la home («Noticias recientes»): imagen, título, categoría y enlace */
  variant: "post";
  /** Article title */
  title: string;
  /** Article slug for URL */
  slug: string;
  /** Category info */
  category: {
    name: string;
    slug: string;
    icon: string;
  };
  /** Image URL */
  image: string;
  /** Optional className for custom styling */
  className?: string;
}

type LDCNewsCardProps = LDCNewsCardDefaultProps | LDCNewsCardPostProps;

/**
 * LDCNewsCard - News Article Card Component
 *
 * Card displaying a news article with image, badges, title, excerpt, and author info.
 * Features hover effects, responsive layout, and support for long titles.
 *
 * La variante `post` es la card compacta de «Noticias recientes» (imagen, título
 * con tooltip si se trunca, categoría y «Ver detalles»).
 *
 * @example
 * ```tsx
 * <LDCNewsCard {...article} />
 * <LDCNewsCard
 *   variant="post"
 *   title="Nuevas medidas económicas"
 *   slug="nuevas-medidas-economicas"
 *   category={{ name: "Economía", slug: "economia", icon: "MdAttachMoney" }}
 *   image="/images/post.jpg"
 * />
 * ```
 */
export function LDCNewsCard(props: LDCNewsCardProps) {
  if (props.variant === "post") {
    return <NewsPostCard {...props} />;
  }
  return <NewsDefaultCard {...props} />;
}

function NewsDefaultCard({
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
}: LDCNewsCardDefaultProps) {
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
      <LDCCardSurface featured={featured} className={className}>
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
          {featured && <LDCFeaturedRibbon />}

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
      </LDCCardSurface>
    </TooltipProvider>
  );
}

function NewsPostCard({ title, slug, category, image, className }: LDCNewsCardPostProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = titleRef.current;
    if (element) {
      // Check if text is truncated by comparing scrollHeight with clientHeight
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [title]);

  return (
    <LDCCardSurface variant="padded" className={className}>
      {/* Image - Fixed height for consistency */}
      <Link href={`/noticia/${slug}`} className="block relative h-52 w-full overflow-hidden rounded mb-4">
        <Image
          src={image}
          alt={`Imagen de la noticia: ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-300 group-hover:scale-125 group-hover:opacity-75"
          loading="lazy"
          quality={85}
        />
      </Link>

      {/* Title - Clamped to 2 lines with conditional tooltip */}
      {isTruncated ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 ref={titleRef} className="text-lg font-bold font-mulish leading-6 line-clamp-2 mb-4 text-foreground">
                <Link href={`/noticia/${slug}`} className="hover:text-pink dark:hover:text-yellow transition-colors">
                  {title}
                </Link>
              </h3>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-md">{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <h3 ref={titleRef} className="text-lg font-bold font-mulish leading-6 line-clamp-2 mb-4 text-foreground">
          <Link href={`/noticia/${slug}`} className="hover:text-pink dark:hover:text-yellow transition-colors">
            {title}
          </Link>
        </h3>
      )}

      {/* Spacer - Pushes footer to bottom for grid alignment */}
      <div className="flex-1" />

      {/* Footer - Category (left) + Action (right) */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-3 mt-auto">
        {/* Category - Subtle metadata (sin ícono si no existe: `null`, no `undefined`) */}
        <LDCLocationLink
          href={`/categoria/${category.slug}`}
          icon={renderPostCategoryIcon(category.icon)}
        >
          {category.name}
        </LDCLocationLink>

        {/* Action Link - Prominent CTA */}
        <LDCDetailsLink href={`/noticia/${slug}`} variant="emphasis" />
      </div>
    </LDCCardSurface>
  );
}

// Helper function to render category icon
function renderCategoryIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-3 h-3 mr-1" /> : null;
}

// Ícono de categoría del footer de la variante `post` (null si no existe, para no pintar MapPin)
function renderPostCategoryIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-4 h-4 flex-shrink-0 text-pink dark:text-yellow" /> : null;
}
