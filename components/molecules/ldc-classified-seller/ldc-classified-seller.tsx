"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, Mail, User } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { IClassifiedSeller } from "@/interfaces/classified";

interface LDCClassifiedSellerProps {
  /** Seller info */
  seller: IClassifiedSeller;
  /** Classified title, used to prefill the WhatsApp message */
  classifiedTitle: string;
  className?: string;
}

/**
 * LDCClassifiedSeller - Seller Contact Box for Classified Detail Pages
 *
 * Shows the seller name and direct contact buttons (WhatsApp, call, email).
 * Only renders the buttons that have data.
 */
export function LDCClassifiedSeller({
  seller,
  classifiedTitle,
  className,
}: LDCClassifiedSellerProps) {
  const waMessage = encodeURIComponent(
    `Hola ${seller.name}, vi tu aviso "${classifiedTitle}" en La Guía de Chile y me interesa.`
  );

  return (
    <div className={cn("bg-card rounded-xl border border-border p-5", className)}>
      <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-pink" />
        Publicado por
      </h3>

      <p className="text-base font-semibold text-foreground mb-4">{seller.name}</p>

      <div className="space-y-3">
        {seller.whatsapp && (
          <Button
            asChild
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <a
              href={`https://wa.me/${seller.whatsapp.replace(/\D/g, "")}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-5 h-5 mr-2" />
              Escribir por WhatsApp
            </a>
          </Button>
        )}

        {seller.phone && (
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full"
          >
            <a href={`tel:${seller.phone.replace(/\s/g, "")}`}>
              <Phone className="w-5 h-5 mr-2" />
              Llamar
            </a>
          </Button>
        )}

        {seller.email && (
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full"
          >
            <a href={`mailto:${seller.email}?subject=${encodeURIComponent(`Consulta por: ${classifiedTitle}`)}`}>
              <Mail className="w-5 h-5 mr-2" />
              Enviar email
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
