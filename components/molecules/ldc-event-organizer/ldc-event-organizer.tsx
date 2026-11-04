import { Globe, Users } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCContactActions } from "@/components/molecules/ldc-contact-actions";
import type { IEventOrganizer } from "@/interfaces/event";

interface LDCEventOrganizerProps {
  organizer: IEventOrganizer;
  /** Nombre del evento, para el mensaje de WhatsApp y el asunto del email */
  eventTitle: string;
  className?: string;
}

/**
 * LDCEventOrganizer - Quién organiza el evento, en el sidebar del detalle (CLGDC-139)
 *
 * Como `LDCClassifiedSeller`: el nombre y los botones de contacto que tengan datos (WhatsApp,
 * llamar, email) y, si hay, el enlace al sitio web del organizador.
 */
export function LDCEventOrganizer({ organizer, eventTitle, className }: LDCEventOrganizerProps) {
  return (
    <LDCPanel className={className}>
      <h2 className="mb-4 flex items-center gap-2 font-mulish text-lg font-bold text-foreground">
        <Users className="size-5 text-pink dark:text-yellow" aria-hidden />
        Organiza
      </h2>
      <p className="mb-4 text-base font-semibold text-foreground [overflow-wrap:anywhere]">{organizer.name}</p>
      <LDCContactActions
        whatsapp={organizer.whatsapp}
        whatsappMessage={`Hola ${organizer.name}, vi el evento "${eventTitle}" en La Guía de Chile y quiero saber más.`}
        phone={organizer.phone}
        email={organizer.email}
        emailSubject={`Consulta por: ${eventTitle}`}
      />
      {organizer.website && (
        <a
          href={organizer.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-2 hover:underline"
        >
          <Globe className="size-4 text-pink dark:text-yellow" aria-hidden />
          Visitar sitio web
        </a>
      )}
    </LDCPanel>
  );
}
