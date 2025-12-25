"use client";

import { useState } from "react";
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
 * Includes client-side validation and submission state handling.
 */
export function LDCContactForm({ className }: LDCContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "bg-card dark:bg-neutral-800 rounded-lg border border-border p-8",
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
        "bg-card dark:bg-neutral-800 rounded-lg border border-border p-6 md:p-8",
        className
      )}
    >
      <h2 className="text-2xl font-bold font-mulish text-foreground mb-6">
        Envíanos un mensaje
      </h2>

      <div className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre"
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
    </form>
  );
}
