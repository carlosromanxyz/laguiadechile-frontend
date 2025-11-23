"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { formatPublicationsCount } from "@/services/featured-cities";

interface LDCCityCardProps {
  /** City name */
  name: string;
  /** City slug for URL */
  slug: string;
  /** City image URL */
  image: string;
  /** Number of publications */
  count: number;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCCityCard - Featured City Card Component
 *
 * Card displaying a city with background image, gradient overlay, and publication count.
 * Features hover scale effect on image.
 *
 * @example
 * ```tsx
 * <LDCCityCard
 *   name="Santiago"
 *   slug="santiago"
 *   image="/images/santiago.jpg"
 *   count={2847}
 * />
 * ```
 */
export function LDCCityCard({
  name,
  slug,
  image,
  count,
  className,
}: LDCCityCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl bg-card dark:bg-neutral-800 shadow-md",
        className
      )}
    >
      <Link href={`/ciudad/${slug}`} className="block relative h-56 xl:h-96 overflow-hidden">
        {/* Background Image */}
        <Image
          src={image}
          alt={`Imagen de ${name}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
          className="object-cover transition-all duration-300 group-hover:scale-125 group-hover:opacity-75"
          loading="lazy"
          quality={85}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
          <h3 className="text-md xl:text-2xl font-bold font-mulish mb-1">
            {name}
          </h3>
          <p className="text-xs xl:text-lg text-white/90">
            {formatPublicationsCount(count)}
          </p>
        </div>
      </Link>
    </article>
  );
}
