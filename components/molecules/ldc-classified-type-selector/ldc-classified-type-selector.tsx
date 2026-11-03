"use client";

import { Check } from "lucide-react";
import type { ClassifiedType } from "@/interfaces/classified";
import { typeLabels } from "@/lib/format/classifieds";
import { cn } from "@/lib/utils";

const TYPES: readonly ClassifiedType[] = ["vendo", "compro", "arriendo", "busco", "ofrezco"];

/** Fondo y texto de la pill elegida: los mismos de las variantes `classified-*` de `LDCBadge`. */
const CHECKED: Record<ClassifiedType, string> = {
  vendo: "bg-pink text-black",
  compro: "bg-purple text-white",
  arriendo: "bg-orange text-black",
  busco: "bg-yellow text-black",
  ofrezco: "bg-emerald-500 text-black",
};

export interface LDCClassifiedTypeSelectorProps {
  /** Tipo elegido */
  value: ClassifiedType;
  /** Cambia el tipo */
  onChange: (value: ClassifiedType) => void;
  /** `name` del grupo de radios */
  name?: string;
  /** Deshabilita las opciones (p. ej. mientras se envía) */
  disabled?: boolean;
  className?: string;
}

/**
 * LDCClassifiedTypeSelector - Elige el tipo del aviso: Vendo, Compro, Arriendo, Busco u Ofrezco
 *
 * Pills de radios nativos (`fieldset` + `legend`), solo texto (de `typeLabels`), como en el diseño
 * B1. La elegida toma los colores de su insignia `classified-*`, sin borde, con un check delante y
 * un anillo de marca separado del borde (rosado en claro, amarillo en oscuro). Lo usa
 * `LDCClassifiedForm`.
 *
 * @example
 * <LDCClassifiedTypeSelector value={type} onChange={setType} />
 */
export function LDCClassifiedTypeSelector({
  value,
  onChange,
  name = "ldc-classified-type",
  disabled,
  className,
}: LDCClassifiedTypeSelectorProps) {
  return (
    <fieldset className={cn("min-w-0", className)} disabled={disabled}>
      <legend className="mb-3 text-sm font-semibold">Tipo de aviso</legend>
      <div className="flex flex-wrap gap-2">
        {TYPES.map((option) => {
          const checked = value === option;
          return (
            <label
              key={option}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border bg-card px-3.5 font-mulish text-[13px] font-bold transition-[border-color,box-shadow] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                checked
                  ? cn(
                      "border-transparent ring-2 ring-pink ring-offset-2 ring-offset-background dark:ring-yellow",
                      CHECKED[option],
                    )
                  : "border-border text-foreground hover:border-foreground",
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
              {checked && <Check className="size-3.5" aria-hidden />}
              {typeLabels[option]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
