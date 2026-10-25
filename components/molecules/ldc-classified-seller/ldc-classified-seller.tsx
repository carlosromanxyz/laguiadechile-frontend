"use client";

import { User } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCContactActions } from "@/components/molecules/ldc-contact-actions";
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
  return (
    <LDCPanel className={className}>
      <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-pink" />
        Publicado por
      </h3>

      <p className="text-base font-semibold text-foreground mb-4">{seller.name}</p>

      <LDCContactActions
        whatsapp={seller.whatsapp}
        whatsappMessage={`Hola ${seller.name}, vi tu aviso "${classifiedTitle}" en La Guía de Chile y me interesa.`}
        phone={seller.phone}
        email={seller.email}
        emailSubject={`Consulta por: ${classifiedTitle}`}
      />
    </LDCPanel>
  );
}
