"use client";

import { useState } from "react";
import { LDCFormAlert } from "@/components/molecules/ldc-form-alert";
import { sendContactMessageAction } from "@/lib/contact/actions";
import { CONTACT_LIMITS } from "@/lib/contact/limits";
import { contactFormSchema } from "@/validations/contact-form-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle } from "lucide-react";

interface LDCContactFormProps {
  /** Optional className for custom styling */
  className?: string;
}

/**
 * LDCContactForm - Contact Form Component
 *
 * A styled contact form with name, email, subject, and message fields.
 * Envía de verdad con `sendContactMessageAction` (`POST /contact`, CLGDC-124): estados enviando,
 * éxito y error (incluido el throttle 429), con el error en `LDCFormAlert`. Lleva el honeypot
 * `website` oculto (fuera de la vista, `aria-hidden`, `tabIndex=-1` y `autocomplete=off`).
 */
export function LDCContactForm({ className }: LDCContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Mismo esquema que la server action (`validations/contact-form-schema.ts`).
    const parsed = contactFormSchema.safeParse(formData);
    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message ?? "Revisa los campos del formulario.");
      return;
    }
    setIsSubmitting(true);
    setServerError(null);

    let result: Awaited<ReturnType<typeof sendContactMessageAction>>;
    try {
      result = await sendContactMessageAction(parsed.data);
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

    // Reset form after showing success
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "bg-card rounded-lg border border-border p-8",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold font-mulish text-foreground mb-2">
            Mensaje enviado
          </h3>
          <p className="text-muted-foreground">
            Gracias por contactarnos. Te responderemos pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-card rounded-lg border border-border p-6 md:p-8",
        className
      )}
    >
      <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
        Envíanos un mensaje
      </h2>

      <div className="space-y-5">
        {serverError && <LDCFormAlert message={serverError} />}

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <Label htmlFor="subject">Asunto</Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder="¿En qué podemos ayudarte?"
            maxLength={CONTACT_LIMITS.subject}
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            maxLength={CONTACT_LIMITS.message}
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            rows={5}
            className="resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink hover:bg-pink/90 dark:bg-purple dark:hover:bg-purple/90"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar mensaje
            </>
          )}
        </Button>
      </div>

      {/* Honeypot: fuera de la vista y del árbol accesible; una persona nunca lo llena. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Sitio web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
