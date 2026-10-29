"use client";

import { Store, Wrench, type LucideIcon } from "lucide-react";
import type { IListingDetail } from "@/interfaces/listing";
import { cn } from "@/lib/utils";

type ListingType = IListingDetail["type"];

const OPTIONS: { value: ListingType; label: string; description: string; icon: LucideIcon }[] = [
  {
    value: "comercio",
    label: "Comercio",
    description: "Un local o negocio con atención al público: tienda, restorán, almacén…",
    icon: Store,
  },
  {
    value: "servicio",
    label: "Servicio",
    description: "Lo que haces a domicilio o por encargo: gasfitería, clases, diseño…",
    icon: Wrench,
  },
];

export interface LDCListingTypeSelectorProps {
  /** Tipo elegido */
  value: ListingType;
  /** Cambia el tipo */
  onChange: (value: ListingType) => void;
  /** `name` del grupo de radios */
  name?: string;
  /** Deshabilita las opciones (p. ej. mientras se envía) */
  disabled?: boolean;
  className?: string;
}

/**
 * LDCListingTypeSelector - Elige si la ficha es un comercio o un servicio
 *
 * Grupo de radios nativos (`fieldset` + `legend`) con forma de tarjeta: ícono, nombre y una línea.
 * La opción elegida lleva el borde y el ícono de marca (rosado en claro, amarillo en oscuro). Lo
 * usa `LDCListingForm` al crear una ficha.
 *
 * @example
 * <LDCListingTypeSelector value={type} onChange={setType} />
 */
export function LDCListingTypeSelector({
  value,
  onChange,
  name = "ldc-listing-type",
  disabled,
  className,
}: LDCListingTypeSelectorProps) {
  return (
    <fieldset className={cn("min-w-0", className)} disabled={disabled}>
      <legend className="mb-3 text-sm font-semibold">¿Qué quieres publicar?</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value: option, label, description, icon: Icon }) => {
          const checked = value === option;
          return (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 text-card-foreground transition-[border-color,box-shadow] duration-150 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                checked
                  ? "border-pink shadow-sm dark:border-yellow"
                  : "border-border hover:border-pink/60 dark:hover:border-yellow/60",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full transition-colors",
                  checked ? "bg-pink text-white dark:bg-yellow dark:text-black" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-mulish text-sm font-extrabold">{label}</span>
                <span className="font-open-sans text-xs leading-snug text-muted-foreground">{description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
