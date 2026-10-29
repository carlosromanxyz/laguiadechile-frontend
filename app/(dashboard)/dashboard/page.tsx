import type { ReactNode } from "react";
import { ChartColumn, ChevronRight, CirclePlus, Heart, Pencil, RefreshCw, ShieldCheck } from "lucide-react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCRoleIcon } from "@/components/atoms/ldc-role-icon";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import { LDC_PUBLISH_KINDS, LDCPublishChooser } from "@/components/organisms/ldc-publish-chooser";
import { LDCTaskList } from "@/components/organisms/ldc-task-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { DASHBOARD_PUBLISH_ROLES, dashboardPublishCta } from "@/config/dashboard-navigation";
import type {
  IDashboardOwned,
  IDashboardPublicationStatus,
  IDashboardTask,
} from "@/interfaces/dashboard";
import type { IListingDetail } from "@/interfaces/listing";
import { hasAnyRole, type LDCRole } from "@/lib/auth/roles";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { getModerationQueue } from "@/services/dashboard/admin";
import { getMyListingsStatus, getMyTasks } from "@/services/dashboard/comercio";
import { getMyClassifieds, getMyFavorites } from "@/services/dashboard/usuario";

export const metadata = {
  title: "Inicio — Panel",
};

const AVISOS_HREF = "/dashboard/avisos";
// Formulario de aviso: CLGDC-125.
const NEW_AVISO_HREF = "/dashboard/avisos/nuevo";

const LISTING_STATUS_LABELS: Record<IDashboardPublicationStatus, string> = {
  published: "Publicada",
  review: "En revisión",
  expired: "Vencida",
  rejected: "Rechazada",
};

/** Lo que cubre el inicio según los roles, para la bajada («Tus avisos, tu comercio y …»). */
function describe(roles: readonly LDCRole[]): string {
  const parts = [
    roles.includes("avisador") && "tus avisos",
    roles.includes("comercio") && "tu comercio",
    roles.includes("servicio") && "tu servicio",
    roles.includes("admin") && "la administración de La Guía",
  ].filter((p): p is string => Boolean(p));
  if (parts.length === 0) return "Lo que guardaste y tus datos de contacto.";
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} y ${parts.at(-1)}`;
  return `${list.charAt(0).toUpperCase()}${list.slice(1)}, en un solo lugar.`;
}

/** Tarjeta de «Mis comercios» o «Mis servicios»: su ficha principal y los atajos de la sección. */
function ListingRoleCard({
  role,
  title,
  listings,
}: {
  role: "comercio" | "servicio";
  title: string;
  listings: IDashboardOwned<IListingDetail>[];
}) {
  const main = listings.find((l) => l.ownership.status === "published") ?? listings[0];
  return (
    <LDCDashboardCard
      title={
        <span className="flex items-center gap-2">
          <LDCRoleIcon role={role} size="xs" />
          {title}
        </span>
      }
      action={
        <LDCButton href="/dashboard/comercio" variant="ghost" size="sm">
          Fichas
          <ChevronRight />
        </LDCButton>
      }
    >
      {main ? (
        <ul>
          <LDCDashboardListItem
            image={main.item.image}
            title={main.item.title}
            meta={
              <>
                <LDCBadge variant={`status-${main.ownership.status}`}>
                  {LISTING_STATUS_LABELS[main.ownership.status]}
                </LDCBadge>
                {main.item.featured && main.ownership.status === "published" && (
                  <LDCBadge variant="featured">Destacado</LDCBadge>
                )}
              </>
            }
            subtitle={[main.item.category.name, main.item.commune, main.item.city.name]
              .filter(Boolean)
              .join(" · ")}
            actions={
              <>
                <LDCButton
                  href={`/dashboard/comercio/ficha?id=${encodeURIComponent(main.item.id)}&tipo=${role}`}
                  variant="outline"
                  size="sm"
                >
                  <Pencil />
                  Editar ficha
                </LDCButton>
                <LDCButton href={`/dashboard/comercio/estadisticas?tipo=${role}`} variant="ghost" size="sm">
                  <ChartColumn />
                  Estadísticas
                </LDCButton>
              </>
            }
          />
        </ul>
      ) : (
        <p className="font-open-sans text-sm text-muted-foreground">
          Aún no tienes fichas de {role === "comercio" ? "comercio" : "servicio"}.
        </p>
      )}
    </LDCDashboardCard>
  );
}

/**
 * Inicio del panel, el mismo para toda cuenta: tareas pendientes, el selector «¿Qué quieres
 * publicar?» con lo que aún no publica y una tarjeta por cada rol que tiene (Mis avisos, Mis
 * comercios, Mis servicios y Admin).
 */
export default async function DashboardHomePage() {
  const session = await requireDashboardSession();
  const { roles } = session;
  const isAvisador = roles.includes("avisador");
  const hasListings = hasAnyRole(roles, ["comercio", "servicio"]);
  const isAdmin = roles.includes("admin");

  const [classifieds, listings, listingTasks, queue, favorites] = await Promise.all([
    isAvisador ? getMyClassifieds() : [],
    hasListings ? getMyListingsStatus() : [],
    hasListings ? getMyTasks() : [],
    isAdmin ? getModerationQueue() : [],
    getMyFavorites(),
  ]);

  const count = (s: IDashboardPublicationStatus) =>
    classifieds.filter((c) => c.ownership.status === s).length;
  const rejected = classifieds.filter((c) => c.ownership.status === "rejected");
  const expired = count("expired");

  const tasks: (IDashboardTask & { actionIcon?: ReactNode })[] = [
    ...rejected.map((c) => ({
      id: `aviso-rechazado-${c.item.id}`,
      tone: "warning" as const,
      title: "Un aviso rechazado",
      description: `«${c.item.title}»: revisa el motivo y vuelve a enviarlo.`,
      action: { label: "Ver motivo", href: `${AVISOS_HREF}?estado=rechazados` },
    })),
    ...(expired > 0
      ? [
          {
            id: "avisos-vencidos",
            tone: "warning" as const,
            title: `Tienes ${expired} ${expired === 1 ? "aviso vencido" : "avisos vencidos"}`,
            description: "Ya no aparecen en La Guía. Renuévalos con un clic.",
            action: { label: "Renovar", href: `${AVISOS_HREF}?estado=vencidos` },
            actionIcon: <RefreshCw />,
          },
        ]
      : []),
    ...listingTasks,
  ];

  const publishKinds = LDC_PUBLISH_KINDS.filter((k) => !roles.includes(k.role)).map((k) => k.kind);

  return (
    <LDCDashboardPageTemplate
      title={`Hola, ${session.user.greetingName}`}
      description={describe(roles)}
      actions={
        hasAnyRole(roles, DASHBOARD_PUBLISH_ROLES) ? (
          <LDCCTAButton href={dashboardPublishCta.href} text={dashboardPublishCta.label} />
        ) : undefined
      }
    >
      <LDCTaskList tasks={tasks} />

      <LDCPublishChooser kinds={publishKinds} />

      {(isAvisador || hasListings || isAdmin) && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isAvisador && (
            <LDCDashboardCard
              title={
                <span className="flex items-center gap-2">
                  <LDCRoleIcon role="avisador" size="xs" />
                  Mis avisos
                </span>
              }
              action={
                <LDCButton href={AVISOS_HREF} variant="ghost" size="sm">
                  Ver todos
                  <ChevronRight />
                </LDCButton>
              }
            >
              <dl className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["Activos", count("published")],
                    ["En revisión", count("review")],
                    ["Vencidos", expired],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex flex-col-reverse rounded-md bg-muted p-2">
                    <dt className="font-open-sans text-xs text-muted-foreground">{label}</dt>
                    <dd className="text-lg font-black">{value}</dd>
                  </div>
                ))}
              </dl>
              <LDCButton href={NEW_AVISO_HREF} variant="outline" size="sm" className="mt-3 w-full">
                <CirclePlus />
                Publicar aviso
              </LDCButton>
            </LDCDashboardCard>
          )}
          {roles.includes("comercio") && (
            <ListingRoleCard
              role="comercio"
              title="Mis comercios"
              listings={listings.filter((l) => l.item.type === "comercio")}
            />
          )}
          {roles.includes("servicio") && (
            <ListingRoleCard
              role="servicio"
              title="Mis servicios"
              listings={listings.filter((l) => l.item.type === "servicio")}
            />
          )}
          {isAdmin && (
            <LDCDashboardCard
              title={
                <span className="flex items-center gap-2">
                  <LDCRoleIcon role="admin" size="xs" />
                  Admin
                </span>
              }
              action={
                <LDCButton href="/dashboard/admin" variant="ghost" size="sm">
                  Resumen
                  <ChevronRight />
                </LDCButton>
              }
            >
              <div className="rounded-md bg-muted p-2">
                <p className="text-lg font-black">{queue.length}</p>
                <p className="font-open-sans text-xs text-muted-foreground">
                  {queue.length === 1 ? "Publicación por moderar" : "Publicaciones por moderar"}
                </p>
              </div>
              <LDCButton href="/dashboard/admin/moderacion" size="sm" className="mt-3 w-full">
                <ShieldCheck />
                Ir a moderación
              </LDCButton>
            </LDCDashboardCard>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <LDCStatCard
          label="Favoritos"
          value={favorites.length}
          icon={<Heart className="size-4" />}
          href="/dashboard/usuario/favoritos"
        />
      </div>
    </LDCDashboardPageTemplate>
  );
}
