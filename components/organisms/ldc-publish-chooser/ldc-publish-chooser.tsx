import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import type { LDCRoleIconProps } from "@/components/atoms/ldc-role-icon";
import { LDCRoleOption } from "@/components/molecules/ldc-role-option";
import type { LDCRole } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

/**
 * Lo que se puede publicar desde el panel, en orden de presentación (CLGDC-191): primero los
 * negocios (comercio, servicio), después las publicaciones de particulares (aviso, propiedad,
 * evento) y al final la noticia del admin. Cada tipo da un rol a la cuenta (el de `role`): por eso
 * el inicio oculta los tipos cuyo rol ya tiene. La excepción es `onlyFor`: el tipo no da rol, solo
 * se ofrece a quien tiene ese rol. Para sumar un tipo basta agregarlo aquí (y sale en
 * `getPublishKinds`).
 */
const KINDS: Record<
  "comercio" | "servicio" | "aviso" | "propiedad" | "evento" | "noticia",
  {
    role: LDCRole;
    onlyFor?: LDCRole;
    icon?: LDCRoleIconProps["icon"];
    href: string;
    title: string;
    description: string;
  }
> = {
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
  aviso: {
    role: "avisador",
    // Formulario de aviso: CLGDC-125.
    href: "/dashboard/avisos/nuevo",
    title: "Un aviso clasificado",
    description: "Vendo, compro, arriendo, busco u ofrezco. Dura 30 días.",
  },
  // CLGDC-164: propiedad del dueño (rol propietario).
  propiedad: {
    role: "propietario",
    href: "/dashboard/propiedades/nueva",
    title: "Una propiedad",
    description: "Casa, departamento, terreno u oficina, en venta o arriendo.",
  },
  // Eventos (CLGDC-140)
  evento: {
    role: "organizador",
    href: "/dashboard/eventos/nuevo",
    title: "Un evento",
    description: "Una feria, un concierto o un taller, con fecha y lugar.",
  },
  // CLGDC-191: solo el admin publica noticias. Ícono y color propios (no es un rol): `sky-500`, que
  // no usa ningún rol, con texto negro (8,4:1), como el `teal-500` del propietario.
  noticia: {
    role: "admin",
    onlyFor: "admin",
    icon: { name: "Newspaper", tone: "bg-sky-500 text-black" },
    href: "/dashboard/admin/noticias/nueva",
    title: "Una noticia",
    description: "Una novedad de la ciudad o del sitio, con foto y fecha.",
  },
};

/** Tipo de publicación del selector. */
export type LDCPublishKind = keyof typeof KINDS;

/**
 * Tipos que se le ofrecen a una cuenta según sus roles, en orden: los que dan un rol que aún no
 * tiene y los `onlyFor` de un rol que sí tiene.
 */
export function getPublishKinds(roles: readonly LDCRole[]): LDCPublishKind[] {
  return (Object.keys(KINDS) as LDCPublishKind[]).filter((kind) => {
    const { role, onlyFor } = KINDS[kind];
    return onlyFor ? roles.includes(onlyFor) : !roles.includes(role);
  });
}

export interface LDCPublishChooserProps {
  /** Tipos que se ofrecen, en orden; sin ninguno no se pinta nada */
  kinds: readonly LDCPublishKind[];
  className?: string;
}

/**
 * LDCPublishChooser - «¿Qué quieres publicar?» en el inicio del panel
 *
 * Un `LDCDashboardCard` con borde de marca y una opción por tipo (comercio, servicio, aviso, propiedad,
 * evento y, para el admin, noticia), con la forma de `LDCRoleOption`: ícono y color del rol que da (o
 * los propios del tipo), título, una línea y chevron. Toda la
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
              <LDCRoleOption
                role={k.role}
                icon={k.icon}
                href={k.href}
                title={k.title}
                description={k.description}
              />
            </li>
          );
        })}
      </ul>
    </LDCDashboardCard>
  );
}
