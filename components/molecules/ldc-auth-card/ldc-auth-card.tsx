import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export interface LDCAuthCardProps {
  /** Título de la tarjeta */
  title: ReactNode;
  /** Subtítulo bajo el título */
  description?: ReactNode;
  /** Monograma del cuadro de marca */
  mark?: ReactNode;
  /** Contenido (el formulario) */
  children: ReactNode;
}

/**
 * LDCAuthCard - Tarjeta de autenticación del panel
 *
 * Marca, título (h1, con las clases de CardTitle), descripción y el formulario como hijo.
 *
 * @example
 * <LDCAuthCard title="La Guía de Chile" description="Panel de administración">
 *   <LDCLoginForm />
 * </LDCAuthCard>
 */
export function LDCAuthCard({ title, description, mark = "LG", children }: LDCAuthCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-lg font-semibold">{mark}</span>
        </div>
        <h1 data-slot="card-title" className="font-semibold text-xl">
          {title}
        </h1>
        {description != null && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
