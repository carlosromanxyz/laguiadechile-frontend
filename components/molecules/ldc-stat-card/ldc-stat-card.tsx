import Link from "next/link";
import type { ReactNode } from "react";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const numberFormat = new Intl.NumberFormat("es-CL");

const hintTones = {
  muted: "text-muted-foreground",
  warning: "text-orange-red",
  accent: "font-bold text-pink dark:text-yellow",
} as const;

export interface LDCStatCardProps {
  /** Nombre de la métrica */
  label: string;
  /** Valor: los números se formatean en es-CL (1.284); los textos se muestran tal cual */
  value: number | string;
  /** Ícono ya renderizado (p. ej. `<Store className="size-4" />`) */
  icon: ReactNode;
  /** Nota bajo el valor (p. ej. «22 destacados» o «vs. 30 días previos») */
  hint?: ReactNode;
  /** Color de la nota: `muted` (por defecto), `warning` (naranjo-rojo) o `accent` (marca) */
  hintTone?: keyof typeof hintTones;
  /** Variación en % contra el período anterior: ▲ positiva, ▼ negativa */
  trend?: number;
  /** Si hay, toda la tarjeta es un enlace */
  href?: string;
  /** Marca el dato como simulado (badge «Simulado») */
  simulated?: boolean;
}

/**
 * LDCStatCard - Tarjeta de métrica del panel
 *
 * Server Component: el ícono llega como ReactNode ya renderizado. En móvil va en grilla de
 * 2 columnas (`grid-cols-2`), por eso el relleno y el valor se achican bajo `sm`.
 *
 * @example
 * <LDCStatCard label="Noticias" value={12} icon={<Newspaper className="size-4" />} />
 * <LDCStatCard label="Visitas a tu ficha" value={1284} icon={<Eye className="size-4" />}
 *   trend={12} hint="vs. 30 días previos" simulated />
 */
export function LDCStatCard({
  label,
  value,
  icon,
  hint,
  hintTone = "muted",
  trend,
  href,
  simulated,
}: LDCStatCardProps) {
  const formatted = typeof value === "number" ? numberFormat.format(value) : value;
  const hasFooter = hint != null || trend != null || simulated;

  const card = (
    <Card
      className={cn(
        "h-full gap-2 py-4 sm:gap-4 sm:py-5",
        href && "transition-shadow group-hover:shadow-md",
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 px-4 sm:px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5">
        <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{formatted}</div>
        {hasFooter && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
            {trend != null && (
              <span
                className={cn(
                  "font-semibold",
                  trend >= 0 ? "text-success" : "text-orange-red",
                )}
              >
                {trend >= 0 ? "▲" : "▼"} {numberFormat.format(Math.abs(trend))} %
              </span>
            )}
            {hint != null && (
              <span className={cn("inline-flex items-center gap-1", hintTones[hintTone])}>
                {hint}
              </span>
            )}
            {simulated && <LDCBadge variant="simulated">Simulado</LDCBadge>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!href) return card;

  return (
    <Link
      href={href}
      className="group block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {card}
    </Link>
  );
}
