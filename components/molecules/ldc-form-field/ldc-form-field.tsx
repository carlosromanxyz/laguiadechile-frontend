"use client";

import { useId } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { LDCPasswordInput } from "@/components/atoms/ldc-password-input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface LDCFormFieldProps<T extends FieldValues> {
  /** `control` de `useForm` */
  control: Control<T>;
  /** Nombre del campo en el formulario */
  name: FieldPath<T>;
  /** Etiqueta visible */
  label: string;
  /** Tipo del control; `password` usa `LDCPasswordInput` (mostrar u ocultar) */
  type?: "text" | "email" | "password";
  /** Placeholder del input */
  placeholder?: string;
  /** `autocomplete` del input */
  autoComplete?: string;
  /** Texto de ayuda bajo el control */
  description?: string;
  /** Deshabilita el control (p. ej. mientras se envía) */
  disabled?: boolean;
}

/**
 * LDCFormField - Campo de formulario de React Hook Form sobre `Field` de shadcn
 *
 * Envuelve `Controller` + `Field`, `FieldLabel`, el control y `FieldError`.
 * Con error, el `Field` lleva `data-invalid` (etiqueta en rojo), el input
 * `aria-invalid` + `aria-describedby` y el mensaje se anuncia con `role="alert"`.
 * Los inputs miden 40 px de alto (h-10) y usan 16 px en móvil (sin zoom en iOS).
 *
 * @example
 * <LDCFormField control={form.control} name="email" label="Email" type="email" />
 */
export function LDCFormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  description,
  disabled,
}: LDCFormFieldProps<T>) {
  const id = `${useId()}-${name}`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid;
        const describedBy =
          [description ? descriptionId : null, invalid ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined;
        const controlProps = {
          ...field,
          value: field.value ?? "",
          id,
          placeholder,
          autoComplete,
          disabled,
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
        };

        return (
          <Field data-invalid={invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {type === "password" ? (
              <LDCPasswordInput {...controlProps} />
            ) : (
              <Input type={type} className="h-10" {...controlProps} />
            )}
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            {invalid && <FieldError id={errorId} errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
