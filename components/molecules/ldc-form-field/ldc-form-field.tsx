"use client";

import { useId, useState, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { LDCPasswordInput } from "@/components/atoms/ldc-password-input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/** Lo que recibe un control propio en el modo `render` (combobox, subida de imágenes, horario…). */
export interface LDCFormFieldRenderProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> {
  /** `field` de `Controller` (`value`, `onChange`, `onBlur`, `name`, `ref`) */
  field: ControllerRenderProps<T, TName>;
  /** Id del control principal: la etiqueta apunta a él */
  id: string;
  /** El campo tiene error (del formulario o local) */
  invalid: boolean;
  /** Ids de la descripción y del error, para `aria-describedby` */
  describedBy: string | undefined;
  disabled?: boolean;
  /**
   * Muestra un error propio del control (p. ej. «no es una imagen») en el mismo `FieldError`
   * con `role="alert"`; `null` lo quita.
   */
  setLocalError: (message: string | null) => void;
}

export interface LDCFormFieldProps<T extends FieldValues, TName extends FieldPath<T> = FieldPath<T>> {
  /** `control` de `useForm` */
  control: Control<T>;
  /** Nombre del campo en el formulario */
  name: TName;
  /** Etiqueta visible */
  label: string;
  /**
   * Tipo del control; `password` usa `LDCPasswordInput` (mostrar u ocultar) y `textarea`, el
   * `Textarea` de shadcn. Se ignora si hay `render`.
   */
  type?: "text" | "email" | "password" | "tel" | "url" | "textarea";
  /** Placeholder del input */
  placeholder?: string;
  /** `autocomplete` del input */
  autoComplete?: string;
  /** Texto de ayuda bajo el control */
  description?: string;
  /** Deshabilita el control (p. ej. mientras se envía) */
  disabled?: boolean;
  /** Muestra «(opcional)» junto a la etiqueta */
  optional?: boolean;
  /** Ícono a la izquierda del input (JSX ya renderizado) */
  icon?: ReactNode;
  /** Filas visibles del `textarea` */
  rows?: number;
  /** Control propio en vez del input: recibe `field`, el id y los atributos de accesibilidad */
  render?: (props: LDCFormFieldRenderProps<T, TName>) => ReactNode;
  /** Campo obligatorio: `aria-required` en el control (la validación la hace Zod) */
  required?: boolean;
  /**
   * Acción tras el mensaje de error, dentro del mismo `role="alert"` (p. ej. el enlace
   * «Inicia sesión» cuando el email ya tiene cuenta). Solo se pinta si el campo tiene error.
   */
  errorAction?: ReactNode;
}

/**
 * LDCFormField - Campo de formulario de React Hook Form sobre `Field` de shadcn
 *
 * Envuelve `Controller` + `Field`, `FieldLabel`, el control y `FieldError`.
 * Con error, el `Field` lleva `data-invalid` (etiqueta en rojo), el input
 * `aria-invalid` + `aria-describedby` y el mensaje se anuncia con `role="alert"`.
 * Los inputs miden 40 px de alto (h-10) y usan 16 px en móvil (sin zoom en iOS).
 * Con `render`, el control lo pone el llamador (combobox, `LDCImageUpload`, horario) y puede
 * mostrar errores propios con `setLocalError`.
 *
 * @example
 * <LDCFormField control={form.control} name="email" label="Email" type="email" />
 * <LDCFormField control={form.control} name="description" label="Descripción" type="textarea" rows={7} />
 */
export function LDCFormField<T extends FieldValues, TName extends FieldPath<T> = FieldPath<T>>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  description,
  disabled,
  optional,
  icon,
  rows,
  render,
  required,
  errorAction,
}: LDCFormFieldProps<T, TName>) {
  const id = `${useId()}-${name}`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = fieldState.invalid || localError !== null;
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
          "aria-required": required || undefined,
          "aria-invalid": invalid,
          "aria-describedby": describedBy,
        };

        let controlNode: ReactNode;
        if (render) {
          // El `Field` inválido pinta todo de rojo; el control propio conserva sus colores.
          controlNode = (
            <div className="min-w-0 text-foreground">
              {render({ field, id, invalid, describedBy, disabled, setLocalError })}
            </div>
          );
        } else if (type === "password") {
          controlNode = <LDCPasswordInput {...controlProps} />;
        } else if (type === "textarea") {
          controlNode = <Textarea rows={rows} className="field-sizing-fixed" {...controlProps} />;
        } else {
          const input = <Input type={type} className={cn("h-10", icon && "pl-9")} {...controlProps} />;
          controlNode = icon ? (
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4"
              >
                {icon}
              </span>
              {input}
            </div>
          ) : (
            input
          );
        }

        return (
          <Field data-invalid={invalid}>
            <FieldLabel htmlFor={id}>
              {label}
              {optional && (
                <span className="font-open-sans text-xs font-normal text-muted-foreground">(opcional)</span>
              )}
            </FieldLabel>
            {controlNode}
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            {invalid &&
              (errorAction && localError === null ? (
                <FieldError id={errorId} className="break-words">
                  {fieldState.error?.message} {errorAction}
                </FieldError>
              ) : (
                <FieldError
                  id={errorId}
                  errors={[localError !== null ? { message: localError } : fieldState.error]}
                />
              ))}
          </Field>
        );
      }}
    />
  );
}
