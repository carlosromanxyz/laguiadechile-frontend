"use client";

import { Inbox, SearchX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDCAdminListToolbar } from "@/components/molecules/ldc-admin-list-toolbar";
import { LDCContactMessageActions } from "@/components/molecules/ldc-contact-message-actions";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPagination } from "@/components/molecules/ldc-pagination";
import { LDCResourceTable } from "@/components/organisms/ldc-resource-table";
import { Button } from "@/components/ui/button";
import type { IContactMessage, IContactMessageReadFilter } from "@/interfaces/contact-message";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { CONTACT_READ_ALL, CONTACT_READ_META } from "@/lib/dashboard/contact-message-status";
import { formatShortDate } from "@/lib/dashboard/dates";
import { cn } from "@/lib/utils";

export interface LDCAdminContactMessageListProps {
  /** Mensajes de la página actual */
  items: IContactMessage[];
  /** Total con los filtros actuales (incluido el de leído) */
  total: number;
  page: number;
  pageSize: number;
  /** Leídos y no leídos con la búsqueda, sin el filtro de leído */
  counts: { unread: number; read: number };
  /** Filtros de la URL: búsqueda y leído (`null`, todos) */
  q: string;
  read: IContactMessageReadFilter;
  /** Server action que marca leído o no leído */
  onSetRead: (id: string, read: boolean, revalidate?: boolean) => Promise<IDashboardActionResult>;
}

function ReadBadge({ message }: { message: IContactMessage }) {
  const meta = CONTACT_READ_META[message.readAt ? "read" : "unread"];
  return <LDCBadge variant={meta.badge}>{meta.label}</LDCBadge>;
}

/**
 * LDCAdminContactMessageList - Bandeja «Mensajes» del admin (alternativa B de CLGDC-114, CLGDC-124)
 *
 * Junta `LDCAdminListToolbar` (búsqueda y pills Todos / No leídos / Leídos con los `counts`, sin
 * filtro de ciudad), `LDCResourceTable` (desde `md`: Mensaje, Estado, De desde `xl`, Recibido y la
 * columna de acciones de ancho fijo a la derecha; bajo `md`, tarjetas `LDCDashboardListItem`) y
 * `LDCPagination`. Cada fila lleva `LDCContactMessageActions` (Ver, Marcar leído y `⋯`). Los no
 * leídos llevan la barra amarilla de fila destacada y el asunto en negrita. Nombre, correo, asunto y
 * mensaje se pintan solo como texto. Filtros y página viven en la URL; mientras la página nueva
 * llega, la tabla muestra su esqueleto.
 *
 * @example
 * <LDCAdminContactMessageList items={data.items} total={data.total} page={1} pageSize={20}
 *   counts={counts} q="" read={null} onSetRead={setContactMessageReadAction} />
 */
export function LDCAdminContactMessageList({
  items,
  total,
  page,
  pageSize,
  counts,
  q,
  read,
  onSetRead,
}: LDCAdminContactMessageListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const filterNavigate = (href: string) =>
    startTransition(() => router.replace(href, { scroll: false }));
  const pageNavigate = (href: string) => startTransition(() => router.push(href));

  const filtered = Boolean(q || read);
  const noResults = [q && `«${q}»`, read && `en «${CONTACT_READ_META[read].pill}»`]
    .filter(Boolean)
    .join(" ");

  const actions = (m: IContactMessage) => (
    <LDCContactMessageActions message={m} onSetRead={onSetRead} className="md:flex-nowrap" />
  );

  const emptyState = filtered ? (
    <LDCEmptyState
      className="py-12"
      icon={<SearchX className="size-8 text-muted-foreground" aria-hidden />}
      title={`Sin resultados ${noResults}`}
      description="Prueba con otro nombre, correo o asunto, o quita el filtro."
      action={
        <Button variant="outline" className="mt-6 h-11 md:h-9" onClick={() => filterNavigate(pathname)}>
          Limpiar filtros
        </Button>
      }
    />
  ) : (
    <LDCEmptyState
      className="py-12"
      icon={<Inbox className="size-8 text-muted-foreground" aria-hidden />}
      title="Aún no hay mensajes"
      description="Cuando alguien escriba en el formulario de contacto, su mensaje aparecerá aquí."
    />
  );

  return (
    <section aria-label="Bandeja de mensajes" className="flex flex-col gap-4">
      <LDCAdminListToolbar
        q={q}
        searchLabel="Buscar por nombre, correo o asunto"
        status={read ? CONTACT_READ_META[read].key : CONTACT_READ_ALL}
        allKey={CONTACT_READ_ALL}
        statusItems={[
          { key: CONTACT_READ_ALL, label: "Todos", count: counts.unread + counts.read },
          { key: CONTACT_READ_META.unread.key, label: CONTACT_READ_META.unread.pill, count: counts.unread },
          { key: CONTACT_READ_META.read.key, label: CONTACT_READ_META.read.pill, count: counts.read },
        ]}
        onNavigate={filterNavigate}
      />

      <p className="sr-only" aria-live="polite">
        {pending ? "Cargando mensajes" : `${total} ${total === 1 ? "mensaje" : "mensajes"}`}
      </p>

      <LDCResourceTable
        rows={items}
        getRowKey={(m) => m.id}
        loading={pending}
        loadingLabel="Cargando mensajes"
        caption="Mensajes de contacto, del más reciente al más antiguo"
        emptyState={emptyState}
        isRowHighlighted={(m) => m.readAt === null}
        columns={[
          {
            key: "subject",
            header: "Mensaje",
            cellClassName: "w-full max-w-0",
            cell: (m) => (
              <div className="min-w-0">
                <p title={m.subject} className={cn("truncate", m.readAt ? "font-medium" : "font-bold")}>
                  {m.subject}
                </p>
                <p className="truncate font-open-sans text-xs text-muted-foreground">{m.message}</p>
              </div>
            ),
          },
          {
            key: "status",
            header: "Estado",
            cell: (m) => <ReadBadge message={m} />,
          },
          {
            key: "from",
            header: "De",
            // Desde `xl`, como «Dueño» en los listados de fichas.
            headClassName: "hidden xl:table-cell",
            cellClassName: "hidden max-w-48 xl:table-cell",
            cell: (m) => (
              <div className="min-w-0">
                <p title={m.name} className="truncate">
                  {m.name}
                </p>
                <p title={m.email} className="truncate font-open-sans text-xs text-muted-foreground">
                  {m.email}
                </p>
              </div>
            ),
          },
          {
            key: "createdAt",
            header: "Recibido",
            cellClassName: "whitespace-nowrap text-muted-foreground",
            cell: (m) => <time dateTime={m.createdAt}>{formatShortDate(m.createdAt)}</time>,
          },
        ]}
        renderActions={actions}
        actionsClassName="w-[15rem]"
        renderCard={(m) => (
          <LDCDashboardListItem
            title={m.subject}
            meta={<ReadBadge message={m} />}
            subtitle={[m.name, m.email, formatShortDate(m.createdAt)].join(" · ")}
            actions={actions(m)}
          />
        )}
      />

      {!pending && items.length > 0 && (
        <LDCPagination page={page} pageSize={pageSize} total={total} onNavigate={pageNavigate} />
      )}
    </section>
  );
}
