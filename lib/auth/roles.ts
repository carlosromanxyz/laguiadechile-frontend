/**
 * Roles de La Guía de Chile y configuración de los accesos (login).
 *
 * Sin I/O ni React: se puede importar desde Server y Client Components.
 * El ícono va como nombre (string) para que no cruce un componente Lucide
 * de Server a Client; lo resuelve `LDCRoleIcon`.
 *
 * Una cuenta tiene varios roles (los `roles` de `/auth/me`): el panel arma su menú con ellos.
 * Solo tres tienen login propio (`LDCAccessRole`); esa configuración solo da el contexto de cada
 * login (textos, ícono y ruta), no decide a qué se entra.
 */

/** Roles de una cuenta (enum `Role` del backend). */
export type LDCRole = "usuario" | "avisador" | "comercio" | "servicio" | "admin";

/** Roles con login propio (`/dashboard/login` y `/ingresar/[rol]`). */
export type LDCAccessRole = "admin" | "comercio" | "usuario";

/** Nombre del ícono Lucide de cada rol (lo resuelve `LDCRoleIcon`). */
export type LDCRoleIconName = "ShieldCheck" | "Store" | "Tag" | "UserRound" | "Wrench";

/**
 * Nombre visible, ícono y color de cada rol. El color es el mismo en `LDCRoleIcon` y en
 * `LDCBadge` (`role-*`), así un rol se reconoce igual en todo el panel. Criterio:
 * - un color de marca por rol, sin repetir: usuario rosado, avisador amarillo, comercio naranjo,
 *   servicio naranjo-rojo y admin morado;
 * - texto negro sobre los fondos claros (amarillo, naranjo y naranjo-rojo) y blanco sobre los
 *   oscuros (rosado y morado): contraste de texto ≥ 4,5:1 y de ícono ≥ 3:1 (WCAG 1.4.3 y 1.4.11);
 * - comercio y servicio son vecinos (naranjo y naranjo-rojo) porque los dos publican fichas; se
 *   distinguen por el ícono (tienda y llave) y por el nombre, que siempre acompaña al color;
 * - los badges de tipo de aviso usan los mismos colores (vendo rosado, compro morado, busco
 *   amarillo, arriendo naranjo), pero nunca van en la misma fila que un badge de rol.
 */
export const LDC_ROLE_META = {
  usuario: { label: "Usuario", iconName: "UserRound", tone: "bg-pink text-white" },
  avisador: { label: "Avisador", iconName: "Tag", tone: "bg-yellow text-black" },
  comercio: { label: "Comercio", iconName: "Store", tone: "bg-orange text-black" },
  servicio: { label: "Servicio", iconName: "Wrench", tone: "bg-orange-red text-black" },
  admin: { label: "Administrador", iconName: "ShieldCheck", tone: "bg-purple text-white" },
} as const satisfies Record<LDCRole, { label: string; iconName: LDCRoleIconName; tone: string }>;

/** Roles en orden de presentación (el del menú: General, Mis avisos, Mis comercios, Mis servicios, Admin). */
export const LDC_ROLE_KEYS = [
  "usuario",
  "avisador",
  "comercio",
  "servicio",
  "admin",
] as const satisfies readonly LDCRole[];

export interface LDCRoleConfig {
  /** Clave del rol */
  role: LDCAccessRole;
  /** Nombre visible del rol */
  label: string;
  /** Título (h1) del login */
  title: string;
  /** Texto bajo el título */
  description: string;
  /** Placeholder genérico del campo email */
  emailPlaceholder: string;
  /** Ruta del login de este rol */
  loginPath: string;
  /** Registro público (`/registro`); el administrador no tiene: lo crea el seed */
  registerPath?: string;
  /** Título de la tarjeta del rol en el repartidor `/ingresar` */
  optionTitle: string;
  /** Texto de la tarjeta del rol en el repartidor `/ingresar` */
  optionDescription: string;
}

export const LDC_ROLES = {
  admin: {
    role: "admin",
    label: LDC_ROLE_META.admin.label,
    title: "Panel de administración",
    description:
      "Gestiona categorías, ciudades, comercios, avisos, propiedades y noticias de la guía.",
    emailPlaceholder: "nombre@laguiadechile.cl",
    loginPath: "/dashboard/login",
    optionTitle: "Administrador",
    optionDescription: "Equipo de La Guía de Chile.",
  },
  comercio: {
    role: "comercio",
    label: LDC_ROLE_META.comercio.label,
    title: "Ingresa a tu negocio",
    description: "Administra tu ficha y tus avisos y propiedades publicados en la guía.",
    emailPlaceholder: "contacto@tucomercio.cl",
    loginPath: "/ingresar/comercio",
    registerPath: "/registro",
    optionTitle: "Comercio o anunciante",
    optionDescription: "Gestiona tu ficha, tus avisos y tus propiedades.",
  },
  usuario: {
    role: "usuario",
    label: LDC_ROLE_META.usuario.label,
    title: "Ingresa a tu cuenta",
    description: "Guarda tus comercios favoritos y sigue los avisos que te interesan.",
    emailPlaceholder: "tu@correo.cl",
    loginPath: "/ingresar/usuario",
    registerPath: "/registro",
    optionTitle: "Usuario",
    optionDescription: "Favoritos y avisos que sigues.",
  },
} as const satisfies Record<LDCAccessRole, LDCRoleConfig>;

/**
 * Registro público (`/registro`): una sola página, sin elegir rol. Toda cuenta nueva nace como
 * usuario; suma avisador, comercio o servicio desde su panel al publicar.
 */
export const LDC_REGISTER = {
  path: "/registro",
  /** Rol con que nace la cuenta: da el ícono del encabezado */
  role: "usuario",
  title: "Crea tu cuenta",
  description: "Guarda tus favoritos y publica tu comercio o servicio cuando quieras.",
} as const satisfies { path: string; role: LDCAccessRole; title: string; description: string };

/**
 * Roles con login público en `/ingresar/[rol]`. El administrador queda fuera:
 * entra por `/dashboard/login`, sin enlace público.
 */
export const LDC_PUBLIC_ROLE_KEYS = ["comercio", "usuario"] as const satisfies readonly LDCAccessRole[];

/** Rol con login público. */
export type LDCPublicRole = (typeof LDC_PUBLIC_ROLE_KEYS)[number];

/** Indica si un string (p. ej. el segmento `[rol]`) es un rol con login público. */
export function isLDCPublicRole(value: string): value is LDCPublicRole {
  return (LDC_PUBLIC_ROLE_KEYS as readonly string[]).includes(value);
}

/** Indica si un string es un rol válido. */
export function isLDCRole(value: string): value is LDCRole {
  return Object.hasOwn(LDC_ROLE_META, value);
}

/** Indica si la cuenta tiene alguno de los roles. */
export function hasAnyRole(roles: readonly LDCRole[], wanted: readonly LDCRole[]): boolean {
  return wanted.some((r) => roles.includes(r));
}

/** Configuración del login de un rol. */
export function getRoleConfig(role: LDCAccessRole): LDCRoleConfig {
  return LDC_ROLES[role];
}
