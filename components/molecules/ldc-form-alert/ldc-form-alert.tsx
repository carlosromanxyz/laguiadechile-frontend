"use client";

import { CircleAlert } from "lucide-react";
import { useEffect, useRef } from "react";

export interface LDCFormAlertProps {
  /** Mensaje de error del servidor */
  message: string;
}

/**
 * LDCFormAlert - Error del servidor de un formulario (login, registro)
 *
 * Caja con borde `destructive/40` y fondo transparente (el texto `destructive` queda sobre el
 * `background`, con contraste ≥4,5:1), ícono y el mensaje en `role="alert"`. Al aparecer o
 * cambiar el mensaje toma el foco (`tabIndex={-1}`), para que el teclado y el lector de pantalla
 * lleguen al error.
 *
 * @example
 * {serverError && <LDCFormAlert message={serverError} />}
 */
export function LDCFormAlert({ message }: LDCFormAlertProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [message]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="rounded-md border border-destructive/40 px-3 py-2.5 outline-none focus-visible:ring-[3px] focus-visible:ring-destructive/20"
    >
      <p role="alert" className="flex items-start gap-1.5 text-sm break-words text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </p>
    </div>
  );
}
