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
  Globe,
  ExternalLink,
  Send,
  Loader2,
  CheckCircle,
  Mail,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type {
  IListingContact,
  IListingSchedule,
} from "@/interfaces/listing";

interface LDCListingInfoProps {
  listingTitle: string;
  contact: IListingContact;
  schedule?: IListingSchedule;
  className?: string;
}

const dayLabels: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

/**
 * LDCListingInfo - Contact and Schedule Information
 *
 * Displays contact buttons (Call, WhatsApp), contact form, and schedule.
 */
export function LDCListingInfo({
  listingTitle,
  contact,
  schedule,
  className,
}: LDCListingInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const hasSchedule = schedule && Object.values(schedule).some(Boolean);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual email sending via API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Contact Buttons */}
      {(contact.phone || contact.whatsapp) && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-pink" />
            Contactar
          </h3>
          <div className="flex gap-3">
            {contact.phone && (
              <Button
                asChild
                size="lg"
                className="flex-1 bg-pink hover:bg-pink/90 text-white"
              >
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar
                </a>
              </Button>
            )}
            {contact.whatsapp && (
              <Button
                asChild
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, me contacto desde La Guía de Chile por ${listingTitle}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Escribir
                </a>
              </Button>
            )}
          </div>

          {/* Website link */}
          {contact.website && (
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hover:text-pink transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visitar sitio web
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Contact Form */}
      {contact.email && (
        <div className="bg-card rounded-xl border border-border p-5">
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
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-sm">
                  Nombre
                </Label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
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
                disabled={isSubmitting}
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
            </form>
          )}
        </div>
      )}

{/* Schedule Section */}
      {hasSchedule && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-lg font-bold font-mulish text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink" />
            Horario
          </h3>
          <div className="space-y-2">
            {Object.entries(schedule).map(([day, hours]) =>
              hours ? (
                <div key={day} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {dayLabels[day] || day}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      hours.toLowerCase() === "cerrado"
                        ? "text-destructive"
                        : "text-foreground"
                    )}
                  >
                    {hours}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
