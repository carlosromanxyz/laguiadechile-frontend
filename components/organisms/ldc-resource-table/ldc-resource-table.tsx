import { Fragment, type ReactNode } from "react";
import {
  LDCResourceRowActions,
  type LDCResourceRowActionsProps,
} from "@/components/organisms/ldc-resource-row-actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Barra amarilla (token `--yellow`) en la primera celda de una fila destacada. */
const HIGHLIGHTED_ROW = "[&>td:first-child]:shadow-[inset_3px_0_0_var(--yellow)]";

/** Esqueleto: el pulso se apaga con `prefers-reduced-motion: reduce`. */
const SKELETON = "motion-reduce:animate-none";
const SKELETON_ROWS = 6;
const SKELETON_CARDS = 4;

export interface LDCResourceTableColumn<T> {
  /** Clave única de la columna */
  key: string;
  /** Texto del encabezado */
  header: ReactNode;
  /** Clases del `<th>` */
  headClassName?: string;
  /** Clases del `<td>` */
  cellClassName?: string;
  /** Contenido de la celda para una fila */
  cell: (row: T) => ReactNode;
}

export interface LDCResourceTableProps<T> {
  columns: LDCResourceTableColumn<T>[];
  rows: T[];
  /** Key de React de cada fila */
  getRowKey: (row: T) => string;
  /**
   * Props de `LDCResourceRowActions` para cada fila (editHref, onDelete como server action
   * ligada, deleteLabel). Si se omite, la tabla no tiene columna de acciones.
   */
  getRowActions?: (row: T) => LDCResourceRowActionsProps;
  /**
   * Acciones propias de cada fila (en vez del menú de `LDCResourceRowActions`); con `renderCard`,
   * la tarjeta las arma por su cuenta.
   */
  renderActions?: (row: T) => ReactNode;
  /** Encabezado de la columna de acciones */
  actionsHeader?: ReactNode;
  /** Clases del `<th>` y los `<td>` de acciones (por defecto `w-12`; p. ej. un ancho fijo `w-[14.5rem]`) */
  actionsClassName?: string;
  /** Mensaje cuando no hay filas (dentro de la tabla) */
  emptyMessage?: ReactNode;
  /** Estado vacío completo (p. ej. `LDCEmptyState`); si se pasa, reemplaza a la tabla cuando no hay filas */
  emptyState?: ReactNode;
  /**
   * Tarjeta de cada fila bajo `md` (un `<li>`, p. ej. `LDCDashboardListItem`): la tabla queda solo
   * desde `md` y en móvil se ve la lista de tarjetas.
   */
  renderCard?: (row: T) => ReactNode;
  /** Muestra el esqueleto (filas y, con `renderCard`, tarjetas) en vez de los datos */
  loading?: boolean;
  /** Nombre accesible de la región mientras carga */
  loadingLabel?: string;
  /** Leyenda de la tabla para lectores de pantalla (`<caption className="sr-only">`) */
  caption?: ReactNode;
  /**
   * Fila destacada: barra amarilla de 3 px a la izquierda (en filas no se usa el `ring-2` de
   * las cards, que choca con los bordes de la tabla).
   */
  isRowHighlighted?: (row: T) => boolean;
}

/**
 * LDCResourceTable - Tabla de recursos del panel
 *
 * Server Component: columnas declarativas y un menú de acciones por fila
 * (`LDCResourceRowActions`, cliente) o acciones propias (`renderActions`, con `actionsClassName` para
 * su ancho). Opcional: tarjetas bajo `md` (`renderCard`), esqueleto (`loading`, sin pulso con
 * movimiento reducido) y un estado vacío completo (`emptyState`). Sin esas props, se ve como siempre
 * (Categorías).
 *
 * @example
 * <LDCResourceTable
 *   columns={[{ key: "name", header: "Nombre", cell: (c) => c.name }]}
 *   rows={categories}
 *   getRowKey={(c) => c.id}
 *   getRowActions={(c) => ({ editHref: `/dashboard/admin/categorias/${c.id}/editar` })}
 *   emptyMessage="Sin categorías todavía."
 * />
 */
export function LDCResourceTable<T>({
  columns,
  rows,
  getRowKey,
  getRowActions,
  renderActions,
  actionsHeader = "Acciones",
  actionsClassName = "w-12",
  emptyMessage,
  emptyState,
  renderCard,
  loading = false,
  loadingLabel = "Cargando",
  caption,
  isRowHighlighted,
}: LDCResourceTableProps<T>) {
  const hasActions = Boolean(getRowActions || renderActions);
  const colSpan = columns.length + (hasActions ? 1 : 0);

  if (!loading && rows.length === 0 && emptyState != null) {
    return <div className="rounded-lg border bg-card">{emptyState}</div>;
  }

  const table = (
    <div className={cn("rounded-lg border bg-card", renderCard && "hidden md:block")}>
      <Table>
        {caption != null && <TableCaption className="sr-only">{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headClassName}>
                {column.header}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className={cn("text-right", actionsClassName)}>{actionsHeader}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }, (_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.cellClassName}>
                    <Skeleton className={cn("h-4 w-3/4", SKELETON)} />
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className={actionsClassName}>
                    <Skeleton className={cn("ml-auto h-8 w-24", SKELETON)} />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={getRowKey(row)}
                className={isRowHighlighted?.(row) ? HIGHLIGHTED_ROW : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.cellClassName}>
                    {column.cell(row)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className={cn("text-right", renderActions && actionsClassName)}>
                    {renderActions ? (
                      renderActions(row)
                    ) : getRowActions ? (
                      <LDCResourceRowActions {...getRowActions(row)} />
                    ) : null}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (!renderCard) {
    return loading ? (
      <div aria-busy="true" aria-label={loadingLabel}>
        {table}
      </div>
    ) : (
      table
    );
  }

  return (
    <div aria-busy={loading || undefined} aria-label={loading ? loadingLabel : undefined}>
      {table}
      <ul className="rounded-lg border bg-card p-4 md:hidden">
        {loading
          ? Array.from({ length: SKELETON_CARDS }, (_, i) => (
              <li
                key={i}
                className="flex items-start gap-3 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
              >
                <Skeleton className={cn("size-12 shrink-0", SKELETON)} />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className={cn("h-5 w-24", SKELETON)} />
                  <Skeleton className={cn("h-4 w-3/4", SKELETON)} />
                  <Skeleton className={cn("h-3 w-1/2", SKELETON)} />
                  <Skeleton className={cn("ml-auto h-11 w-40", SKELETON)} />
                </div>
              </li>
            ))
          : rows.length === 0
            ? (
                <li className="py-6 text-center text-muted-foreground">{emptyMessage}</li>
              )
            : rows.map((row) => <Fragment key={getRowKey(row)}>{renderCard(row)}</Fragment>)}
      </ul>
    </div>
  );
}
