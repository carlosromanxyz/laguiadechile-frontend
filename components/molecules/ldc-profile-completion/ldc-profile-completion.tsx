import { Circle, CircleCheck, Pencil } from "lucide-react";
import { LDCButton } from "@/components/atoms/ldc-button";
import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { Progress } from "@/components/ui/progress";
import type { IDashboardCompletionItem } from "@/interfaces/dashboard";
import { cn } from "@/lib/utils";

export interface LDCProfileCompletionProps {
  /** Porcentaje completo (0–100) */
  pct: number;
  /** Lista de lo hecho y lo que falta */
  items: IDashboardCompletionItem[];
  /** Enlace «Completar ficha» */
  actionHref: string;
  /** Marca el dato como simulado */
  simulated?: boolean;
}

/**
 * LDCProfileCompletion - Completitud de la ficha del comercio
 *
 * Barra de progreso en el color de acento (rosado en claro, amarillo en oscuro) y la lista
 * de lo que falta, en negrita, bajo lo ya hecho.
 *
 * @example
 * <LDCProfileCompletion pct={80} items={items} actionHref="/dashboard/comercio/ficha" simulated />
 */
export function LDCProfileCompletion({
  pct,
  items,
  actionHref,
  simulated,
}: LDCProfileCompletionProps) {
  return (
    <LDCDashboardCard title={`Tu ficha está al ${pct} %`} simulated={simulated}>
      <Progress
        value={pct}
        aria-label={`Ficha completa al ${pct} %`}
        className="bg-muted *:data-[slot=progress-indicator]:bg-pink dark:*:data-[slot=progress-indicator]:bg-yellow"
      />
      <ul className="mt-3 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 py-0.5">
            {item.done ? (
              <CircleCheck className="size-4 shrink-0 text-success" aria-hidden />
            ) : (
              <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className={cn(item.done ? "text-muted-foreground" : "font-bold")}>
              {item.label}
              <span className="sr-only">{item.done ? " (listo)" : " (falta)"}</span>
            </span>
          </li>
        ))}
      </ul>
      <LDCButton href={actionHref} variant="outline" size="sm" className="mt-3">
        <Pencil />
        Completar ficha
      </LDCButton>
    </LDCDashboardCard>
  );
}
