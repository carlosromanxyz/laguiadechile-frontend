"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCFormAlert } from "@/components/molecules/ldc-form-alert";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { toLDCRole } from "@/lib/auth/backend-role";
import { safeNextPath } from "@/lib/auth/safe-next";
import { LDC_ROLES, type LDCRole } from "@/lib/auth/roles";
import { getRoleHome } from "@/lib/dashboard/config";
import { AUTH_INLINE_LINK_CLASS } from "@/lib/ui/auth";

const schema = z.object({
  email: z.string().email("Escribe un email completo, como nombre@dominio.cl"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export interface LDCLoginFormProps {
  /**
   * Rol del acceso: define el placeholder del email y el enlace del pie
   * (`lib/auth/roles.ts`). No decide a qué panel se entra: eso lo dice la cuenta.
   * @default "admin"
   */
  role?: LDCRole;
  /**
   * Ruta interna a la que volver tras iniciar sesión (`?next=` del login). Se vuelve a validar
   * con `safeNextPath`; si no es válida, se va al panel del rol.
   */
  next?: string;
}

/**
 * LDCLoginForm - Formulario de inicio de sesión
 *
 * React Hook Form + Zod. Envía a `/api/auth/login` (Route Handler que guarda la
 * cookie JWT) con cualquier rol. Si falla, muestra el error del servidor en línea
 * (`role="alert"`) y en un toast; si sale bien, va al panel del rol real de la
 * cuenta (`getRoleHome`), aunque se haya entrado por el login de otro rol. Con `next`, vuelve
 * a esa ruta con una navegación completa (la página pública vuelve a pedir sus favoritos).
 *
 * Con comercio o usuario, el pie ofrece crear una cuenta (`registerPath`); con
 * admin, pedir acceso al equipo.
 */
export function LDCLoginForm({ role = "admin", next }: LDCLoginFormProps) {
  const config = LDC_ROLES[role];
  const registerPath = "registerPath" in config ? config.registerPath : undefined;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        user?: { role?: unknown };
      };
      if (!res.ok) throw new Error(data.message ?? "No se pudo iniciar sesión");
      const accountRole = toLDCRole(data.user?.role);
      toast.success("Bienvenido");
      const target = safeNextPath(next);
      if (target) {
        window.location.assign(target);
        return;
      }
      // Sin rol conocido, `/dashboard` decide con la sesión del servidor.
      router.replace(accountRole ? getRoleHome(accountRole) : "/dashboard");
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error de inicio de sesión";
      setServerError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <LDCFormField
        control={form.control}
        name="email"
        label="Email"
        type="email"
        placeholder={config.emailPlaceholder}
        autoComplete="email"
        required
        disabled={submitting}
      />
      <LDCFormField
        control={form.control}
        name="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        disabled={submitting}
      />
      {serverError && <LDCFormAlert message={serverError} />}
      <div className="flex flex-col gap-3">
        <LDCCTAButton
          type="submit"
          variant="contrast"
          text="Iniciar sesión"
          loading={submitting}
          loadingText="Ingresando…"
          showIcon={false}
          className="h-10 w-full justify-center font-bold hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        />
        <p className="text-center font-open-sans text-sm text-muted-foreground">
          {registerPath ? (
            <>
              ¿No tienes cuenta?{" "}
              <Link
                href={registerPath}
                className={AUTH_INLINE_LINK_CLASS}
              >
                Créala
              </Link>
            </>
          ) : (
            "¿Sin acceso? Pídeselo al equipo de La Guía de Chile."
          )}
        </p>
      </div>
    </form>
  );
}
