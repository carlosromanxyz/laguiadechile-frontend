/**
 * Configuración por rol de los accesos (login) de La Guía de Chile.
 *
 * Sin I/O ni React: se puede importar desde Server y Client Components.
 * El ícono va como nombre (string) para que no cruce un componente Lucide
 * de Server a Client; lo resuelve `LDCRoleIcon`.
 *
 * El rol real lo decide la cuenta (el `role` del JWT); esta configuración
 * solo da el contexto de cada login: textos, ícono, ruta y destino esperado.
 */

/** Roles con acceso propio. */
export type LDCRole = "admin" | "comercio" | "usuario";

/** Nombre del ícono Lucide de cada rol (lo resuelve `LDCRoleIcon`). */
export type LDCRoleIconName = "ShieldCheck" | "Store" | "UserRound";

export interface LDCRoleConfig {
  /** Clave del rol */
  role: LDCRole;
  /** Nombre visible del rol */
  label: string;
  /** Título (h1) del login */
  title: string;
  /** Texto bajo el título */
  description: string;
  /** Ícono Lucide del rol, por nombre */
  iconName: LDCRoleIconName;
  /** Placeholder genérico del campo email */
  emailPlaceholder: string;
  /** Ruta del login de este rol */
  loginPath: string;
  /** Destino tras iniciar sesión */
  redirectTo: string;
}

export const LDC_ROLES = {
  admin: {
    role: "admin",
    label: "Administrador",
    title: "Panel de administración",
    description:
      "Gestiona categorías, ciudades, comercios, avisos, propiedades y noticias de la guía.",
    iconName: "ShieldCheck",
    emailPlaceholder: "nombre@laguiadechile.cl",
    loginPath: "/dashboard/login",
    redirectTo: "/dashboard",
  },
  comercio: {
    role: "comercio",
    label: "Comercio",
    title: "Ingresa a tu negocio",
    description: "Administra tu ficha y tus avisos y propiedades publicados en la guía.",
    iconName: "Store",
    emailPlaceholder: "contacto@tucomercio.cl",
    loginPath: "/ingresar/comercio",
    redirectTo: "/dashboard/comercio",
  },
  usuario: {
    role: "usuario",
    label: "Usuario",
    title: "Ingresa a tu cuenta",
    description: "Guarda tus comercios favoritos y sigue los avisos que te interesan.",
    iconName: "UserRound",
    emailPlaceholder: "tu@correo.cl",
    loginPath: "/ingresar/usuario",
    redirectTo: "/dashboard/usuario",
  },
} as const satisfies Record<LDCRole, LDCRoleConfig>;

/** Roles en orden de presentación. */
export const LDC_ROLE_KEYS = ["admin", "comercio", "usuario"] as const satisfies readonly LDCRole[];

/** Indica si un string (p. ej. un segmento de ruta) es un rol válido. */
export function isLDCRole(value: string): value is LDCRole {
  return Object.hasOwn(LDC_ROLES, value);
}

/** Configuración de un rol. */
export function getRoleConfig(role: LDCRole): LDCRoleConfig {
  return LDC_ROLES[role];
}
