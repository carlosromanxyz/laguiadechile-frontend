import { LDCFavoritesList } from "@/components/organisms/ldc-favorites-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyFavorites } from "@/services/dashboard/usuario";
import { removeFavoriteAction } from "./actions";

export const metadata = {
  title: "Favoritos — Panel",
};

export default async function UsuarioFavoritosPage() {
  const [, favorites] = await Promise.all([requireDashboardRole("usuario"), getMyFavorites()]);

  return (
    <LDCDashboardPageTemplate title="Favoritos" description="Comercios, avisos, propiedades y noticias que guardaste.">
      <LDCFavoritesList
        favorites={favorites}
        title={favorites.length === 1 ? "1 guardado" : `${favorites.length} guardados`}
        limit={favorites.length}
        onRemove={removeFavoriteAction}
      />
    </LDCDashboardPageTemplate>
  );
}
