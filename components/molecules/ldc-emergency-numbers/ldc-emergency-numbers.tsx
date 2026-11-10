import { Phone, Siren } from "lucide-react";
import { LDCPanel } from "@/components/atoms/ldc-panel";
import { EMERGENCY_NUMBERS, emergencyLabel, telHref } from "@/lib/format/places";
import { cn } from "@/lib/utils";

interface LDCEmergencyNumbersProps {
  /** Número de emergencia del lugar (`emergencyNumber`): va primero y destacado con peso tipográfico */
  own?: string;
  className?: string;
}

interface IEmergencyRow {
  number: string;
  label: string;
  detail: string;
  own: boolean;
}

/**
 * LDCEmergencyNumbers - Panel «Números de emergencia» del lateral de un servicio público (CLGDC-207)
 *
 * Sobrio, sin bloques de color: filas compactas con borde neutro, cada una un enlace `tel:` de
 * 44 px con el ícono `Phone` en `--emergency`, la etiqueta («SAMU») y el número en
 * `font-semibold tabular-nums`. El número propio del lugar va primero y se destaca solo con el peso
 * (`font-extrabold`) y «De este lugar»; si no es un número nacional, se suma como fila propia.
 *
 * @example
 * <LDCEmergencyNumbers own={place.emergencyNumber} />
 */
export function LDCEmergencyNumbers({ own, className }: LDCEmergencyNumbersProps) {
  const national: IEmergencyRow[] = EMERGENCY_NUMBERS.map((n) => ({ ...n, own: n.number === own }));
  const rows: IEmergencyRow[] =
    own && !national.some((n) => n.own)
      ? [{ number: own, label: emergencyLabel(own), detail: "", own: true }, ...national]
      : [...national.filter((n) => n.own), ...national.filter((n) => !n.own)];

  return (
    <LDCPanel as="section" aria-labelledby="ldc-emergency-numbers-title" className={className}>
      <h3
        id="ldc-emergency-numbers-title"
        className="mb-4 flex items-center gap-2 font-mulish text-lg font-bold text-foreground"
      >
        <Siren className="size-5 text-pink" aria-hidden />
        Números de emergencia
      </h3>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.number}>
            <a
              href={telHref(row.number)}
              aria-label={`Llamar a ${row.label}, ${row.number}${row.own ? ", el número de este lugar" : ""}`}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors outline-none",
                "hover:border-pink/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:border-yellow/60",
              )}
            >
              <Phone className="size-4 shrink-0 text-emergency" aria-hidden />
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className={row.own ? "font-extrabold" : "font-semibold"}>{row.label}</span>
                {(row.own || row.detail) && (
                  <span className="font-open-sans text-xs text-muted-foreground">
                    {row.own ? "De este lugar" : row.detail}
                  </span>
                )}
              </span>
              <span className={cn("tabular-nums", row.own ? "text-lg font-extrabold" : "text-base font-semibold")}>
                {row.number}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-open-sans text-xs text-muted-foreground">
        Gratis desde cualquier teléfono, las 24 horas.
      </p>
    </LDCPanel>
  );
}
