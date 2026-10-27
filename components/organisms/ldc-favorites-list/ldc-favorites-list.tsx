import { ChevronRight, Heart } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCFavoriteItem } from "@/components/molecules/ldc-favorite-item";
import type { IDashboardFavorite } from "@/interfaces/dashboard";

export interface LDCFavoritesListProps {
  favorites: IDashboardFavorite[];
  /** Cuántos mostrar (por defecto 4) */
  limit?: number;
  /** Página con todos los favoritos */
  viewAllHref: string;
  /** Marca el dato como simulado */
  simulated?: boolean;
}

/**
 * LDCFavoritesList - Favoritos recientes del usuario
 *
 * Los primeros `limit` favoritos y un enlace a todos; sin favoritos, `LDCEmptyState` con
 * «Explorar La Guía».
 *
 * @example
 * <LDCFavoritesList favorites={favs} viewAllHref="/dashboard/usuario/favoritos" simulated />
 */
export function LDCFavoritesList({
  favorites,
  limit = 4,
  viewAllHref,
  simulated,
}: LDCFavoritesListProps) {
  return (
    <LDCDashboardCard title="Favoritos recientes" simulated={simulated}>
      {favorites.length === 0 ? (
        <LDCEmptyState
          className="py-8"
          icon={<Heart className="size-8 text-muted-foreground" aria-hidden />}
          title="Aún no guardas favoritos"
          description="Toca el corazón en un comercio, aviso o propiedad para verlo aquí."
          action={<LDCCTAButton href="/" text="Explorar La Guía" showIcon={false} className="mt-4" />}
        />
      ) : (
        <div className="grid gap-2">
          <ul className="grid gap-2">
            {favorites.slice(0, limit).map(({ id, ...fav }) => (
              <li key={id}>
                <LDCFavoriteItem {...fav} />
              </li>
            ))}
          </ul>
          <LDCButton href={viewAllHref} variant="ghost" size="sm">
            Ver los {favorites.length} favoritos
            <ChevronRight />
          </LDCButton>
        </div>
      )}
    </LDCDashboardCard>
  );
}
