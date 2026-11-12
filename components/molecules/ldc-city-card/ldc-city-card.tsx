"use client";

import { cn } from "@/lib/utils";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { formatPublicationsCount } from "@/lib/format/cities";

interface LDCCityCardProps {
  /** City name */
  name: string;
  /** City slug for URL */
  slug: string;
  /** Foto de la ciudad (`/media/...`); sin ella, el marcador gris del DS con el ícono de imagen */
  image?: string;
  /** Number of publications */
  count: number;
  /** Aspect ratio variant */
  aspectRatio?: "4/3" | "1/1" | "9/16" | "3/4";
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCCityCard - Featured City Card Component
 *
 * Card de ciudad: foto a sangre con el nombre y el conteo en una placa plana
 * (`bg-card`) abajo. Zoom de la foto al pasar el cursor (respeta reduced motion).
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
const aspectRatioClasses = {
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "9/16": "aspect-[9/16]",
  "3/4": "aspect-[3/4]",
};

export function LDCCityCard({
  name,
  slug,
  image,
  count,
  aspectRatio = "4/3",
  className,
}: LDCCityCardProps) {
  return (
    <LDCCardSurface variant="media" className={className}>
      <Link
        href={`/ciudad/${slug}`}
        className={cn("block relative overflow-hidden focus-visible:outline-none", aspectRatioClasses[aspectRatio])}
      >
        {/* Background Image (decorativa: el nombre ya está en el h3) */}
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
            className="object-cover transition-[scale,opacity] duration-300 group-hover:scale-125 group-hover:opacity-75 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            loading="lazy"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground">
            <ImageIcon className="size-10" aria-hidden />
          </div>
        )}

        {/* Content: placa de superficie plana, contraste por token en ambos temas */}
        <div className="absolute inset-x-2 bottom-2 z-10 rounded-lg border border-border bg-card px-3 py-2.5 xl:px-4 xl:py-3">
          <h3 className="text-base xl:text-xl font-bold font-mulish leading-snug text-foreground break-words group-hover:text-pink-strong dark:group-hover:text-yellow group-has-[a:focus-visible]:text-pink-strong dark:group-has-[a:focus-visible]:text-yellow">
            {name}
          </h3>
          <p className="text-xs xl:text-sm text-muted-foreground">
            {formatPublicationsCount(count)}
          </p>
        </div>
      </Link>
    </LDCCardSurface>
  );
}
