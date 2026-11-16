"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  Mail,
} from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { LDCContactActions } from "@/components/molecules/ldc-contact-actions";
import { LDCScheduleList } from "@/components/molecules/ldc-schedule-list";
import { LDCFormAlert } from "@/components/molecules/ldc-form-alert";
import { sendListingMessageAction } from "@/lib/contact/actions";
import { CONTACT_LIMITS } from "@/lib/contact/limits";
import { listingMessageFormSchema } from "@/validations/contact-form-schema";
import type {
  IListingContact,
  IListingSchedule,
} from "@/interfaces/listing";

interface LDCListingInfoProps {
  /**
   * Listing id; the contact buttons send their click metrics with it, and «Enviar mensaje» sends to
   * it (CLGDC-257). Without it (the form preview, `LDCListingPreviewDialog`) the form never sends.
   */
  listingId?: string;
  listingTitle: string;
  contact: IListingContact;
  schedule?: IListingSchedule;
  className?: string;
}

/**
 * LDCListingInfo - Contact and Schedule Information
 *
 * Displays contact buttons (Call, WhatsApp), contact form, and schedule.
 * «Enviar mensaje» envía de verdad con `sendListingMessageAction` (`POST /contact/listings/:id`,
 * CLGDC-257): solo muestra «enviado» si el backend lo aceptó; si no, el error va en `LDCFormAlert`
 * y se conservan los datos. Lleva el honeypot `website` oculto, como `LDCContactForm`.
 */
export function LDCListingInfo({
  listingId,
  listingTitle,
  contact,
  schedule,
  className,
}: LDCListingInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  /** Vista previa del formulario de ficha: sin id no hay a quién enviar. */
  const isPreview = !listingId;

  const hasSchedule = schedule && Object.values(schedule).some(Boolean);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !listingId) return;
    // Mismo esquema que la server action (`validations/contact-form-schema.ts`).
    const parsed = listingMessageFormSchema.safeParse(formData);
    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message ?? "Revisa los campos del formulario.");
      return;
    }
    setIsSubmitting(true);
    setServerError(null);

    let result: Awaited<ReturnType<typeof sendListingMessageAction>>;
    try {
      result = await sendListingMessageAction(listingId, parsed.data);
    } catch {
      result = {
        ok: false,
        reason: "error",
        message: "No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.",
      };
    }

    setIsSubmitting(false);
    if (!result.ok) {
      // Se conservan los datos para corregir o reintentar.
      setServerError(result.message);
      return;
    }
    setIsSubmitted(true);

    setTimeout(() => {
      setFormData({ name: "", email: "", message: "", website: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Contact Buttons */}
      {(contact.phone || contact.whatsapp) && (
        <LDCPanel>
          <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-pink" />
            Contactar
          </h3>
          <LDCContactActions
            layout="row"
            listingId={listingId}
            phone={contact.phone}
            whatsapp={contact.whatsapp}
            whatsappMessage={`Hola, me contacto desde La Guía de Chile por ${listingTitle}`}
            website={contact.website}
          />
        </LDCPanel>
      )}

      {/* Contact Form */}
      {contact.email && (
        <LDCPanel>
          <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-pink" />
            Enviar mensaje
          </h3>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Mensaje enviado correctamente
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {serverError && <LDCFormAlert message={serverError} />}

              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-sm">
                  Nombre
                </Label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sm">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sm">
                  Mensaje
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="Escribe tu consulta..."
                  maxLength={CONTACT_LIMITS.message}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isPreview}
                className="w-full bg-purple hover:bg-purple/90 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </>
                )}
              </Button>

              {isPreview && (
                <p className="text-xs text-muted-foreground text-center">
                  En la vista previa el formulario no envía mensajes.
                </p>
              )}

              {/* Honeypot: fuera de la vista y del árbol accesible; una persona nunca lo llena. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-website">Sitio web</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </form>
          )}
        </LDCPanel>
      )}

{/* Schedule Section */}
      {hasSchedule && (
        <LDCPanel>
          <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink" />
            Horario
          </h3>
          <LDCScheduleList schedule={schedule} />
        </LDCPanel>
      )}
    </div>
  );
}
