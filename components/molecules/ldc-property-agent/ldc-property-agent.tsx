"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Building2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
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
  const waMessage = encodeURIComponent(
    `Hola ${agent.name}, vi la propiedad "${propertyTitle}" en La Guía de Chile y me interesa.`
  );

  return (
    <div className={cn("bg-card rounded-xl border border-border p-5", className)}>
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

      <div className={cn("space-y-3", !agent.agency && "mt-4")}>
        {agent.whatsapp && (
          <Button
            asChild
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <a
              href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-5 h-5 mr-2" />
              Escribir por WhatsApp
            </a>
          </Button>
        )}

        {agent.phone && (
          <Button asChild size="lg" variant="outline" className="w-full">
            <a href={`tel:${agent.phone.replace(/\s/g, "")}`}>
              <Phone className="w-5 h-5 mr-2" />
              Llamar
            </a>
          </Button>
        )}

        {agent.email && (
          <Button asChild size="lg" variant="outline" className="w-full">
            <a href={`mailto:${agent.email}?subject=${encodeURIComponent(`Consulta por: ${propertyTitle}`)}`}>
              <Mail className="w-5 h-5 mr-2" />
              Enviar email
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
