"use client";

import { SearchX, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDC_ROLE_ICONS } from "@/components/atoms/ldc-role-icon";
import { LDCAdminListToolbar } from "@/components/molecules/ldc-admin-list-toolbar";
import { LDCDashboardListItem } from "@/components/molecules/ldc-dashboard-list-item";
import { LDCEmptyState } from "@/components/molecules/ldc-empty-state";
import { LDCPagination } from "@/components/molecules/ldc-pagination";
import { LDCUserRolesDialog } from "@/components/molecules/ldc-user-roles-dialog";
import { LDCResourceTable } from "@/components/organisms/ldc-resource-table";
import { Button } from "@/components/ui/button";
import type { IAdminUserRow } from "@/interfaces/admin-user";
import type { IDashboardActionResult } from "@/interfaces/dashboard";
import { LDC_ROLE_META, type LDCRole } from "@/lib/auth/roles";
import { formatShortDate } from "@/lib/dashboard/dates";
import { formatPersonName } from "@/lib/people";

export interface LDCAdminUserListProps {
  /** Filas de la página actual */
  items: IAdminUserRow[];
  /** Total con la búsqueda actual */
  total: number;
  page: number;
  pageSize: number;
  /** Búsqueda de la URL (`?q=`) */
  q: string;
  /** Id de la cuenta en sesión: su fila no deja quitar «Administrador» */
  currentUserId: string | null;
  /** Server action que guarda los roles de una cuenta */
  onSetRoles: (id: string, roles: LDCRole[]) => Promise<IDashboardActionResult>;
}

function RoleBadges({ roles }: { roles: readonly LDCRole[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Roles">
      {roles.map((role) => {
        const meta = LDC_ROLE_META[role];
        const Icon = LDC_ROLE_ICONS[meta.iconName];
        return (
          <li key={role}>
            <LDCBadge variant={`role-${role}`} className="gap-1 whitespace-nowrap">
              <Icon className="size-3.5" aria-hidden />
              {meta.label}
            </LDCBadge>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * LDCAdminUserList - Listado de cuentas del panel admin (CLGDC-127)
 *
 * Las piezas del patrón de listado admin (alternativa B de CLGDC-114) con las columnas de una
 * cuenta: `LDCAdminListToolbar` solo con la búsqueda (nombre o correo, `?q=`), `LDCResourceTable`
 * (desde `md`: Nombre, Correo desde `lg`, Roles con `LDCBadge role-*`, Creada y la acción a la
 * derecha; bajo `md`, tarjetas `LDCDashboardListItem`) y `LDCPagination`. La acción de cada fila
 * es `LDCUserRolesDialog`; la cuenta propia lleva «(tú)» y no puede quitarse «Administrador».
 *
 * @example
 * <LDCAdminUserList items={page.items} total={page.total} page={1} pageSize={20} q=""
 *   currentUserId={me.id} onSetRoles={setAdminUserRolesAction} />
 */
export function LDCAdminUserList({
  items,
  total,
  page,
  pageSize,
  q,
  currentUserId,
  onSetRoles,
}: LDCAdminUserListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const filterNavigate = (href: string) =>
    startTransition(() => router.replace(href, { scroll: false }));
  const pageNavigate = (href: string) => startTransition(() => router.push(href));

  const isSelf = (row: IAdminUserRow) => row.id === currentUserId;

  const actions = (row: IAdminUserRow) => (
    <LDCUserRolesDialog
      name={formatPersonName(row)}
      email={row.email}
      roles={row.roles}
      isSelf={isSelf(row)}
      onSave={(roles) => onSetRoles(row.id, roles)}
      buttonClassName="h-11 md:h-8"
    />
  );

  const nameCell = (row: IAdminUserRow) => (
    <>
      {formatPersonName(row)}
      {isSelf(row) && <span className="ml-1.5 font-normal text-muted-foreground">(tú)</span>}
    </>
  );

  const emptyState = q ? (
    <LDCEmptyState
      className="py-12"
      icon={<SearchX className="size-8 text-muted-foreground" aria-hidden />}
      title={`Sin resultados «${q}»`}
      description="Prueba con otro nombre, apellido o correo."
      action={
        <Button variant="outline" className="mt-6 h-11 md:h-9" onClick={() => filterNavigate(pathname)}>
          Limpiar búsqueda
        </Button>
      }
    />
  ) : (
    <LDCEmptyState
      className="py-12"
      icon={<Users className="size-8 text-muted-foreground" aria-hidden />}
      title="Aún no hay usuarios"
      description="Cuando alguien cree su cuenta, aparecerá aquí con sus roles."
    />
  );

  return (
    <section aria-label="Listado de usuarios" className="flex flex-col gap-4">
      <LDCAdminListToolbar q={q} searchLabel="Buscar por nombre, apellido o correo" onNavigate={filterNavigate} />

      <p className="sr-only" aria-live="polite">
        {pending ? "Cargando usuarios" : `${total} ${total === 1 ? "usuario" : "usuarios"}`}
      </p>

      <LDCResourceTable
        rows={items}
        getRowKey={(row) => row.id}
        loading={pending}
        loadingLabel="Cargando usuarios"
        caption="Listado de usuarios, del más reciente al más antiguo"
        emptyState={emptyState}
        columns={[
          {
            key: "name",
            header: "Nombre",
            cellClassName: "w-full max-w-0",
            cell: (row) => (
              <div className="min-w-0">
                <p title={formatPersonName(row)} className="truncate font-bold">
                  {nameCell(row)}
                </p>
                <p className="truncate font-open-sans text-xs text-muted-foreground lg:hidden">
                  {row.email}
                </p>
              </div>
            ),
          },
          {
            key: "email",
            header: "Correo",
            headClassName: "hidden lg:table-cell",
            cellClassName: "hidden max-w-56 truncate font-open-sans lg:table-cell",
            cell: (row) => <span title={row.email}>{row.email}</span>,
          },
          {
            key: "roles",
            header: "Roles",
            cellClassName: "min-w-40",
            cell: (row) => <RoleBadges roles={row.roles} />,
          },
          {
            key: "createdAt",
            header: "Creada",
            cellClassName: "whitespace-nowrap text-muted-foreground",
            cell: (row) => <time dateTime={row.createdAt}>{formatShortDate(row.createdAt)}</time>,
          },
        ]}
        renderActions={(row) => <div className="flex justify-end">{actions(row)}</div>}
        actionsClassName="w-[9rem]"
        renderCard={(row) => (
          <LDCDashboardListItem
            title={nameCell(row)}
            meta={<RoleBadges roles={row.roles} />}
            subtitle={`${row.email} · ${formatShortDate(row.createdAt)}`}
            actions={actions(row)}
          />
        )}
      />

      {!pending && items.length > 0 && (
        <LDCPagination page={page} pageSize={pageSize} total={total} onNavigate={pageNavigate} />
      )}
    </section>
  );
}
