import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface LDCStatCardProps {
  /** Nombre de la métrica */
  label: string;
  /** Valor numérico */
  value: number;
  /** Ícono ya renderizado (p. ej. `<Store className="size-4" />`) */
  icon: ReactNode;
}

/**
 * LDCStatCard - Tarjeta de métrica del panel
 *
 * Server Component: el ícono llega como ReactNode ya renderizado.
 *
 * @example
 * <LDCStatCard label="Noticias" value={12} icon={<Newspaper className="size-4" />} />
 */
export function LDCStatCard({ label, value, icon }: LDCStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}
