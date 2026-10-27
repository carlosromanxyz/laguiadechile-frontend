import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCContactActions } from "@/components/molecules/ldc-contact-actions";
import type { IPropertyAgent } from "@/interfaces/property";

interface LDCPropertyAgentProps {
  /** Agent / publisher info */
  agent: IPropertyAgent;
  /** Property title, used to prefill the WhatsApp message */
  propertyTitle: string;
  className?: string;
}

/**
 * LDCPropertyAgent - Publisher Contact Box for Property Detail Pages
 *
 * Shows the publisher/agent (and agency if present) with direct contact
 * buttons (WhatsApp, call, email). Only renders buttons that have data.
 */
export function LDCPropertyAgent({
  agent,
  propertyTitle,
  className,
}: LDCPropertyAgentProps) {
  return (
    <LDCPanel className={className}>
      <h3 className="text-lg font-bold font-mulish text-foreground mb-1">
        Contactar al publicante
      </h3>
      <p className="text-base font-semibold text-foreground">{agent.name}</p>
      {agent.agency && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 mb-4">
          <Building2 className="w-4 h-4" />
          {agent.agency}
        </p>
      )}

      <LDCContactActions
        whatsapp={agent.whatsapp}
        whatsappMessage={`Hola ${agent.name}, vi la propiedad "${propertyTitle}" en La Guía de Chile y me interesa.`}
        phone={agent.phone}
        email={agent.email}
        emailSubject={`Consulta por: ${propertyTitle}`}
        className={cn(!agent.agency && "mt-4")}
      />
    </LDCPanel>
  );
}
