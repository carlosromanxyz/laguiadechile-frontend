import { cn } from "@/lib/utils";

interface LDCUploadProgressProps {
  /** Avance de 0 a 100 */
  value: number;
  /** Nombre accesible (p. ej. «Subiendo foto 3») */
  label: string;
  className?: string;
}

/**
 * LDCUploadProgress - Barra de avance de una subida, para el velo de una miniatura
 *
 * `role="progressbar"` con `aria-valuenow`. La barra se mueve con `translateX` lineal; con
 * `prefers-reduced-motion: reduce` salta sin transición (sigue mostrando el avance).
 */
export function LDCUploadProgress({ value, label, className }: LDCUploadProgressProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-white/25", className)}
    >
      <div
        className="h-full w-full bg-yellow motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-linear"
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </div>
  );
}
