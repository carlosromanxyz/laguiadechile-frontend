"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { LDCFormAlert } from "@/components/molecules/ldc-form-alert";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import type { IChangeMyPasswordResult, IMyPasswordChange } from "@/interfaces/profile";
import { passwordChangeSchema, type LDCPasswordChangeValues } from "@/validations/profile-form-schema";

/** El backend permite 5 intentos cada 15 minutos: tras el 429, el formulario se libera solo. */
const LOCK_MS = 15 * 60 * 1000;

const EMPTY: LDCPasswordChangeValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

export interface LDCPasswordChangeFormProps {
  /** Correo de la cuenta: va en un campo oculto `username` para el gestor de contraseñas */
  email: string;
  /** Id del h2 «Contraseña»: lo usa el `aria-labelledby` del panel que lo contiene */
  headingId: string;
  /** Server action que cambia la contraseña (`POST /me/password`) */
  action: (input: IMyPasswordChange) => Promise<IChangeMyPasswordResult>;
}

/**
 * LDCPasswordChangeForm - Panel «Contraseña» del perfil (alternativa A de CLGDC-115)
 *
 * Va dentro de un `LDCPanel` con `p-0`: la actual y, desde `sm` en dos columnas, la nueva y su
 * confirmación (solo del front). Los errores del servidor van al campo que los causó: la actual
 * errónea (400) la vacía, la marca y le da el foco; la nueva igual a la actual marca la nueva.
 * Demasiados intentos (429) se avisan arriba con `LDCFormAlert` y bloquean el formulario 15
 * minutos (lo que dura la ventana del backend). Al
 * cambiarla, vacía los campos y anuncia el éxito en el pie (`role="status"`).
 */
export function LDCPasswordChangeForm({ email, headingId, action }: LDCPasswordChangeFormProps) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locked, setLocked] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LDCPasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: EMPTY,
  });
  const values = useWatch({ control: form.control });
  const dirty = Boolean(values.currentPassword || values.newPassword || values.confirmPassword);

  // Escribir de nuevo después de guardar quita el mensaje de éxito (ajuste de estado en render).
  if (success && dirty) setSuccess(false);

  useEffect(() => {
    if (!locked) return;
    const t = setTimeout(() => {
      setLocked(false);
      setServerError(null);
    }, LOCK_MS);
    return () => clearTimeout(t);
  }, [locked]);

  async function onSubmit(v: LDCPasswordChangeValues) {
    setServerError(null);
    setSuccess(false);
    setSaving(true);
    const result = await action({ currentPassword: v.currentPassword, newPassword: v.newPassword });
    // Vuelve a habilitar los campos antes de mover el foco al que tiene el error.
    flushSync(() => setSaving(false));
    if (result.ok) {
      form.reset(EMPTY);
      setSuccess(true);
      return;
    }
    if (result.locked) {
      setLocked(true);
      setServerError(result.message);
      return;
    }
    if (result.field === "currentPassword") form.setValue("currentPassword", "");
    if (result.field) {
      form.setError(result.field, { message: result.message }, { shouldFocus: true });
      return;
    }
    setServerError(result.message);
  }

  const busy = saving || locked;

  return (
    <>
      <div className="px-5 pt-5">
        <h2 id={headingId} className="text-lg leading-snug font-extrabold">
          Contraseña
        </h2>
        <p className="mt-0.5 font-open-sans text-sm text-muted-foreground">
          Para cambiarla, confirma primero la actual.
        </p>
      </div>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <input
          type="email"
          name="username"
          autoComplete="username"
          value={email}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
        <div className="flex flex-col gap-5 px-5 pt-5 pb-5">
          {serverError && <LDCFormAlert message={serverError} />}
          <LDCFormField
            control={form.control}
            name="currentPassword"
            label="Contraseña actual"
            type="password"
            autoComplete="current-password"
            required
            disabled={busy}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <LDCFormField
              control={form.control}
              name="newPassword"
              label="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              description="Al menos 8 caracteres, distinta de la actual."
              required
              disabled={busy}
            />
            <LDCFormField
              control={form.control}
              name="confirmPassword"
              label="Repite la nueva"
              type="password"
              autoComplete="new-password"
              required
              disabled={busy}
            />
          </div>
        </div>
        <LDCFormSaveBar
          placement="panel"
          note="Esta sesión sigue abierta después del cambio."
          success={success ? "Cambiamos tu contraseña. Úsala la próxima vez que ingreses." : undefined}
          submitText="Cambiar contraseña"
          savingText="Cambiando…"
          submitIcon={<KeyRound className="size-4" aria-hidden />}
          saving={saving}
          submitDisabled={locked || !dirty}
        />
      </form>
    </>
  );
}
