import { ChevronRight, Heart, Pencil, RefreshCw, Tags, TriangleAlert } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import { LDCFavoritesList } from "@/components/organisms/ldc-favorites-list";
import { LDCTaskList } from "@/components/organisms/ldc-task-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardPublicationStatus } from "@/interfaces/dashboard";
import { formatShortDate } from "@/lib/dashboard/dates";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { formatClassifiedPrice, typeLabels } from "@/lib/format/classifieds";
import { getMyClassifieds, getMyFavorites } from "@/services/dashboard/usuario";

export const metadata = {
  title: "Inicio — Panel",
};

const AVISOS_HREF = "/dashboard/usuario/avisos";

const STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicado",
  review: "En revisión",
  expired: "Vencido",
  rejected: "Rechazado",
};

export default async function UsuarioHomePage() {
  const [session, classifieds, favorites] = await Promise.all([
    requireDashboardRole("usuario"),
    getMyClassifieds(),
    getMyFavorites(),
  ]);
  const expired = classifieds.filter((c) => c.ownership.status === "expired");
  const active = classifieds.filter((c) => c.ownership.status === "published");

  return (
    <LDCDashboardPageTemplate
      title={`Hola, ${session.user.greetingName}`}
      description="Tus avisos, lo que guardaste y tus datos de contacto."
      actions={<LDCCTAButton href="/publicar" text="Publicar aviso" />}
    >
      <LDCTaskList
        tasks={
          expired.length > 0
            ? [
                {
                  id: "avisos-vencidos",
                  tone: "warning",
                  title: `Tienes ${expired.length} ${expired.length === 1 ? "aviso vencido" : "avisos vencidos"}`,
                  description: "Ya no aparecen en La Guía. Renuévalos con un clic.",
                  action: { label: "Renovar", href: AVISOS_HREF },
                  actionIcon: <RefreshCw />,
                },
              ]
            : []
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <LDCStatCard
          label="Favoritos"
          value={favorites.length}
          icon={<Heart className="size-4" />}
          href="/dashboard/usuario/favoritos"
        />
        <LDCStatCard
          label="Avisos activos"
          value={active.length}
          icon={<Tags className="size-4" />}
          hint={`de ${classifieds.length} en total`}
        />
        <LDCStatCard
          label="Avisos vencidos"
          value={expired.length}
          icon={<TriangleAlert className="size-4" />}
          href={AVISOS_HREF}
          hint={
            <>
              Renovar
              <ChevronRight className="size-3" aria-hidden />
            </>
          }
          hintTone="accent"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <LDCDashboardCard
          title="Mis avisos"
          action={
            <LDCButton href={AVISOS_HREF} variant="ghost" size="sm">
              Ver todos
              <ChevronRight />
            </LDCButton>
          }
        >
          {classifieds.length === 0 ? (
            <LDCEmptyState
              className="py-8"
              icon={<Tags className="size-8 text-muted-foreground" aria-hidden />}
              title="Aún no publicas avisos"
              description="Cuando publiques un aviso, lo verás aquí con su estado y vencimiento."
            />
          ) : (
          <ul>
            {classifieds.map(({ item, ownership }) => (
              <LDCDashboardListItem
                key={item.id}
                image={item.image}
                title={item.title}
                meta={
                  <>
                    <LDCBadge variant={`classified-${item.type}`}>{typeLabels[item.type]}</LDCBadge>
                    {ownership.status !== "published" && (
                      <LDCBadge variant={`status-${ownership.status}`}>
                        {STATUS_LABELS[ownership.status]}
                      </LDCBadge>
                    )}
                  </>
                }
                subtitle={[
                  formatClassifiedPrice(item.price),
                  item.commune ?? item.city.name,
                  item.expiresAt
                    ? `${ownership.status === "expired" ? "venció" : "vence"} el ${formatShortDate(item.expiresAt)}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                actions={
                  <>
                    <LDCButton href={AVISOS_HREF} size="sm">
                      <RefreshCw />
                      Renovar
                    </LDCButton>
                    <LDCButton href={AVISOS_HREF} variant="outline" size="sm">
                      <Pencil />
                      Editar
                    </LDCButton>
                  </>
                }
              />
            ))}
          </ul>
          )}
        </LDCDashboardCard>
        <LDCFavoritesList favorites={favorites} viewAllHref="/dashboard/usuario/favoritos" />
      </div>
    </LDCDashboardPageTemplate>
  );
}
