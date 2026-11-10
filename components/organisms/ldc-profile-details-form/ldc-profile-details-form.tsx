"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useId, useState } from "react";
import { flushSync } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { LDCAvatar } from "@/components/atoms/ldc-avatar";
import { LDCBadge } from "@/components/atoms/ldc-badge";
import { LDC_ROLE_ICONS } from "@/components/atoms/ldc-role-icon";
import { LDCFormAlert } from "@/components/molecules/ldc-form-alert";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDCFormSaveBar } from "@/components/molecules/ldc-form-save-bar";
import type { IMyProfile, IMyProfileUpdate, IUpdateMyProfileResult } from "@/interfaces/profile";
import { LDC_ROLE_META } from "@/lib/auth/roles";
import { formatPersonName, getPersonInitials } from "@/lib/people";
import { profileDetailsSchema } from "@/validations/profile-form-schema";

/** El correo va en el formulario solo para mostrarse (solo lectura); no se envía. */
const schema = profileDetailsSchema.extend({ email: z.string() });
type FormValues = z.infer<typeof schema>;

const sinceFormat = new Intl.DateTimeFormat("es-CL", {
  month: "long",
  year: "numeric",
  timeZone: "America/Santiago",
});

export interface LDCProfileDetailsFormProps {
  /** Perfil propio (`GET /me`) */
  profile: IMyProfile;
  /** Id del h2 «Tus datos»: lo usa el `aria-labelledby` del panel que lo contiene */
  headingId: string;
  /** Server action que guarda el nombre y el apellido (`PATCH /me`) */
  action: (input: IMyProfileUpdate) => Promise<IUpdateMyProfileResult>;
}

/**
 * LDCProfileDetailsForm - Panel «Tus datos» del perfil (alternativa A de CLGDC-115)
 *
 * Va dentro de un `LDCPanel` con `p-0`: encabezado, identidad (avatar con `getPersonInitials`,
 * nombre guardado con `formatPersonName` y fecha de alta), los roles de la cuenta (solo lectura: se
 * suman al publicar), Nombre | Apellido (editables, en dos columnas desde `sm`) y el correo (solo
 * lectura, con candado). El pie es `LDCFormSaveBar placement="panel"`: «Descartar» y «Guardar
 * cambios», deshabilitados sin cambios; al guardar anuncia «Guardamos tu nombre y apellido.»
 * (`role="status"`). Un error del servidor va en el campo que lo causó y lo enfoca. La server
 * action revalida el layout del panel, así el pie del menú muestra el nombre nuevo.
 */
export function LDCProfileDetailsForm({ profile, headingId, action }: LDCProfileDetailsFormProps) {
  const [saved, setSaved] = useState(profile);
  const rolesLabelId = useId();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: profile.firstName, lastName: profile.lastName, email: profile.email },
  });
  const [firstName, lastName] = useWatch({ control: form.control, name: ["firstName", "lastName"] });
  const dirty = firstName !== saved.firstName || lastName !== saved.lastName;

  // Escribir de nuevo después de guardar quita el mensaje de éxito (ajuste de estado en render).
  if (success && dirty) setSuccess(false);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSuccess(false);
    setSaving(true);
    const result = await action({ firstName: values.firstName, lastName: values.lastName });
    // Vuelve a habilitar el campo antes de mover el foco al error.
    flushSync(() => setSaving(false));
    if (!result.ok) {
      if (result.field) form.setError(result.field, { message: result.message }, { shouldFocus: true });
      else setServerError(result.message);
      return;
    }
    setSaved(result.profile);
    form.reset({
      firstName: result.profile.firstName,
      lastName: result.profile.lastName,
      email: result.profile.email,
    });
    setSuccess(true);
  }

  function discard() {
    form.reset({ firstName: saved.firstName, lastName: saved.lastName, email: saved.email });
    setServerError(null);
    setSuccess(false);
    form.setFocus("firstName");
  }

  return (
    <>
      <div className="px-5 pt-5">
        <h2 id={headingId} className="text-lg leading-snug font-extrabold">
          Tus datos
        </h2>
        <p className="mt-0.5 font-open-sans text-sm text-muted-foreground">
          Tu nombre, tu apellido y el correo con que ingresas.
        </p>
      </div>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-5 pt-5 pb-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <LDCAvatar name={formatPersonName(saved)} initials={getPersonInitials(saved)} size="lg" decorative />
            <div className="min-w-0">
              <p className="text-base leading-tight font-extrabold [overflow-wrap:anywhere]">
                {formatPersonName(saved)}
              </p>
              <p className="font-open-sans text-[13px] text-muted-foreground [overflow-wrap:anywhere]">
                Miembro desde {sinceFormat.format(new Date(saved.createdAt))}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p id={rolesLabelId} className="mb-2 text-xs font-bold text-muted-foreground">
              Tus roles
            </p>
            <ul className="flex flex-wrap gap-1.5" aria-labelledby={rolesLabelId}>
              {saved.roles.map((role) => {
                const meta = LDC_ROLE_META[role];
                const Icon = LDC_ROLE_ICONS[meta.iconName];
                return (
                  <li key={role}>
                    <LDCBadge variant={`role-${role}`} className="gap-1 whitespace-nowrap">
                      <Icon className="size-3.5" aria-hidden />
                      {meta.label}
                    </LDCBadge>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 font-open-sans text-[13px] text-muted-foreground">
              Los roles se suman solos cuando publicas; no se editan aquí.
            </p>
          </div>
          <hr className="mt-5 border-border" />
          <div className="mt-5 flex flex-col gap-5">
            {serverError && <LDCFormAlert message={serverError} />}
            <div className="grid gap-5 sm:grid-cols-2">
              <LDCFormField
                control={form.control}
                name="firstName"
                label="Nombre"
                autoComplete="given-name"
                maxLength={80}
                description="Entre 2 y 80 caracteres."
                required
                disabled={saving}
              />
              <LDCFormField
                control={form.control}
                name="lastName"
                label="Apellido"
                autoComplete="family-name"
                maxLength={80}
                description="Entre 2 y 80 caracteres."
                required
                disabled={saving}
              />
            </div>
            <LDCFormField
              control={form.control}
              name="email"
              label="Correo"
              type="email"
              readOnly
              icon={<Lock />}
              description="Es tu usuario para ingresar. Por ahora no se puede cambiar."
            />
          </div>
        </div>
        <LDCFormSaveBar
          placement="panel"
          note="Tu nombre y apellido se muestran en el menú del panel. El correo no se puede cambiar."
          success={success ? "Guardamos tu nombre y apellido." : undefined}
          submitText="Guardar cambios"
          savingText="Guardando…"
          saving={saving}
          submitDisabled={!dirty}
          discardDisabled={!dirty}
          onDiscard={discard}
        />
      </form>
    </>
  );
}
