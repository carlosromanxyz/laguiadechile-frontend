import { ChartColumn, Eye, Globe, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCStatCard } from "@/components/molecules/ldc-stat-card";
import { LDCStatusFilter } from "@/components/molecules/ldc-status-filter";
import { LDCVisitsChart } from "@/components/organisms/ldc-visits-chart";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IDashboardMetricWindow } from "@/interfaces/dashboard";
import type { IListingDetail } from "@/interfaces/listing";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getMyListingsStatus, getMyMetricsReport } from "@/services/dashboard/comercio";

export const metadata = {
  title: "Estadísticas — Panel",
};

const BASE = "/dashboard/comercio/estadisticas";
const DESCRIPTION = "Visitas y contactos de tus fichas.";
const WINDOWS = [14, 30] as const satisfies readonly IDashboardMetricWindow[];

type ListingType = IListingDetail["type"];

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

interface EstadisticasPageProps {
  searchParams: Promise<{ tipo?: string | string[]; dias?: string | string[]; ficha?: string | string[] }>;
}

/**
 * Estadísticas de «Mis comercios» y «Mis servicios» (`GET /me/metrics`): tarjetas de visitas y
 * clics de contacto, y los gráficos de barras del inicio para visitas y clics por día. El período
 * (`?dias=14|30`, 30 por defecto) y la ficha (`?ficha=<id>`, todas por defecto) viven en la URL,
 * con pills de filtro. `?tipo=comercio|servicio` (el grupo del menú) deja solo las fichas de ese
 * tipo y suma solo esas. Sin fichas, o sin visitas en el período, un estado vacío con su CTA.
 */
export default async function ComercioEstadisticasPage({ searchParams }: EstadisticasPageProps) {
  const [, params, all] = await Promise.all([
    requireDashboardRole(["comercio", "servicio"]),
    searchParams,
    getMyListingsStatus(),
  ]);
  const rawTipo = one(params.tipo);
  const type: ListingType | undefined =
    rawTipo === "comercio" || rawTipo === "servicio" ? rawTipo : undefined;
  const days: IDashboardMetricWindow = one(params.dias) === "14" ? 14 : 30;
  const listings = type ? all.filter((l) => l.item.type === type) : all;
  const selected = listings.find((l) => l.item.id === one(params.ficha));

  const href = (next: { dias?: IDashboardMetricWindow; ficha?: string | null }) => {
    const qs = new URLSearchParams();
    if (type) qs.set("tipo", type);
    const d = next.dias ?? days;
    if (d !== 30) qs.set("dias", String(d));
    const f = next.ficha === undefined ? selected?.item.id : next.ficha;
    if (f) qs.set("ficha", f);
    const q = qs.toString();
    return q ? `${BASE}?${q}` : BASE;
  };

  if (listings.length === 0) {
    return (
      <LDCDashboardPageTemplate title="Estadísticas" description={DESCRIPTION}>
        <LDCPanel>
          <LDCEmptyState
            icon={<ChartColumn className="size-10 text-muted-foreground" aria-hidden />}
            title="Aún no tienes fichas"
            description="Publica tu ficha y, cuando la aprobemos, aquí verás cuántas personas la visitan y te contactan."
            action={
              <LDCCTAButton
                href={type === "servicio" ? "/dashboard/publicar?tipo=servicio" : "/dashboard/publicar"}
                text="Publicar ficha"
                showIcon={false}
                className="mt-6"
              />
            }
          />
        </LDCPanel>
      </LDCDashboardPageTemplate>
    );
  }

  // Con todas las fichas de la cuenta, una sola llamada; si `tipo` deja un subconjunto, la suma de esas.
  const ids = selected
    ? [selected.item.id]
    : listings.length === all.length
      ? undefined
      : listings.map((l) => l.item.id);
  const report = await getMyMetricsReport(days, ids);

  const scope = selected ? "esta ficha" : listings.length === 1 ? "tu ficha" : "tus fichas";
  const fichaTarget = selected ?? listings[0];
  const anyPublished = (selected ? [selected] : listings).some((l) => l.ownership.status === "published");
  const hasData =
    report != null &&
    report.totals.views + report.totals.whatsapp + report.totals.calls + report.totals.web > 0;

  // Sin visitas ahora ni antes, el backend da 0 %: no se muestra «▲ 0 %».
  const visitsHint =
    report?.deltaViews === undefined
      ? `en ${scope}`
      : report.deltaViews === null
        ? `sin visitas en los ${days} días previos`
        : report.totals.views === 0
          ? `en los últimos ${days} días`
          : `vs. ${days} días previos`;

  return (
    <LDCDashboardPageTemplate title="Estadísticas" description={DESCRIPTION}>
      <div className="flex flex-col gap-3">
        <LDCStatusFilter
          label="Período"
          current={String(days)}
          items={WINDOWS.map((d) => ({ key: String(d), label: `Últimos ${d} días`, href: href({ dias: d }) }))}
        />
        {listings.length > 1 && (
          <LDCStatusFilter
            label="Ficha"
            current={selected?.item.id ?? "todas"}
            items={[
              { key: "todas", label: "Todas", href: href({ ficha: null }) },
              ...listings.map((l) => ({ key: l.item.id, label: l.item.title, href: href({ ficha: l.item.id }) })),
            ]}
          />
        )}
      </div>

      {report === null ? (
        <LDCPanel>
          <LDCEmptyState
            icon={<ChartColumn className="size-10 text-muted-foreground" aria-hidden />}
            title="No pudimos cargar tus estadísticas"
            description="Intenta de nuevo en un momento."
            action={
              <LDCButton href={href({})} variant="outline" className="mt-6">
                <RefreshCw />
                Reintentar
              </LDCButton>
            }
          />
        </LDCPanel>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <LDCStatCard
              label="Visitas"
              value={report.totals.views}
              icon={<Eye className="size-4" />}
              trend={
                typeof report.deltaViews === "number" && report.totals.views > 0 ? report.deltaViews : undefined
              }
              hint={visitsHint}
            />
            <LDCStatCard
              label="Clics en WhatsApp"
              value={report.totals.whatsapp}
              icon={<MessageCircle className="size-4" />}
            />
            <LDCStatCard label="Llamadas" value={report.totals.calls} icon={<Phone className="size-4" />} />
            <LDCStatCard label="Clics a tu sitio web" value={report.totals.web} icon={<Globe className="size-4" />} />
          </div>

          {hasData ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <LDCVisitsChart
                points={report.series.map((p) => ({ date: p.date, value: p.views }))}
                title={`Visitas por día · ${days} días`}
              />
              <LDCVisitsChart
                points={report.series.map((p) => ({ date: p.date, value: p.clicks }))}
                title={`Clics de contacto por día · ${days} días`}
                summaryLabel="Clics diarios en WhatsApp, teléfono y sitio web"
                valueLabel="Clics"
              />
            </div>
          ) : (
            <LDCPanel>
              {anyPublished ? (
                <LDCEmptyState
                  icon={<ChartColumn className="size-10 text-muted-foreground" aria-hidden />}
                  title={`Sin visitas en los últimos ${days} días`}
                  description="Cuando alguien vea tu ficha o toque WhatsApp, teléfono o tu sitio web, lo verás aquí. Una ficha completa, con fotos y horario, recibe más visitas."
                  action={
                    <LDCCTAButton
                      href={`/dashboard/comercio/ficha?id=${encodeURIComponent(fichaTarget.item.id)}&tipo=${fichaTarget.item.type}`}
                      text="Completar ficha"
                      showIcon={false}
                      className="mt-6"
                    />
                  }
                />
              ) : (
                <LDCEmptyState
                  icon={<ChartColumn className="size-10 text-muted-foreground" aria-hidden />}
                  title={selected ? "Esta ficha aún no está publicada" : "Aún no tienes fichas publicadas"}
                  description="Las visitas empiezan a contar cuando la ficha está publicada. Revisa su estado en «Mis fichas»."
                  action={
                    <LDCCTAButton
                      href={`/dashboard/comercio/publicaciones${type ? `?tipo=${type}` : ""}`}
                      text="Ver mis fichas"
                      showIcon={false}
                      className="mt-6"
                    />
                  }
                />
              )}
            </LDCPanel>
          )}
        </>
      )}
    </LDCDashboardPageTemplate>
  );
}
