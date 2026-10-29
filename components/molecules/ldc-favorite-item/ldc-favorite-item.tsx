import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LDCCardSurface } from "@/components/atoms/ldc-card-surface";
import type { IDashboardFavorite } from "@/interfaces/dashboard";

export type LDCFavoriteItemProps = Pick<IDashboardFavorite, "kind" | "title" | "place" | "image" | "href">;

/**
 * LDCFavoriteItem - Favorito compacto del panel del usuario
 *
 * Enlace a la página pública sobre la carcasa `LDCCardSurface` (fondo, borde, radio y sombra
 * al pasar): miniatura de 56 px, tipo en el color de acento, título en hasta 2 líneas, ciudad
 * o categoría y el corazón relleno.
 *
 * @example
 * <LDCFavoriteItem kind="Propiedad" title="Departamento con vista al mar" place="Viña del Mar"
 *   image="…" href="/propiedad/departamento-vista-mar-vina-del-mar" />
 */
export function LDCFavoriteItem({ kind, title, place, image, href }: LDCFavoriteItemProps) {
  return (
    <LDCCardSurface asChild>
      <Link
        href={href}
        className="flex min-w-0 items-center gap-2.5 p-2.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Image
          src={image}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-md bg-muted object-cover"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-pink dark:text-yellow">
            {kind}
          </p>
          <p className="line-clamp-2 text-sm font-bold">{title}</p>
          {place && <p className="truncate font-open-sans text-xs text-muted-foreground">{place}</p>}
        </div>
        <Heart className="ml-auto size-4 shrink-0 fill-pink text-pink" aria-hidden />
      </Link>
    </LDCCardSurface>
  );
}
