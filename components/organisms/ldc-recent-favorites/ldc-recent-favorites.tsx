import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import type { IDashboardFavorite } from "@/interfaces/dashboard";

const FAVORITES_HREF = "/dashboard/usuario/favoritos";

export interface LDCRecentFavoritesProps {
  /** Los más recientes primero; se muestran los primeros `limit` */
  favorites: IDashboardFavorite[];
  /** Cuántos mostrar (por defecto 3) */
  limit?: number;
  className?: string;
}

/**
 * LDCRecentFavorites - Lo último que la cuenta guardó, en el inicio del panel
 *
 * Miniatura, tipo, título con enlace a la página pública y ciudad. El encabezado lleva a
 * «Favoritos» con el total. Sin favoritos, una invitación a recorrer La Guía.
 *
 * @example
 * <LDCRecentFavorites favorites={await getMyFavorites()} />
 */
export function LDCRecentFavorites({ favorites, limit = 3, className }: LDCRecentFavoritesProps) {
  const shown = favorites.slice(0, limit);
  return (
    <LDCDashboardCard
      title="Tus favoritos"
      className={className}
      action={
        favorites.length > 0 ? (
          <LDCButton href={FAVORITES_HREF} variant="ghost" size="sm">
            {favorites.length > shown.length ? `Ver los ${favorites.length}` : "Ver todos"}
            <ChevronRight />
          </LDCButton>
        ) : undefined
      }
    >
      {shown.length === 0 ? (
        <>
          <p className="font-open-sans text-sm text-muted-foreground">
            Guarda comercios, avisos, propiedades o eventos con el corazón y los tendrás a mano aquí.
          </p>
          <LDCButton href="/" variant="outline" size="sm" className="mt-3 w-full">
            <Compass />
            Recorrer La Guía
          </LDCButton>
        </>
      ) : (
        <ul>
          {shown.map((f) => (
            <LDCDashboardListItem
              key={f.id}
              image={f.image}
              meta={<span>{f.kind}</span>}
              title={
                <Link href={f.href} className="hover:underline">
                  {f.title}
                </Link>
              }
              subtitle={f.place || undefined}
            />
          ))}
        </ul>
      )}
    </LDCDashboardCard>
  );
}
