import type { ReactNode } from "react";
import {
  CalendarDays,
  House,
  Inbox,
  Newspaper,
  RefreshCw,
  Store,
  Tags,
  Users,
  Wrench,
} from "lucide-react";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import type { LDCStatusCountItem } from "@/components/molecules/ldc-status-counts";
import { LDCAdminActivity, type LDCAdminActivityItem } from "@/components/organisms/ldc-admin-activity";
import { LDCOwnerSummaryCard } from "@/components/organisms/ldc-owner-summary-card";
import { getPublishKinds, LDCPublishChooser } from "@/components/organisms/ldc-publish-chooser";
import { LDCRecentFavorites } from "@/components/organisms/ldc-recent-favorites";
import { LDCTaskList } from "@/components/organisms/ldc-task-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardPublicationStatus, IDashboardTask } from "@/interfaces/dashboard";
import type {
  IAdminRecentItem,
  IAdminStats,
  IMySummary,
  IPublicationGroup,
  IStatusCounts,
} from "@/interfaces/dashboard-summary";
import { hasAnyRole, type LDCRole } from "@/lib/auth/roles";
import { ADMIN_PUBLICATION_STATUS_META, adminStatusLabel } from "@/lib/dashboard/admin-publication-status";
import { formatRelative } from "@/lib/dashboard/dates";
import { requireDashboardSession } from "@/lib/dashboard/session";
import { formatPersonName } from "@/lib/people";
import { getMyTasks } from "@/services/dashboard/comercio";
import { getAdminStats, getMySummary } from "@/services/dashboard/summary";
import { getMyClassifieds, getMyFavorites } from "@/services/dashboard/usuario";

export const metadata = {
  title: "Inicio — Panel",
};

const AVISOS_HREF = "/dashboard/avisos";

/** Lo que cubre el inicio según los roles, para la bajada («Tus avisos, tu comercio y …»). */
function describe(roles: readonly LDCRole[]): string {
  const parts = [
    roles.includes("avisador") && "tus avisos",
    roles.includes("propietario") && "tus propiedades",
    roles.includes("comercio") && "tu comercio",
    roles.includes("servicio") && "tu servicio",
    roles.includes("organizador") && "tus eventos",
    roles.includes("admin") && "la administración de La Guía",
  ].filter((p): p is string => Boolean(p));
  if (parts.length === 0) return "Lo que guardaste y tus datos de contacto.";
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} y ${parts.at(-1)}`;
  return `${list.charAt(0).toUpperCase()}${list.slice(1)}, en un solo lugar.`;
}

// ─────────────────────────────── roles dueños ───────────────────────────────

interface OwnerGroup {
  role: Exclude<LDCRole, "usuario" | "admin">;
  group: IPublicationGroup;
  title: string;
  listHref: string;
  createHref: string;
  createLabel: string;
  emptyText: string;
  /** Plurales de cada celda; `out` es «vencidos o archivados» (o lo que aplique al tipo). */
  labels: { published: string; review: string; rejected: string; out: string };
  /** Claves de `?estado=` del listado «Mis …»; `expired: null` si el tipo no vence (fichas, propiedades). */
  keys: { published: string; review: string; rejected: string; expired: string | null; archived: string };
  /** Ficha (`LISTING`) de ese tipo, o el tipo de publicación de los rechazos. */
  rejectionKind: { kind: "LISTING"; type: "COMERCIO" | "SERVICIO" } | { kind: "CLASSIFIED" | "EVENT" | "PROPERTY" };
}

const MASC = { published: "publicados", review: "revision", rejected: "rechazados", archived: "archivados" };
const FEM = { published: "publicadas", review: "revision", rejected: "rechazadas", archived: "archivadas" };

/** En el orden del menú del panel. */
const OWNER_GROUPS: OwnerGroup[] = [
  {
    role: "avisador",
    group: "classifieds",
    title: "Mis avisos",
    listHref: AVISOS_HREF,
    createHref: "/dashboard/avisos/nuevo",
    createLabel: "Publicar aviso",
    emptyText: "Aún no tienes avisos. Vende, compra o arrienda con un aviso gratis.",
    labels: { published: "Publicados", review: "En revisión", rejected: "Rechazados", out: "Vencidos o archivados" },
    keys: { ...MASC, expired: "vencidos" },
    rejectionKind: { kind: "CLASSIFIED" },
  },
  {
    role: "propietario",
    group: "properties",
    title: "Mis propiedades",
    listHref: "/dashboard/propiedades",
    createHref: "/dashboard/propiedades/nueva",
    createLabel: "Publicar propiedad",
    emptyText: "Aún no tienes propiedades. Publica una casa, un depto o un terreno.",
    labels: { published: "Publicadas", review: "En revisión", rejected: "Rechazadas", out: "Archivadas" },
    keys: { ...FEM, expired: null },
    rejectionKind: { kind: "PROPERTY" },
  },
  {
    role: "comercio",
    group: "comercios",
    title: "Mis comercios",
    listHref: "/dashboard/comercio/publicaciones?tipo=comercio",
    createHref: "/dashboard/publicar?tipo=comercio",
    createLabel: "Publicar comercio",
    emptyText: "Aún no tienes fichas de comercio. Sube la tuya para que te encuentren.",
    labels: { published: "Publicadas", review: "En revisión", rejected: "Rechazadas", out: "Archivadas" },
    keys: { ...FEM, expired: null },
    rejectionKind: { kind: "LISTING", type: "COMERCIO" },
  },
  {
    role: "servicio",
    group: "servicios",
    title: "Mis servicios",
    listHref: "/dashboard/comercio/publicaciones?tipo=servicio",
    createHref: "/dashboard/publicar?tipo=servicio",
    createLabel: "Publicar servicio",
    emptyText: "Aún no tienes fichas de servicio. Sube la tuya para que te encuentren.",
    labels: { published: "Publicadas", review: "En revisión", rejected: "Rechazadas", out: "Archivadas" },
    keys: { ...FEM, expired: null },
    rejectionKind: { kind: "LISTING", type: "SERVICIO" },
  },
  {
    role: "organizador",
    group: "events",
    title: "Mis eventos",
    listHref: "/dashboard/eventos",
    createHref: "/dashboard/eventos/nuevo",
    createLabel: "Publicar evento",
    emptyText: "Aún no tienes eventos. Publica una feria, un concierto o un taller.",
    labels: { published: "Publicados", review: "En revisión", rejected: "Rechazados", out: "Terminados o archivados" },
    keys: { ...MASC, expired: "terminados" },
    rejectionKind: { kind: "EVENT" },
  },
];

/** El listado «Mis …» filtrado por estado (el de fichas ya trae `?tipo=`). */
function statusHref(g: OwnerGroup, key: string): string {
  return `${g.listHref}${g.listHref.includes("?") ? "&" : "?"}estado=${key}`;
}

/** Cuatro celdas: publicadas, en revisión, rechazadas y las que ya no se ven (vencidas o archivadas). */
function ownerCounts(g: OwnerGroup, c: IStatusCounts): LDCStatusCountItem[] {
  const outKey = c.EXPIRED > 0 && g.keys.expired ? g.keys.expired : g.keys.archived;
  return [
    { key: "published", label: g.labels.published, value: c.PUBLISHED, href: statusHref(g, g.keys.published) },
    { key: "review", label: g.labels.review, value: c.REVIEW, href: statusHref(g, g.keys.review) },
    { key: "rejected", label: g.labels.rejected, value: c.REJECTED, href: statusHref(g, g.keys.rejected), tone: "alert" },
    { key: "out", label: g.labels.out, value: c.EXPIRED + c.ARCHIVED, href: statusHref(g, outKey) },
  ];
}

function ownerRejection(g: OwnerGroup, summary: IMySummary) {
  const r = summary.rejections.find(
    (x) => x.kind === g.rejectionKind.kind && ("type" in g.rejectionKind ? x.type === g.rejectionKind.type : true),
  );
  if (!r) return undefined;
  const tipo = g.role === "servicio" ? "servicio" : "comercio";
  const href =
    r.kind === "LISTING"
      ? `/dashboard/comercio/ficha?id=${encodeURIComponent(r.id)}&tipo=${tipo}`
      : statusHref(g, g.keys.rejected);
  return { title: r.title, reason: r.reason?.trim() || null, href };
}

// ─────────────────────────────── admin ───────────────────────────────

const ADMIN_GROUPS: { group: IPublicationGroup; label: string; href: string; icon: ReactNode }[] = [
  { group: "comercios", label: "Comercios", href: "/dashboard/admin/comercios", icon: <Store className="size-4" /> },
  { group: "servicios", label: "Servicios", href: "/dashboard/admin/servicios", icon: <Wrench className="size-4" /> },
  { group: "classifieds", label: "Avisos", href: "/dashboard/admin/avisos", icon: <Tags className="size-4" /> },
  { group: "properties", label: "Propiedades", href: "/dashboard/admin/propiedades", icon: <House className="size-4" /> },
  { group: "events", label: "Eventos", href: "/dashboard/admin/eventos", icon: <CalendarDays className="size-4" /> },
];

const KIND_META: Record<
  IAdminRecentItem["kind"],
  { label: string; href: string; gender: "m" | "f" }
> = {
  LISTING: { label: "Comercio", href: "/dashboard/admin/comercios", gender: "m" },
  CLASSIFIED: { label: "Aviso", href: "/dashboard/admin/avisos", gender: "m" },
  EVENT: { label: "Evento", href: "/dashboard/admin/eventos", gender: "m" },
  PROPERTY: { label: "Propiedad", href: "/dashboard/admin/propiedades", gender: "f" },
};

function activityItem(r: IAdminRecentItem, now: Date): LDCAdminActivityItem {
  const meta = KIND_META[r.kind];
  const isService = r.kind === "LISTING" && r.type === "SERVICIO";
  const base = isService ? "/dashboard/admin/servicios" : meta.href;
  const href =
    r.kind === "PROPERTY"
      ? `${base}/${encodeURIComponent(r.id)}`
      : `${base}?q=${encodeURIComponent(r.title)}`;
  const statusLabel =
    r.kind === "EVENT" && r.status === "EXPIRED" ? "Terminado" : adminStatusLabel(r.status, meta.gender);
  return {
    id: `${r.kind}:${r.id}`,
    title: r.title,
    href,
    kindLabel: isService ? "Servicio" : meta.label,
    statusLabel,
    statusBadge: ADMIN_PUBLICATION_STATUS_META[r.status].badge,
    by: r.owner ? formatPersonName(r.owner) : "Sin dueño",
    when: formatRelative(r.updatedAt, now),
  };
}

function AdminOverview({ stats }: { stats: IAdminStats }) {
  const now = new Date();
  const pending = ADMIN_GROUPS.reduce((sum, g) => sum + stats.publications[g.group].REVIEW, 0);
  const { users, contact, news } = stats;
  return (
    <section aria-labelledby="admin-cifras" className="space-y-4">
      <h2 id="admin-cifras" className="text-base font-extrabold">
        La Guía en cifras
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {ADMIN_GROUPS.map((g) => {
          const c = stats.publications[g.group];
          return (
            <LDCStatCard
              key={g.group}
              label={`${g.label} publicados`}
              value={c.PUBLISHED}
              icon={g.icon}
              hint={c.REVIEW > 0 ? `${c.REVIEW} por moderar` : "Nada por moderar"}
              hintTone={c.REVIEW > 0 ? "warning" : "muted"}
              href={c.REVIEW > 0 ? `${g.href}?estado=${ADMIN_PUBLICATION_STATUS_META.REVIEW.key}` : g.href}
            />
          );
        })}
        <LDCStatCard
          label="Noticias"
          value={news.total}
          icon={<Newspaper className="size-4" />}
          hint="Las publicas tú, sin moderación"
          href="/dashboard/admin/noticias"
        />
        <LDCStatCard
          label="Usuarios"
          value={users.total}
          icon={<Users className="size-4" />}
          hint={
            users.last7Days > 0
              ? `${users.last7Days} ${users.last7Days === 1 ? "alta" : "altas"} en 7 días`
              : "Sin altas en 7 días"
          }
          hintTone={users.last7Days > 0 ? "accent" : "muted"}
          href="/dashboard/admin/usuarios"
        />
        <LDCStatCard
          label="Mensajes sin leer"
          value={contact.unread}
          icon={<Inbox className="size-4" />}
          hint={contact.unread > 0 ? "Del formulario de contacto" : "Bandeja al día"}
          hintTone={contact.unread > 0 ? "warning" : "muted"}
          href={contact.unread > 0 ? "/dashboard/admin/mensajes?estado=no-leidos" : "/dashboard/admin/mensajes"}
        />
      </div>
      <LDCAdminActivity items={stats.recent.map((r) => activityItem(r, now))} pending={pending} />
    </section>
  );
}

/**
 * Inicio del panel, el mismo para toda cuenta (CLGDC-192): tareas pendientes; si es admin, las
 * cifras del sitio y la actividad reciente (`GET /admin/stats`); una tarjeta por cada rol dueño con
 * sus publicaciones por estado (`GET /me/summary`); el selector «¿Qué quieres publicar?» con lo que
 * aún no publica, y sus favoritos recientes.
 */
export default async function DashboardHomePage() {
  const session = await requireDashboardSession();
  const { roles } = session;
  const isAvisador = roles.includes("avisador");
  const hasListings = hasAnyRole(roles, ["comercio", "servicio"]);
  const isAdmin = roles.includes("admin");
  const ownerGroups = OWNER_GROUPS.filter((g) => roles.includes(g.role));

  const [classifieds, listingTasks, adminStats, summary, favorites] = await Promise.all([
    isAvisador ? getMyClassifieds() : [],
    hasListings ? getMyTasks() : [],
    isAdmin ? getAdminStats() : null,
    ownerGroups.length > 0 ? getMySummary() : null,
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

  const publishKinds = getPublishKinds(roles);

  return (
    <LDCDashboardPageTemplate
      title={`Hola, ${session.user.firstName}`}
      description={describe(roles)}
    >
      <LDCTaskList tasks={tasks} />

      {isAdmin &&
        (adminStats ? (
          <AdminOverview stats={adminStats} />
        ) : (
          <p className="font-open-sans text-sm text-muted-foreground">
            No pudimos cargar las cifras del sitio. Recarga la página en un momento.
          </p>
        ))}

      {ownerGroups.length > 0 && (
        <section aria-labelledby="mis-publicaciones" className="space-y-4">
          <h2 id="mis-publicaciones" className="text-base font-extrabold">
            Tus publicaciones
          </h2>
          {summary ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ownerGroups.map((g) => {
                const metrics =
                  g.role === "comercio" || g.role === "servicio"
                    ? {
                        ...summary.metrics7d[g.role],
                        href: `/dashboard/comercio/estadisticas?tipo=${g.role}`,
                      }
                    : undefined;
                return (
                  <LDCOwnerSummaryCard
                    key={g.role}
                    role={g.role}
                    title={g.title}
                    listHref={g.listHref}
                    counts={ownerCounts(g, summary.publications[g.group])}
                    createHref={g.createHref}
                    createLabel={g.createLabel}
                    emptyText={g.emptyText}
                    metrics={metrics}
                    rejection={ownerRejection(g, summary)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="font-open-sans text-sm text-muted-foreground">
              No pudimos cargar tus publicaciones. Recarga la página en un momento.
            </p>
          )}
        </section>
      )}

      <LDCPublishChooser kinds={publishKinds} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <LDCRecentFavorites favorites={favorites} />
      </div>
    </LDCDashboardPageTemplate>
  );
}
