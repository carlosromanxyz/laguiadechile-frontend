import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import { LDCRoleOption } from "@/components/molecules/ldc-role-option";
import type { LDCRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

/**
 * Lo que se puede publicar desde el panel. Cada tipo da un rol a la cuenta (el de `role`): por
 * eso el inicio oculta los tipos cuyo rol ya tiene. Para sumar un tipo (p. ej. «Un evento», con el
 * rol organizador de CLGDC-138/140) basta agregarlo aquí y a `LDC_PUBLISH_KINDS`.
 */
const KINDS = {
  aviso: {
    role: "avisador",
    // Formulario de aviso: CLGDC-125.
    href: "/dashboard/avisos/nuevo",
    title: "Un aviso clasificado",
    description: "Vendo, compro, arriendo, busco u ofrezco. Dura 30 días.",
  },
  comercio: {
    role: "comercio",
    href: "/dashboard/publicar?tipo=comercio",
    title: "Mi comercio",
    description: "Un local o negocio: dirección, fotos, contacto y horario.",
  },
  servicio: {
    role: "servicio",
    href: "/dashboard/publicar?tipo=servicio",
    title: "Mi servicio",
    description: "Lo que haces a domicilio o por encargo, con zona de atención.",
  },
} as const satisfies Record<string, { role: LDCRole; href: string; title: string; description: string }>;

/** Tipo de publicación del selector. */
export type LDCPublishKind = keyof typeof KINDS;

/** Tipos en orden de presentación, con el rol que da cada uno. */
export const LDC_PUBLISH_KINDS = (Object.keys(KINDS) as LDCPublishKind[]).map((kind) => ({
  kind,
  role: KINDS[kind].role as LDCRole,
}));

export interface LDCPublishChooserProps {
  /** Tipos que se ofrecen, en orden; sin ninguno no se pinta nada */
  kinds: readonly LDCPublishKind[];
  className?: string;
}

/**
 * LDCPublishChooser - «¿Qué quieres publicar?» en el inicio del panel
 *
 * Un `LDCDashboardCard` con borde de marca y una opción por tipo (aviso, comercio, servicio), con
 * la forma de `LDCRoleOption`: ícono y color del rol que da, título, una línea y chevron. Toda la
 * opción es un enlace a su formulario. En móvil, una columna; desde `sm`, dos. Si queda una sola
 * opción, se muestra igual dentro del panel (diseño D2 de CLGDC-113).
 *
 * @example
 * <LDCPublishChooser kinds={["aviso", "servicio"]} />
 */
export function LDCPublishChooser({ kinds, className }: LDCPublishChooserProps) {
  if (kinds.length === 0) return null;
  return (
    <LDCDashboardCard
      id="publicar"
      title="¿Qué quieres publicar?"
      description="Elige uno; después puedes sumar los otros desde aquí mismo."
      className={cn("border-pink/40 dark:border-yellow/40", className)}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {kinds.map((kind) => {
          const k = KINDS[kind];
          return (
            <li key={kind} className="flex">
              <LDCRoleOption role={k.role} href={k.href} title={k.title} description={k.description} />
            </li>
          );
        })}
      </ul>
    </LDCDashboardCard>
  );
}
