"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ChevronRight, Star } from "lucide-react";
import { ClassifiedType, ClassifiedPriceType } from "@/interfaces/classified";
import { formatClassifiedPrice, getRelativeTime } from "@/services/classifieds";

interface LDCClassifiedCardProps {
  /** Classified title */
  title: string;
  /** Classified slug for URL */
  slug: string;
  /** Type: vendo, compro, arriendo, busco, ofrezco */
  type: ClassifiedType;
  /** Category info */
  category: {
    name: string;
    slug: string;
  };
  /** City info */
  city: {
    name: string;
    slug: string;
  };
  /** Commune (optional) */
  commune?: string;
  /** Image URL */
  image: string;
  /** Price info */
  price: {
    type: ClassifiedPriceType;
    amount?: number;
  };
  /** Is featured */
  featured: boolean;
  /** Created date ISO string */
  createdAt: string;
  /** Optional className for custom styling */
  className?: string;
}

const typeLabels: Record<ClassifiedType, string> = {
  vendo: "VENDO",
  compro: "COMPRO",
  arriendo: "ARRIENDO",
  busco: "BUSCO",
  ofrezco: "OFREZCO",
};

const typeColors: Record<ClassifiedType, string> = {
  vendo: "bg-pink text-white",
  compro: "bg-purple text-white",
  arriendo: "bg-orange text-white",
  busco: "bg-yellow text-black",
  ofrezco: "bg-emerald-500 text-white",
};

const priceTypeColors: Record<ClassifiedPriceType, string> = {
  fixed: "text-foreground",
  free: "text-emerald-600 dark:text-emerald-400",
  negotiable: "text-muted-foreground",
  contact: "text-muted-foreground",
};

/**
 * LDCClassifiedCard - Horizontal Classified Card Component
 *
 * Displays a classified listing in horizontal card format.
 * Responsive: horizontal on desktop, stacked on mobile.
 *
 * @example
 * ```tsx
 * <LDCClassifiedCard
 *   title="iPhone 13 Pro Max"
 *   slug="iphone-13-pro-max"
 *   type="vendo"
 *   category={{ name: "Electrónica", slug: "electronica" }}
 *   city={{ name: "Santiago", slug: "santiago" }}
 *   commune="Providencia"
 *   image="/images/iphone.jpg"
 *   price={{ type: "fixed", amount: 650000 }}
 *   featured={true}
 *   createdAt="2024-12-24T10:00:00Z"
 * />
 * ```
 */
export function LDCClassifiedCard({
  title,
  slug,
  type,
  category,
  city,
  commune,
  image,
  price,
  featured,
  createdAt,
  className,
}: LDCClassifiedCardProps) {
  const formattedPrice = formatClassifiedPrice(price);
  const relativeTime = getRelativeTime(createdAt);
  const location = commune ? `${city.name}, ${commune}` : city.name;

  return (
    <article
      className={cn(
        "group bg-card dark:bg-neutral-800 rounded-xl overflow-hidden border border-border",
        "flex flex-col sm:flex-row",
        "hover:shadow-lg transition-shadow duration-200",
        featured && "ring-2 ring-yellow",
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/aviso/${slug}`}
        className="relative w-full sm:w-40 md:w-48 flex-shrink-0 aspect-square sm:aspect-auto"
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          quality={80}
        />

        {/* Featured badge on image */}
        {featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow text-black text-xs font-semibold px-2 py-1 rounded-md">
            <Star className="w-3 h-3 fill-current" />
            Destacado
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Main info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Type badge */}
          <span
            className={cn(
              "inline-block text-xs font-bold px-2 py-0.5 rounded",
              typeColors[type]
            )}
          >
            {typeLabels[type]}
          </span>

          {/* Title */}
          <h3 className="font-bold font-mulish text-foreground line-clamp-2 sm:line-clamp-1">
            <Link href={`/aviso/${slug}`} className="hover:text-pink dark:hover:text-yellow transition-colors">
              {title}
            </Link>
          </h3>

          {/* Location and time */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <Link
              href={`/ciudad/${city.slug}`}
              className="flex items-center gap-1 hover:text-pink dark:hover:text-yellow transition-colors"
            >
              <MapPin className="w-4 h-4 text-pink dark:text-yellow flex-shrink-0" />
              <span className="truncate">{location}</span>
            </Link>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{relativeTime}</span>
            </span>
          </div>
        </div>

        {/* Price and action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-3 sm:text-right">
          {/* Price */}
          <span
            className={cn(
              "text-lg sm:text-xl font-bold font-mulish",
              priceTypeColors[price.type]
            )}
          >
            {formattedPrice}
          </span>

          {/* View link */}
          <Link
            href={`/aviso/${slug}`}
            className="group/link flex items-center gap-1 text-sm text-pink dark:text-yellow hover:text-orange transition-colors"
          >
            <span className="sm:max-w-0 sm:opacity-0 sm:group-hover/link:max-w-20 sm:group-hover/link:opacity-100 overflow-hidden transition-all duration-300 whitespace-nowrap">Ver más</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
