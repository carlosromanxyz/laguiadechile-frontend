"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LDCCTAButton } from "@/components/atoms/ldc-cta-button";
import { LDCFormField } from "@/components/molecules/ldc-form-field";
import { LDC_ROLES, type LDCRole } from "@/lib/auth/roles";
import { isMockRolesEnabled, MOCK_ROLE_COOKIE } from "@/lib/dashboard/config";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

/** Error en línea de los roles sin backend cuando la simulación está apagada. */
const ROLE_UNAVAILABLE = "El ingreso para este perfil todavía no está disponible";

export interface LDCLoginFormProps {
  /**
   * Rol del acceso: define el placeholder del email y el destino tras iniciar
   * sesión (`lib/auth/roles.ts`). Solo `admin` inicia sesión de verdad; los
   * demás simulan el envío.
   * @default "admin"
   */
  role?: LDCRole;
}

/**
 * LDCLoginForm - Formulario de inicio de sesión
 *
 * React Hook Form + Zod. Con `admin`, envía a `/api/auth/login` (Route Handler
 * que guarda la cookie JWT). Si falla, muestra el error del servidor en línea
 * (`role="alert"`) y en un toast; si sale bien, va al `redirectTo` del rol.
 *
 * Con `comercio` o `usuario` no hay backend: valida igual y simula el envío. Con la
 * simulación activa (`isMockRolesEnabled()`: `NEXT_PUBLIC_MOCK_ROLES=true` y fuera
 * de producción), guarda la cookie `ldc-mock-role=<rol>` y va al `redirectTo` del
 * rol; si no, muestra en línea que ese ingreso todavía no está disponible.
 */
export function LDCLoginForm({ role = "admin" }: LDCLoginFormProps) {
  const config = LDC_ROLES[role];
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  /** Envío simulado de los roles sin backend (no llama a la API). */
  function onSimulatedSubmit() {
    setServerError(null);
    if (!isMockRolesEnabled()) {
      setServerError(ROLE_UNAVAILABLE);
      return;
    }
    setSubmitting(true);
    document.cookie = `${MOCK_ROLE_COOKIE}=${role}; path=/; SameSite=Lax`;
    router.replace(config.redirectTo);
    router.refresh();
  }

  async function onSubmit(values: FormValues) {
    if (role !== "admin") {
      onSimulatedSubmit();
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "No se pudo iniciar sesión");
      }
      toast.success("Bienvenido");
      router.replace(config.redirectTo);
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
        disabled={submitting}
      />
      <LDCFormField
        control={form.control}
        name="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        disabled={submitting}
      />
      {serverError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5">
          <p role="alert" className="flex items-start gap-1.5 text-sm break-words text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{serverError}</span>
          </p>
        </div>
      )}
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
          ¿Sin acceso? Pídeselo al equipo de La Guía de Chile.
        </p>
      </div>
    </form>
  );
}
