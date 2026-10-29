import { ChevronRight, Heart } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCFavoriteItem } from "@/components/molecules/ldc-favorite-item";
import {
  LDCFavoriteRemoveButton,
  type LDCFavoriteRemoveButtonProps,
} from "@/components/molecules/ldc-favorite-remove-button";
import type { IDashboardFavorite } from "@/interfaces/dashboard";

export interface LDCFavoritesListProps {
  favorites: IDashboardFavorite[];
  /** Título de la tarjeta (por defecto «Favoritos recientes») */
  title?: string;
  /** Cuántos mostrar (por defecto 4) */
  limit?: number;
  /** Página con todos los favoritos; sin ella no se muestra el enlace */
  viewAllHref?: string;
  /** Server action para quitar un favorito; si llega, cada uno lleva su botón */
  onRemove?: LDCFavoriteRemoveButtonProps["onRemove"];
  /** Marca el dato como simulado */
  simulated?: boolean;
}

/**
 * LDCFavoritesList - Favoritos del usuario
 *
 * Los primeros `limit` favoritos y un enlace a todos; con `onRemove`, un botón para quitar
 * cada uno. Sin favoritos, `LDCEmptyState` con «Explorar La Guía».
 *
 * @example
 * <LDCFavoritesList favorites={favs} viewAllHref="/dashboard/usuario/favoritos" />
 * <LDCFavoritesList favorites={favs} limit={favs.length} onRemove={removeFavoriteAction} />
 */
export function LDCFavoritesList({
  favorites,
  title = "Favoritos recientes",
  limit = 4,
  viewAllHref,
  onRemove,
  simulated,
}: LDCFavoritesListProps) {
  return (
    <LDCDashboardCard title={title} simulated={simulated}>
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
            {favorites.slice(0, limit).map(({ id, kindKey, targetId, ...fav }) => (
              <li key={id} className={onRemove ? "flex min-w-0 items-center gap-2" : undefined}>
                {onRemove ? (
                  <>
                    <div className="min-w-0 flex-1">
                      <LDCFavoriteItem {...fav} />
                    </div>
                    <LDCFavoriteRemoveButton
                      kindKey={kindKey}
                      targetId={targetId}
                      title={fav.title}
                      onRemove={onRemove}
                    />
                  </>
                ) : (
                  <LDCFavoriteItem {...fav} />
                )}
              </li>
            ))}
          </ul>
          {viewAllHref && (
            <LDCButton href={viewAllHref} variant="ghost" size="sm">
              Ver los {favorites.length} favoritos
              <ChevronRight />
            </LDCButton>
          )}
        </div>
      )}
    </LDCDashboardCard>
  );
}
