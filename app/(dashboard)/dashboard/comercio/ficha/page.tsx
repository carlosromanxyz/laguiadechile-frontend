import { ExternalLink, Store } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCListingForm } from "@/components/organisms/ldc-listing-form";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCategories, getCities } from "@/lib/api/catalog";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyListings } from "@/services/me/listings";
import { updateMyListingAction } from "./actions";

export const metadata = {
  title: "Editar ficha — Panel",
};

const DESCRIPTION = "Descripción, fotos, categoría, contacto y horario de tu negocio.";

interface ComercioFichaPageProps {
  searchParams: Promise<{ id?: string | string[]; tipo?: string | string[] }>;
}

/**
 * Ficha del comercio: edita su listing propio (`PATCH /me/listings/:id`, queda en revisión).
 * Con más de una ficha, `?id=` elige cuál; por defecto, la editada más recientemente.
 * `?tipo=comercio|servicio` (el grupo del menú desde el que se llega) filtra las fichas de ese
 * tipo; si la cuenta no tiene ninguna de ese tipo, se muestran todas.
 */
export default async function ComercioFichaPage({ searchParams }: ComercioFichaPageProps) {
  await requireDashboardRole(["comercio", "servicio"]);
  const [{ id, tipo }, allListings, categories, cities] = await Promise.all([
    searchParams,
    getMyListings(),
    getCategories(),
    getCities(),
  ]);

  const type = tipo === "comercio" || tipo === "servicio" ? tipo : undefined;
  const ofType = type ? allListings.filter((l) => l.type === type) : [];
  const listings = ofType.length > 0 ? ofType : allListings;
  const tipoQuery = type ? `&tipo=${type}` : "";

  if (listings.length === 0) {
    return (
      <LDCDashboardPageTemplate title="Editar ficha" description={DESCRIPTION}>
        <LDCPanel>
          <LDCEmptyState
            icon={<Store className="size-10 text-muted-foreground" aria-hidden />}
            title="Aún no tienes una ficha"
            description="Tu cuenta de comercio todavía no tiene una ficha asociada. Escríbenos y la creamos contigo."
            action={<LDCCTAButton href="/contacto" text="Escríbenos" showIcon={false} className="mt-6" />}
          />
        </LDCPanel>
      </LDCDashboardPageTemplate>
    );
  }

  const wanted = typeof id === "string" ? id : undefined;
  const listing = allListings.find((l) => l.id === wanted) ?? listings[0];

  return (
    <LDCDashboardPageTemplate
      title="Editar ficha"
      description={DESCRIPTION}
      actions={
        listing.status === "published" ? (
          <LDCButton href={`/${listing.type}/${listing.slug}`} variant="outline">
            <ExternalLink aria-hidden />
            Ver mi ficha
          </LDCButton>
        ) : undefined
      }
    >
      {listings.length > 1 && (
        <nav aria-label="Tus fichas" className="flex flex-wrap gap-2">
          {listings.map((l) => (
            <LDCButton
              key={l.id}
              href={`/dashboard/comercio/ficha?id=${l.id}${tipoQuery}`}
              variant={l.id === listing.id ? "default" : "outline"}
              size="sm"
              aria-label={l.id === listing.id ? `${l.title} (editando)` : undefined}
            >
              {l.title}
            </LDCButton>
          ))}
        </nav>
      )}
      <LDCListingForm
        key={listing.id}
        listing={listing}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "" }))}
        cities={cities.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        action={updateMyListingAction}
      />
    </LDCDashboardPageTemplate>
  );
}
