import {
  ChartColumn,
  CirclePlus,
  Folder,
  Heart,
  Home,
  House,
  Inbox,
  LayoutDashboard,
  Map,
  MapPin,
  Newspaper,
  Pencil,
  ShieldCheck,
  Store,
  Tags,
  User,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { LDCRole } from "@/lib/auth/roles";

export interface IDashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Activo solo con la ruta exacta (el inicio del panel). */
  exact?: boolean;
}

export interface IDashboardNavGroup {
  label: string;
  /** Rol que muestra el grupo; sin él, lo ve toda cuenta. */
  requires?: LDCRole;
  items: IDashboardNavItem[];
}

/**
 * Ítems de las fichas: los mismos en «Mis comercios» y «Mis servicios» (las rutas
 * `/dashboard/comercio/*` sirven a los dos roles). Cada grupo suma `?tipo=` a sus enlaces: así la
 * página filtra por tipo y el menú marca solo el ítem del grupo actual.
 */
function listingItems(tipo: "comercio" | "servicio"): IDashboardNavItem[] {
  return [
    { href: `/dashboard/comercio/publicaciones?tipo=${tipo}`, label: "Mis fichas", icon: Store },
    { href: `/dashboard/comercio/ficha?tipo=${tipo}`, label: "Editar ficha", icon: Pencil },
    { href: `/dashboard/comercio/estadisticas?tipo=${tipo}`, label: "Estadísticas", icon: ChartColumn },
  ];
}

/**
 * Menú del panel: un solo menú con grupos apilados según los roles de la cuenta (diseño A1 de
 * CLGDC-113), en este orden: General, Mis avisos, Mis propiedades (CLGDC-164), Mis comercios,
 * Mis servicios y Admin.
 */
export const dashboardNavigation: IDashboardNavGroup[] = [
  {
    label: "General",
    items: [
      { href: "/dashboard", label: "Inicio", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/usuario/favoritos", label: "Favoritos", icon: Heart },
      { href: "/dashboard/perfil", label: "Perfil", icon: User },
    ],
  },
  {
    label: "Mis avisos",
    requires: "avisador",
    items: [
      { href: "/dashboard/avisos", label: "Mis avisos", icon: Tags },
      // Formulario de aviso: CLGDC-125.
      { href: "/dashboard/avisos/nuevo", label: "Publicar aviso", icon: CirclePlus },
    ],
  },
  // CLGDC-164: propiedades del dueño (rol propietario).
  {
    label: "Mis propiedades",
    requires: "propietario",
    items: [
      { href: "/dashboard/propiedades", label: "Mis propiedades", icon: House },
      { href: "/dashboard/propiedades/nueva", label: "Publicar propiedad", icon: CirclePlus },
    ],
  },
  { label: "Mis comercios", requires: "comercio", items: listingItems("comercio") },
  { label: "Mis servicios", requires: "servicio", items: listingItems("servicio") },
  {
    label: "Admin",
    requires: "admin",
    items: [
      { href: "/dashboard/admin/moderacion", label: "Moderación", icon: ShieldCheck },
      { href: "/dashboard/admin/comercios", label: "Comercios", icon: Store },
      { href: "/dashboard/admin/servicios", label: "Servicios", icon: Wrench },
      { href: "/dashboard/admin/avisos", label: "Avisos", icon: Tags },
      { href: "/dashboard/admin/propiedades", label: "Propiedades", icon: Home },
      { href: "/dashboard/admin/noticias", label: "Noticias", icon: Newspaper },
      { href: "/dashboard/admin/categorias", label: "Categorías", icon: Folder },
      { href: "/dashboard/admin/ciudades", label: "Ciudades", icon: MapPin },
      { href: "/dashboard/admin/regiones", label: "Regiones", icon: Map },
      { href: "/dashboard/admin/usuarios", label: "Usuarios", icon: Users },
      { href: "/dashboard/admin/mensajes", label: "Mensajes", icon: Inbox },
    ],
  },
];

/** Grupos del menú que ve una cuenta con estos roles. */
export function getDashboardNavigation(roles: readonly LDCRole[]): IDashboardNavGroup[] {
  return dashboardNavigation.filter((g) => !g.requires || roles.includes(g.requires));
}

/** Roles que pueden publicar una ficha en `/dashboard/publicar` (`POST /me/listings`). */
export const DASHBOARD_PUBLISH_ROLES = ["usuario", "comercio", "servicio"] as const satisfies readonly LDCRole[];

/**
 * CTA único «Publicar» del panel: va en la barra superior (`LDCDashboardHeader`) de todas las
 * páginas, al selector de `/dashboard/publicar`. Lo ven las cuentas que pueden publicar (un admin
 * sin otro rol, no).
 */
export const dashboardPublishCta = { label: "Publicar", href: "/dashboard/publicar" } as const;

/** Página de perfil de toda cuenta (enlace del menú de usuario; CLGDC-155). */
export const dashboardProfileHref = "/dashboard/perfil";
