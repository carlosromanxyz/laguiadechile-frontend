import { LDCAdminUserList } from "@/components/organisms/ldc-admin-user-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_PAGE_SIZE } from "@/services/admin/listings";
import { loadAdminUsersPage, type IAdminUsersSearchParams } from "@/services/admin/users";
import { setAdminUserRolesAction } from "./actions";

export const metadata = {
  title: "Usuarios — Panel",
};

const BASE = "/dashboard/admin/usuarios";

interface AdminUsuariosPageProps {
  searchParams: Promise<IAdminUsersSearchParams>;
}

/**
 * «Usuarios» del admin (CLGDC-127): todas las cuentas, de la más reciente a la más antigua, con
 * búsqueda por nombre o correo y paginación en la URL, y la edición de roles. La cuenta en sesión
 * no puede quitarse «Administrador» (la UI lo bloquea y la API responde 400).
 */
export default async function AdminUsuariosPage({ searchParams }: AdminUsuariosPageProps) {
  const [{ data, q, page }, me] = await Promise.all([
    loadAdminUsersPage(await searchParams, BASE),
    getCurrentUser(),
  ]);

  return (
    <LDCDashboardPageTemplate title="Usuarios" description="Cuentas de comercios y usuarios, y su rol.">
      <LDCAdminUserList
        items={data.items}
        total={data.total}
        page={page}
        pageSize={ADMIN_PAGE_SIZE}
        q={q}
        currentUserId={me?.id ?? null}
        onSetRoles={setAdminUserRolesAction}
      />
    </LDCDashboardPageTemplate>
  );
}
