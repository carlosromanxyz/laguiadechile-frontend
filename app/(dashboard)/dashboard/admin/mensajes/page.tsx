import { LDCAdminContactMessageList } from "@/components/organisms/ldc-admin-contact-message-list";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import type { IContactMessageSearchParams } from "@/lib/dashboard/contact-message-status";
import {
  CONTACT_MESSAGES_PAGE_SIZE,
  loadContactMessagesPage,
} from "@/services/admin/contact-messages";
import { setContactMessageReadAction } from "./actions";

export const metadata = {
  title: "Mensajes — Panel",
};

const BASE = "/dashboard/admin/mensajes";

interface AdminMensajesPageProps {
  searchParams: Promise<IContactMessageSearchParams>;
}

/**
 * «Mensajes» del admin (CLGDC-124, alternativa B de CLGDC-114): la bandeja del formulario de
 * contacto, con búsqueda, filtro leídos / no leídos y paginación en la URL; cada mensaje se abre en
 * un diálogo y se marca leído o no leído.
 */
export default async function AdminMensajesPage({ searchParams }: AdminMensajesPageProps) {
  const { data, counts, filters } = await loadContactMessagesPage(await searchParams, BASE);

  return (
    <LDCDashboardPageTemplate title="Mensajes" description="Lo que escriben en el formulario de contacto.">
      <LDCAdminContactMessageList
        items={data.items}
        total={data.total}
        page={filters.page}
        pageSize={CONTACT_MESSAGES_PAGE_SIZE}
        counts={counts}
        q={filters.q}
        read={filters.read}
        onSetRead={setContactMessageReadAction}
      />
    </LDCDashboardPageTemplate>
  );
}
