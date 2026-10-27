import type { ReactNode } from "react";
import {
  LDCResourceRowActions,
  type LDCResourceRowActionsProps,
} from "@/components/organisms/ldc-resource-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Barra amarilla (token `--yellow`) en la primera celda de una fila destacada. */
const HIGHLIGHTED_ROW = "[&>td:first-child]:shadow-[inset_3px_0_0_var(--yellow)]";

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
  /** Encabezado de la columna de acciones */
  actionsHeader?: ReactNode;
  /** Mensaje cuando no hay filas */
  emptyMessage: ReactNode;
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
 * (`LDCResourceRowActions`, cliente).
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
  actionsHeader = "Acciones",
  emptyMessage,
  isRowHighlighted,
}: LDCResourceTableProps<T>) {
  const colSpan = columns.length + (getRowActions ? 1 : 0);

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headClassName}>
                {column.header}
              </TableHead>
            ))}
            {getRowActions && <TableHead className="w-12 text-right">{actionsHeader}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
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
                {getRowActions && (
                  <TableCell className="text-right">
                    <LDCResourceRowActions {...getRowActions(row)} />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
