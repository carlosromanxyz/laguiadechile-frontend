"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getIcon } from "@/lib/get-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LDCPostCardProps {
  /** Post title */
  title: string;
  /** Post slug for URL */
  slug: string;
  /** Category info */
  category: {
    name: string;
    slug: string;
    icon: string;
  };
  /** Post image URL */
  image: string;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCPostCard - Post/Article Card Component
 *
 * Card displaying a news article/post with image, category, and title.
 * Features hover effects on image.
 *
 * @example
 * ```tsx
 * <LDCPostCard
 *   title="Nuevas medidas económicas"
 *   slug="nuevas-medidas-economicas"
 *   category={{ name: "Economía", slug: "economia", icon: "MdAttachMoney" }}
 *   image="/images/post.jpg"
 * />
 * ```
 */
export function LDCPostCard({
  title,
  slug,
  category,
  image,
  className,
}: LDCPostCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col h-full bg-card dark:bg-neutral-800 rounded-xl overflow-hidden p-3 shadow-md",
        className
      )}
    >
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

      {/* Title - Clamped to 2 lines with tooltip for full text */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-lg font-bold font-mulish leading-6 line-clamp-2 mb-4 text-foreground">
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

      {/* Spacer - Pushes footer to bottom for grid alignment */}
      <div className="flex-1" />

      {/* Footer - Category (left) + Action (right) */}
      <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
        {/* Category - Subtle metadata */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {renderCategoryIcon(category.icon)}
          <span>{category.name}</span>
        </div>

        {/* Action Link - Prominent CTA */}
        <Link
          href={`/noticia/${slug}`}
          className="flex items-center gap-1 text-sm text-pink dark:text-yellow hover:text-orange dark:hover:text-orange transition-colors"
        >
          <span className="font-medium">Ver detalles</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

// Helper function to render category icon - keeps component creation out of render
function renderCategoryIcon(iconName: string): React.ReactNode {
  const Icon = getIcon(iconName);
  return Icon ? <Icon className="w-3.5 h-3.5" /> : null;
}
