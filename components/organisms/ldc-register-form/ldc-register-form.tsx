"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCCheckboxField } from "@/components/molecules/ldc-checkbox-field";
import { LDCFormAlert } from "@/components/molecules/ldc-form-alert";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDC_REGISTER, LDC_ROLES } from "@/lib/auth/roles";
import { AUTH_INLINE_LINK_CLASS } from "@/lib/ui/auth";

const schema = z
  .object({
    name: z.string().trim().min(2, "Escribe tu nombre").max(80, "Máximo 80 caracteres"),
    email: z.string().trim().email("Escribe un email completo, como nombre@dominio.cl"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, "Acepta los términos para crear tu cuenta"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type FormValues = z.infer<typeof schema>;

/** Login común: la cuenta entra a su panel sea cual sea el rol. */
const LOGIN_PATH = "/ingresar";
const NETWORK_ERROR = "No pudimos crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.";

/** El error 409 del email se marca con este tipo para mostrar el enlace a iniciar sesión. */
const EMAIL_TAKEN = "server";

/**
 * LDCRegisterForm - Formulario de registro público (`/registro`)
 *
 * React Hook Form + Zod, con el mismo `LDCFormField` del login: nombre, email, contraseña,
 * confirmación y la casilla de términos (`LDCCheckboxField`). Envía a `/api/auth/register`
 * (Route Handler que crea la cuenta como USUARIO y guarda la cookie JWT).
 * - 409: el error va en el campo email, con el enlace a iniciar sesión, y lo enfoca.
 * - Otro error: caja de error en línea (`role="alert"`) y toast, como el login.
 * - Éxito: toast «Cuenta creada» y al inicio del panel (`/dashboard`).
 */
export function LDCRegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false },
  });
  const { errors } = form.formState;
  const emailTaken = errors.email?.type === EMAIL_TAKEN;

  // El foco va al email tras el 409, cuando el campo deja de estar deshabilitado por el envío.
  useEffect(() => {
    if (emailTaken && !submitting) form.setFocus("email");
  }, [emailTaken, submitting, form]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      let res: Response;
      try {
        res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });
      } catch {
        throw new Error(NETWORK_ERROR);
      }
      const data = (await res.json().catch(() => ({}))) as {
        message?: string | string[];
      };
      if (res.status === 409) {
        form.setError("email", { type: EMAIL_TAKEN, message: "Ya existe una cuenta con este email." });
        return;
      }
      if (!res.ok) {
        const message = Array.isArray(data.message) ? data.message.join(". ") : data.message;
        throw new Error(message || NETWORK_ERROR);
      }
      toast.success("Cuenta creada");
      router.replace("/dashboard");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : NETWORK_ERROR;
      setServerError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <p className="-mb-2 font-open-sans text-sm text-muted-foreground">
        Todos los campos son obligatorios.
      </p>
      <LDCFormField
        control={form.control}
        name="name"
        label="Nombre"
        placeholder="Nombre y apellido"
        autoComplete="name"
        required
        disabled={submitting}
      />
      <LDCFormField
        control={form.control}
        name="email"
        label="Email"
        type="email"
        placeholder={LDC_ROLES[LDC_REGISTER.role].emailPlaceholder}
        autoComplete="email"
        required
        disabled={submitting}
        errorAction={
          emailTaken ? (
            <Link href={LOGIN_PATH} className={AUTH_INLINE_LINK_CLASS}>
              Inicia sesión
            </Link>
          ) : undefined
        }
      />
      <LDCFormField
        control={form.control}
        name="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        description={errors.password ? undefined : "Mínimo 8 caracteres."}
        required
        disabled={submitting}
      />
      <LDCFormField
        control={form.control}
        name="confirmPassword"
        label="Repite la contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        disabled={submitting}
      />
      <LDCCheckboxField
        control={form.control}
        name="terms"
        required
        disabled={submitting}
        label={
          <>
            Acepto los{" "}
            <Link href="/terminos-y-condiciones" target="_blank" className={AUTH_INLINE_LINK_CLASS}>
              términos y condiciones
            </Link>{" "}
            y la{" "}
            <Link href="/politicas-de-privacidad" target="_blank" className={AUTH_INLINE_LINK_CLASS}>
              política de privacidad
            </Link>
            .
          </>
        }
      />
      {serverError && <LDCFormAlert message={serverError} />}
      <div className="flex flex-col gap-3">
        <LDCCTAButton
          type="submit"
          variant="contrast"
          text="Crear cuenta"
          loading={submitting}
          loadingText="Creando tu cuenta…"
          showIcon={false}
          className="h-10 w-full justify-center font-bold hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        />
        <p className="text-center font-open-sans text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href={LOGIN_PATH} className={AUTH_INLINE_LINK_CLASS}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </form>
  );
}
