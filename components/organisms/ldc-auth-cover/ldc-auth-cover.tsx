import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import type { IListing } from "@/interfaces/listing";

export interface LDCAuthCoverStat {
  /** Conteo */
  value: number;
  /** Qué se cuenta («comercios y servicios», «ciudades»…) */
  label: string;
}

export interface LDCAuthCoverProps {
  /** Comercio o servicio destacado de la portada (sin él, solo el fondo y los conteos) */
  listing?: Pick<IListing, "title" | "image" | "category" | "city"> | null;
  /** Conteos reales de la guía */
  stats: LDCAuthCoverStat[];
}

/**
 * LDCAuthCover - Portada de la pantalla de acceso (lado derecho desde `lg`)
 *
 * Imagen de un comercio destacado con velo negro fijo (el texto blanco se lee en
 * ambos temas), franja de marca, `LDCBadge` «Destacado», nombre, categoría y
 * ciudad, y los conteos de la guía. Presentacional: los datos los pide la página
 * a la DAL. Ocupa el alto de su contenedor (lo pone `LDCAuthTemplate`).
 *
 * @example
 * <LDCAuthCover listing={featured} stats={[{ value: 80, label: "comercios y servicios" }]} />
 */
export function LDCAuthCover({ listing, stats }: LDCAuthCoverProps) {
  return (
    <aside aria-label="Destacado de la guía" className="relative h-full overflow-hidden bg-muted">
      {listing && (
        <Image
          src={listing.image}
          alt={`${listing.title}, ${listing.category.name} en ${listing.city.name}`}
          fill
          sizes="50vw"
          className="object-cover"
          quality={85}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1">
        <span className="flex-1 bg-pink" />
        <span className="flex-1 bg-purple" />
        <span className="flex-1 bg-yellow" />
        <span className="flex-1 bg-orange" />
      </div>
      <div className="absolute inset-x-10 bottom-10 flex flex-col gap-2.5 text-white">
        {listing && (
          <>
            <LDCBadge variant="featured" className="gap-1 self-start">
              <Star className="size-3 fill-current" aria-hidden="true" />
              Destacado
            </LDCBadge>
            <h2 className="font-mulish text-3xl font-black leading-tight text-balance">
              {listing.title}
            </h2>
            <p className="flex items-center gap-1.5 font-open-sans text-sm text-white/85">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {listing.category.name} · {listing.city.name}
            </p>
          </>
        )}
        {stats.length > 0 && (
          <dl className="mt-3.5 grid grid-cols-4 gap-3 border-t border-white/20 pt-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="font-open-sans text-xs text-white/85">{stat.label}</dt>
                <dd className="font-mulish text-2xl font-black leading-none">
                  {stat.value.toLocaleString("es-CL")}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </aside>
  );
}
