"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ImageIcon, MapPin, Star, Ticket } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import { LDCFavoriteButton } from "@/components/molecules/ldc-favorite-button";
import type { IEventPriceType } from "@/interfaces/event";
import { eventDateBlock, formatEventPrice, formatEventWhen } from "@/lib/format/events";
import { cn } from "@/lib/utils";

export interface LDCEventCardProps {
  /** Id (UUID) del evento, para el corazón de favoritos; vacío en la vista previa */
  id: string;
  title: string;
  slug: string;
  /** Inicio en ISO; sin él (vista previa en blanco), «Fecha por definir» */
  startsAt?: string;
  endsAt?: string;
  venueName: string;
  city: { name: string; slug: string };
  category?: { name: string };
  image: string;
  priceType: IEventPriceType;
  priceAmount?: number;
  featured?: boolean;
  /** Ya terminó: la imagen se atenúa y se marca «Terminado» */
  past?: boolean;
  /** Vista previa del formulario: sin enlaces ni corazón */
  preview?: boolean;
  className?: string;
}

/**
 * LDCEventCard - Tarjeta de evento (alternativa B de CLGDC-137)
 *
 * Imagen 16:9 con el bloque de fecha (día y mes en hora de Chile) arriba a la izquierda y el
 * corazón de favoritos arriba a la derecha; debajo, categoría (`kind-event`), nombre en dos
 * líneas, cuándo («lun 23 nov · 16:55 a 18:55»), lugar y ciudad, y el precio en el color de
 * marca. Con `preview` no lleva enlaces ni favorito (la vista previa de `LDCEventForm`).
 *
 * Cliente: formatea fechas y lleva el botón de favoritos.
 *
 * @example
 * <LDCEventCard id={e.id} title={e.title} slug={e.slug} startsAt={e.startsAt} endsAt={e.endsAt}
 *   venueName={e.venueName} city={e.city} category={e.category} image={e.image}
 *   priceType={e.priceType} priceAmount={e.priceAmount} />
 */
export function LDCEventCard({
  id,
  title,
  slug,
  startsAt,
  endsAt,
  venueName,
  city,
  category,
  image,
  priceType,
  priceAmount,
  featured,
  past,
  preview,
  className,
}: LDCEventCardProps) {
  const href = `/evento/${slug}`;
  const date = startsAt ? eventDateBlock(startsAt) : null;
  const showFavorite = Boolean(id) && !preview;

  const media = (
    <>
      {image ? (
        <Image
          src={image}
          alt={`${title || "Nombre de tu evento"} - ${category?.name ?? "Evento"} en ${city.name || "Ciudad"}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            past && "opacity-60 grayscale",
          )}
          loading="lazy"
          quality={85}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">
          <ImageIcon className="size-10" aria-hidden />
        </div>
      )}
      <div className="absolute left-2 top-2 z-10 flex items-start gap-1.5">
        <div
          aria-hidden
          className="min-w-11 rounded-md bg-card px-2 py-1 text-center leading-none text-foreground shadow-sm"
        >
          <b className="block text-xl font-black">{date?.day ?? "—"}</b>
          <small className="mt-0.5 block text-[10px] font-extrabold uppercase text-pink-strong dark:text-yellow">
            {date?.month ?? ""}
          </small>
        </div>
        {featured && (
          <LDCBadge variant="featured-icon" aria-label="Destacado">
            <Star className="size-2.5 fill-current" aria-hidden />
          </LDCBadge>
        )}
      </div>
    </>
  );

  const imageClassName = "relative block aspect-video overflow-hidden bg-muted";

  return (
    <LDCCardSurface className={cn("min-w-0", className)}>
      <div className="relative">
        {preview ? (
          <div className={imageClassName}>{media}</div>
        ) : (
          <Link href={href} className={imageClassName} tabIndex={-1} aria-hidden>
            {media}
          </Link>
        )}
        {showFavorite && <LDCFavoriteButton kind="EVENT" targetId={id} title={title} />}
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 px-4 pb-4 pt-3.5">
        {(category || past) && (
          <div className="flex flex-wrap gap-1.5">
            {category && <LDCBadge variant="kind-event">{category.name}</LDCBadge>}
            {past && <LDCBadge variant="status-expired">Terminado</LDCBadge>}
          </div>
        )}
        <h3 className="line-clamp-2 font-mulish text-base font-extrabold leading-snug text-foreground [overflow-wrap:anywhere]">
          {preview ? (
            title
          ) : (
            <Link href={href} className="hover:text-pink focus-visible:underline dark:hover:text-yellow">
              {title}
            </Link>
          )}
        </h3>
        <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
          <CalendarDays className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="[overflow-wrap:anywhere]">
            {startsAt ? <time dateTime={startsAt}>{formatEventWhen(startsAt, endsAt)}</time> : "Fecha por definir"}
          </span>
        </p>
        <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="[overflow-wrap:anywhere]">
            {venueName || "Lugar"} · {city.name || "Ciudad"}
          </span>
        </p>
        <p className="flex min-w-0 items-start gap-1.5 font-open-sans text-[13px] text-muted-foreground">
          <Ticket className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="font-extrabold text-pink-strong dark:text-yellow">
            {formatEventPrice(priceType, priceAmount)}
          </span>
        </p>
      </div>
    </LDCCardSurface>
  );
}
