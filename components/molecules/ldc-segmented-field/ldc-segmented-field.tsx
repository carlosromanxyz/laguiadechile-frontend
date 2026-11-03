"use client";

import { cn } from "@/lib/utils";

export interface LDCSegmentedFieldOption<T extends string> {
  value: T;
  label: string;
}

export interface LDCSegmentedFieldProps<T extends string> {
  /** Título del grupo (`legend`) */
  legend: string;
  /** Opciones, en orden */
  options: readonly LDCSegmentedFieldOption<T>[];
  /** Opción elegida */
  value: T;
  /** Cambia la opción */
  onChange: (value: T) => void;
  /** `name` del grupo de radios */
  name: string;
  /** Texto de ayuda bajo el control (va en `aria-describedby` del grupo) */
  description?: string;
  /** Deshabilita las opciones (p. ej. mientras se envía) */
  disabled?: boolean;
  className?: string;
}

/**
 * LDCSegmentedField - Control segmentado: una sola opción de pocas, en una fila
 *
 * Radios nativos (`fieldset` + `legend`) con forma de segmentos sobre una pista `bg-muted` (diseño
 * B1). La opción elegida es neutra: fondo de tarjeta, texto normal y sombra; el foco se ve con el
 * anillo del sistema. Si no caben en una fila, los segmentos bajan a la siguiente. Lo usa
 * `LDCClassifiedForm` para la forma del precio.
 *
 * @example
 * <LDCSegmentedField legend="Precio" name="precio" value={type} onChange={setType}
 *   options={[{ value: "fixed", label: "Precio fijo" }, { value: "free", label: "Gratis" }]} />
 */
export function LDCSegmentedField<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
  description,
  disabled,
  className,
}: LDCSegmentedFieldProps<T>) {
  const descriptionId = description ? `${name}-descripcion` : undefined;
  return (
    <fieldset className={cn("min-w-0", className)} disabled={disabled} aria-describedby={descriptionId}>
      <legend className="mb-3 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-[3px] rounded-md border border-input bg-muted p-[3px]">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex flex-auto cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-2.5 py-1.5 text-center text-[13px] font-semibold transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                checked ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {description && (
        <p id={descriptionId} className="mt-2 font-open-sans text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </fieldset>
  );
}
