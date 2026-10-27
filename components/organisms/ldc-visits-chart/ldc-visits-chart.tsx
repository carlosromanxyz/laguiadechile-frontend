import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import type { IDashboardVisitPoint } from "@/interfaces/dashboard";
import { formatDayMonth } from "@/lib/dashboard/dates";

export interface LDCVisitsChartProps {
  /** Visitas por día, de la más antigua a hoy */
  points: IDashboardVisitPoint[];
  /** Título de la tarjeta */
  title?: string;
  /** Marca el dato como simulado */
  simulated?: boolean;
}

const numberFormat = new Intl.NumberFormat("es-CL");

/**
 * LDCVisitsChart - Gráfico de barras de visitas por día
 *
 * Barras de `div` en el color de acento (rosado en claro, amarillo en oscuro), sin librería de
 * gráficos. Para lectores de pantalla: `role="img"` con resumen y una tabla oculta con los
 * valores de cada día. Server Component: las fechas van con `timeZone` America/Santiago.
 *
 * @example
 * <LDCVisitsChart points={series} simulated />
 */
export function LDCVisitsChart({
  points,
  title = `Visitas por día · ${points.length} días`,
  simulated,
}: LDCVisitsChartProps) {
  if (points.length === 0) return null;
  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <LDCDashboardCard title={title} simulated={simulated}>
      <div
        role="img"
        aria-label={`Visitas diarias de los últimos ${points.length} días, entre ${numberFormat.format(min)} y ${numberFormat.format(max)}`}
        className="flex h-36 items-end gap-1.5 pt-2"
      >
        {points.map((p) => (
          <div
            key={p.date}
            title={numberFormat.format(p.value)}
            className="min-w-0 flex-1 rounded-t bg-pink opacity-85 last:opacity-100 dark:bg-yellow"
            style={{ height: `${Math.round((p.value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="mt-1.5 flex justify-between text-[11px] text-muted-foreground"
      >
        <span>{formatDayMonth(first.date)}</span>
        <span>Hoy, {formatDayMonth(last.date)}</span>
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Día</th>
            <th scope="col">Visitas</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}>
              <td>{formatDayMonth(p.date)}</td>
              <td>{numberFormat.format(p.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LDCDashboardCard>
  );
}
