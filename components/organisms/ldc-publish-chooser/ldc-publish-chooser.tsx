import { LDCDashboardCard } from "@/components/molecules/ldc-dashboard-card";
import type { LDCRoleIconProps } from "@/components/atoms/ldc-role-icon";
import { LDCPublishTile } from "@/components/molecules/ldc-publish-tile";
import { LDC_ROLE_META, type LDCRole } from "@/lib/auth/roles";

/**
 * Lo que se puede publicar desde el panel, en orden de presentación (CLGDC-191): primero los
 * negocios (comercio, servicio), después las publicaciones de particulares (aviso, propiedad,
 * evento) y al final la noticia del admin. Cada tipo da un rol a la cuenta (el de `role`): por eso
 * el inicio oculta los tipos cuyo rol ya tiene. La excepción es `onlyFor`: el tipo no da rol, solo
 * se ofrece a quien tiene ese rol. Para sumar un tipo basta agregarlo aquí (y sale en
 * `getPublishKinds`). `shortLabel` es la palabra visible de la tile y su nombre accesible
 * (CLGDC-203); `description` no se ve y es la descripción accesible del enlace.
 */
const KINDS: Record<
  "comercio" | "servicio" | "aviso" | "propiedad" | "evento" | "noticia",
  {
    role: LDCRole;
    onlyFor?: LDCRole;
    icon?: LDCRoleIconProps["icon"];
    href: string;
    shortLabel: string;
    description: string;
  }
> = {
  comercio: {
    role: "comercio",
    href: "/dashboard/publicar?tipo=comercio",
    shortLabel: "Comercio",
    description: "Un local o negocio: dirección, fotos, contacto y horario.",
  },
  servicio: {
    role: "servicio",
    href: "/dashboard/publicar?tipo=servicio",
    shortLabel: "Servicio",
    description: "Lo que haces a domicilio o por encargo, con zona de atención.",
  },
  aviso: {
    role: "avisador",
    // Formulario de aviso: CLGDC-125.
    href: "/dashboard/avisos/nuevo",
    shortLabel: "Aviso",
    description: "Vendo, compro, arriendo, busco u ofrezco. Dura 30 días.",
  },
  // CLGDC-164: propiedad del dueño (rol propietario).
  propiedad: {
    role: "propietario",
    href: "/dashboard/propiedades/nueva",
    shortLabel: "Propiedad",
    description: "Casa, departamento, terreno u oficina, en venta o arriendo.",
  },
  // Eventos (CLGDC-140)
  evento: {
    role: "organizador",
    href: "/dashboard/eventos/nuevo",
    shortLabel: "Evento",
    description: "Una feria, un concierto o un taller, con fecha y lugar.",
  },
  // CLGDC-191: solo el admin publica noticias. Ícono propio (no es un rol) y, desde CLGDC-203, el
  // color del admin (`bg-purple text-white`, 4,8:1, token de marca) en vez del `sky-500` de
  // Tailwind: el rol admin nunca sale en el selector, así que el morado queda libre.
  noticia: {
    role: "admin",
    onlyFor: "admin",
    icon: { name: "Newspaper", tone: LDC_ROLE_META.admin.tone },
    href: "/dashboard/admin/noticias/nueva",
    shortLabel: "Noticia",
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
 * Un `LDCDashboardCard` neutro, sin bajada, con una `LDCPublishTile` por tipo (comercio, servicio,
 * aviso, propiedad, evento y, para el admin, noticia): ícono de 48 px y una palabra (diseño A + K3
 * de CLGDC-203). Las tiles van en `flex-wrap` y crecen, así no quedan huecos: en móvil, 2 por fila
 * (la sobrante ocupa el ancho); desde `sm`, base de 9rem (hasta 6 en una fila). Cada `li` es un
 * `@container`: con 1 a 3 opciones la tile queda ancha y pasa a horizontal.
 *
 * @example
 * <LDCPublishChooser kinds={["aviso", "servicio"]} />
 */
export function LDCPublishChooser({ kinds, className }: LDCPublishChooserProps) {
  if (kinds.length === 0) return null;
  return (
    <LDCDashboardCard id="publicar" title="¿Qué quieres publicar?" className={className}>
      <ul className="flex flex-wrap gap-3">
        {kinds.map((kind) => {
          const k = KINDS[kind];
          return (
            <li key={kind} className="@container flex flex-[1_1_calc(50%-0.375rem)] sm:flex-[1_1_9rem]">
              <LDCPublishTile
                role={k.role}
                icon={k.icon}
                href={k.href}
                label={k.shortLabel}
                description={k.description}
                descriptionId={`publicar-${kind}-desc`}
              />
            </li>
          );
        })}
      </ul>
    </LDCDashboardCard>
  );
}
