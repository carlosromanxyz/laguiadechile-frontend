import { ExternalLink, Folder, Home, MapPin, Newspaper, Store, Tags, TriangleAlert } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import { LDCModerationQueue } from "@/components/organisms/ldc-moderation-queue";
import { LDCTaskList } from "@/components/organisms/ldc-task-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardTask } from "@/interfaces/dashboard";
import { formatShortDate } from "@/lib/dashboard/dates";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getAdminOverview, getModerationQueue } from "@/services/dashboard/admin";

export const metadata = {
  title: "Inicio — Panel",
};

export default async function AdminHomePage() {
  const [session, { counts, latestNews }, queue] = await Promise.all([
    requireDashboardRole("admin"),
    getAdminOverview(),
    getModerationQueue(),
  ]);

  const tasks: IDashboardTask[] =
    counts.classifiedsExpired > 0
      ? [
          {
            id: "avisos-vencidos",
            tone: "warning",
            title:
              counts.classifiedsExpired === counts.classifieds
                ? `Los ${counts.classifiedsExpired} avisos clasificados están vencidos`
                : `${counts.classifiedsExpired} avisos clasificados están vencidos`,
            description:
              counts.classifiedsExpired === counts.classifieds
                ? "Ninguno se muestra en el sitio público. Revisa si conviene renovarlos o archivarlos."
                : "No se muestran en el sitio público. Revisa si conviene renovarlos o archivarlos.",
            action: { label: "Revisar", href: "/dashboard/admin/avisos" },
          },
        ]
      : [];

  return (
    <LDCDashboardPageTemplate
      title={`Hola, ${session.user.greetingName}`}
      description="Vista general del contenido publicado y lo que espera revisión."
      actions={
        <LDCButton href="/" variant="outline">
          <ExternalLink />
          Ver el sitio
        </LDCButton>
      }
    >
      <LDCTaskList tasks={tasks} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <LDCStatCard
          label="Comercios y servicios"
          value={counts.listings}
          icon={<Store className="size-4" />}
          hint={`${counts.listingsFeatured} destacados`}
        />
        <LDCStatCard
          label="Avisos clasificados"
          value={counts.classifieds}
          icon={<Tags className="size-4" />}
          hint={
            counts.classifiedsExpired > 0 ? (
              <>
                <TriangleAlert className="size-3" aria-hidden />
                {counts.classifiedsExpired} vencidos
              </>
            ) : undefined
          }
          hintTone="warning"
        />
        <LDCStatCard label="Propiedades" value={counts.properties} icon={<Home className="size-4" />} />
        <LDCStatCard label="Noticias" value={counts.news} icon={<Newspaper className="size-4" />} />
        <LDCStatCard label="Categorías" value={counts.categories} icon={<Folder className="size-4" />} />
        <LDCStatCard
          label="Ciudades"
          value={counts.cities}
          icon={<MapPin className="size-4" />}
          hint={`${counts.regions} regiones`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <LDCModerationQueue items={queue} moderationHref="/dashboard/admin/moderacion" simulated />
        <LDCDashboardCard
          title="Últimas noticias"
          action={
            <LDCButton href="/dashboard/admin/noticias" variant="ghost" size="sm">
              Todas
            </LDCButton>
          }
        >
          <ul>
            {latestNews.map((n) => (
              <LDCDashboardListItem
                key={n.id}
                image={n.image}
                title={n.title}
                subtitle={`${formatShortDate(n.publishedAt)} · ${n.authorName}`}
                clampTitle
              />
            ))}
          </ul>
        </LDCDashboardCard>
      </div>
    </LDCDashboardPageTemplate>
  );
}
