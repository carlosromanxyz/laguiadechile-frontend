import { Clock, Globe, MapPin, MessageCircle, Pencil, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import type { IDashboardContactSummary } from "@/interfaces/dashboard";

export interface LDCContactSummaryProps {
  contact: IDashboardContactSummary;
  /** Enlace «Editar» */
  editHref: string;
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex min-w-0 items-center gap-2 py-1">
      {icon}
      <span className="sr-only">{label}: </span>
      <span className="min-w-0 truncate">{children}</span>
    </li>
  );
}

/**
 * LDCContactSummary - Horario de hoy y contactos de la ficha
 *
 * @example
 * <LDCContactSummary contact={await getMyContactSummary()} editHref="/dashboard/comercio/horario-y-contacto" />
 */
export function LDCContactSummary({ contact, editHref }: LDCContactSummaryProps) {
  const muted = "size-4 shrink-0 text-muted-foreground";
  return (
    <LDCDashboardCard
      title="Horario y contacto"
      action={
        <LDCButton href={editHref} variant="ghost" size="sm">
          <Pencil />
          Editar
        </LDCButton>
      }
    >
      <ul className="font-open-sans text-sm">
        <li className="flex min-w-0 items-center gap-2 py-1">
          <Clock className="size-4 shrink-0 text-pink dark:text-yellow" aria-hidden />
          <span className="min-w-0 truncate">
            <b className="font-mulish">{contact.todayLabel}:</b> {contact.todayHours}
          </span>
        </li>
        {contact.phone && (
          <Row icon={<Phone className={muted} aria-hidden />} label="Teléfono">
            {contact.phone}
          </Row>
        )}
        {contact.whatsapp && (
          <Row icon={<MessageCircle className={muted} aria-hidden />} label="WhatsApp">
            {contact.whatsapp}
          </Row>
        )}
        {contact.website && (
          <Row icon={<Globe className={muted} aria-hidden />} label="Sitio web">
            {contact.website.replace(/^https?:\/\//, "")}
          </Row>
        )}
        {contact.address && (
          <Row icon={<MapPin className={muted} aria-hidden />} label="Dirección">
            {contact.address}
          </Row>
        )}
      </ul>
    </LDCDashboardCard>
  );
}
