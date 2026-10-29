"use client";

import { useId, type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export interface LDCCheckboxFieldProps<T extends FieldValues> {
  /** `control` de `useForm` */
  control: Control<T>;
  /** Nombre del campo booleano en el formulario */
  name: FieldPath<T>;
  /** Etiqueta junto a la casilla; puede llevar enlaces (p. ej. a los términos) */
  label: ReactNode;
  /** Deshabilita la casilla (p. ej. mientras se envía) */
  disabled?: boolean;
  /** Casilla obligatoria: `aria-required` (la validación la hace Zod) */
  required?: boolean;
}

/**
 * LDCCheckboxField - Casilla de React Hook Form sobre `Checkbox` y `Field` de shadcn
 *
 * Casilla de 16 px con un área táctil de 40 px y borde `muted-foreground` sin marcar (≥3:1 en
 * los dos temas), la etiqueta a la derecha y el error debajo
 * (`role="alert"`). Con error, la casilla lleva `aria-invalid` y `aria-describedby`.
 * El valor del campo es `true` o `false`.
 *
 * @example
 * <LDCCheckboxField control={form.control} name="terms" label={<>Acepto los términos</>} />
 */
export function LDCCheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  required,
}: LDCCheckboxFieldProps<T>) {
  const id = `${useId()}-${name}`;
  const errorId = `${id}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid;
        return (
          <Field data-invalid={invalid}>
            <div className="flex items-start gap-3">
              <Checkbox
                id={id}
                ref={field.ref}
                name={field.name}
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                disabled={disabled}
                aria-required={required || undefined}
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
                className="relative mt-0.5 border-muted-foreground after:absolute after:-inset-3 after:content-['']"
              />
              <FieldLabel
                htmlFor={id}
                className="block w-auto leading-snug font-normal text-foreground"
              >
                {label}
              </FieldLabel>
            </div>
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
