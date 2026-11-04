"use client";

import { CalendarDays, CirclePlus } from "lucide-react";
import type { ReactNode } from "react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCSection } from "@/components/atoms/ldc-section";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCEventCard } from "@/components/molecules/ldc-event-card";
import { LDCLoadMoreGrid } from "@/components/organisms/ldc-load-more-grid";
import { useLoadMore } from "@/hooks/use-load-more";
import type { IEvents } from "@/interfaces/event";
import { isPastEvent } from "@/lib/format/events";

interface LDCPaginatedEventsGridProps {
  /** Eventos ya filtrados, en el orden en que se muestran */
  events: IEvents;
  /** Instante de referencia (ms) para marcar los terminados; lo fija la página al renderizar */
  now: number;
  /** Filtros sobre la grilla (`LDCEventFilters`) */
  filters?: ReactNode;
  itemsPerPage?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  loadMoreLabel?: string;
  className?: string;
}

/**
 * LDCPaginatedEventsGrid - Grilla de `LDCEventCard` con «Cargar más» (CLGDC-139)
 *
 * Como `LDCPaginatedPropertiesGrid`: los filtros arriba, el conteo, la grilla (1, 2, 3 y 4
 * columnas) y el botón de cargar más; sin resultados, `LDCEmptyState`. Los eventos terminados
 * (filtro «Ya pasaron») se muestran atenuados y con «Terminado».
 *
 * @example
 * <LDCPaginatedEventsGrid events={events} now={now} filters={<LDCEventFilters … />} />
 */
export function LDCPaginatedEventsGrid({
  events,
  now,
  filters,
  itemsPerPage = 20,
  emptyTitle = "No encontramos eventos",
  emptyDescription = "Prueba con otra fecha, ciudad o categoría.",
  loadMoreLabel = "Cargar más eventos",
  className,
}: LDCPaginatedEventsGridProps) {
  const { visibleItems, visibleCount, hasMore, remainingCount, isLoading, loadMore } = useLoadMore(events, {
    pageSize: itemsPerPage,
  });

  return (
    <LDCSection paddingY="lg" className={className}>
      {filters && <div className="mb-6">{filters}</div>}

      {events.length === 0 ? (
        <LDCEmptyState
          icon={<CalendarDays className="size-12 text-muted-foreground" aria-hidden />}
          title={emptyTitle}
          description={emptyDescription}
          action={
            <LDCButton href="/dashboard/eventos/nuevo" variant="outline" className="mt-6">
              <CirclePlus aria-hidden />
              Publica un evento
            </LDCButton>
          }
        />
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
            Mostrando {visibleItems.length} de {events.length} {events.length === 1 ? "evento" : "eventos"}
          </p>
          <LDCLoadMoreGrid
            gridClassName="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            visibleCount={visibleCount}
            pageSize={itemsPerPage}
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={loadMore}
            loadMoreLabel={`${loadMoreLabel} (${remainingCount} restantes)`}
          >
            {visibleItems.map((event) => (
              <LDCEventCard
                key={event.id}
                id={event.id}
                title={event.title}
                slug={event.slug}
                startsAt={event.startsAt}
                endsAt={event.endsAt}
                venueName={event.venueName}
                city={event.city}
                category={event.category}
                image={event.image}
                priceType={event.priceType}
                priceAmount={event.priceAmount}
                featured={event.featured}
                past={isPastEvent(event, now)}
              />
            ))}
          </LDCLoadMoreGrid>
        </>
      )}
    </LDCSection>
  );
}
