import {
  ChartColumn,
  CirclePlus,
  Folder,
  Heart,
  Home,
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
  type LucideIcon,
} from "lucide-react";
import type { LDCRole } from "@/lib/auth/roles";

export interface IDashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Activo solo con la ruta exacta (el inicio de cada rol). */
  exact?: boolean;
}

export interface IDashboardNavGroup {
  label: string;
  items: IDashboardNavItem[];
}

/** Menú del panel por rol: mismo cascarón, distinta lista. */
export const dashboardNavigation: Record<LDCRole, IDashboardNavGroup[]> = {
  admin: [
    {
      label: "General",
      items: [
        { href: "/dashboard/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/admin/moderacion", label: "Moderación", icon: ShieldCheck },
      ],
    },
    {
      label: "Contenido",
      items: [
        { href: "/dashboard/admin/comercios", label: "Comercios", icon: Store },
        { href: "/dashboard/admin/avisos", label: "Avisos", icon: Tags },
        { href: "/dashboard/admin/propiedades", label: "Propiedades", icon: Home },
        { href: "/dashboard/admin/noticias", label: "Noticias", icon: Newspaper },
      ],
    },
    {
      label: "Catálogos",
      items: [
        { href: "/dashboard/admin/categorias", label: "Categorías", icon: Folder },
        { href: "/dashboard/admin/ciudades", label: "Ciudades", icon: MapPin },
        { href: "/dashboard/admin/regiones", label: "Regiones", icon: Map },
      ],
    },
    {
      label: "Cuentas",
      items: [{ href: "/dashboard/admin/usuarios", label: "Usuarios", icon: Users }],
    },
  ],
  comercio: [
    {
      label: "General",
      items: [
        { href: "/dashboard/comercio", label: "Inicio", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/comercio/estadisticas", label: "Estadísticas", icon: ChartColumn },
      ],
    },
    {
      label: "Mi negocio",
      items: [
        { href: "/dashboard/comercio/publicaciones", label: "Mis publicaciones", icon: Store },
        { href: "/dashboard/comercio/ficha", label: "Editar ficha", icon: Pencil },
        { href: "/dashboard/publicar", label: "Publicar otra ficha", icon: CirclePlus },
      ],
    },
    {
      label: "Cuenta",
      items: [{ href: "/dashboard/comercio/cuenta", label: "Perfil y cuenta", icon: User }],
    },
  ],
  usuario: [
    {
      label: "Mi cuenta",
      items: [
        { href: "/dashboard/usuario", label: "Inicio", icon: LayoutDashboard, exact: true },
        { href: "/dashboard/usuario/favoritos", label: "Favoritos", icon: Heart },
        { href: "/dashboard/usuario/avisos", label: "Mis avisos", icon: Tags },
        { href: "/dashboard/usuario/perfil", label: "Perfil", icon: User },
      ],
    },
  ],
};

/** CTA naranjo del sidebar por rol (el admin no tiene). */
export const dashboardRoleCta: Partial<Record<LDCRole, { label: string; href: string }>> = {
  comercio: { label: "Publicar", href: "/publicar" },
  usuario: { label: "Publicar aviso", href: "/publicar" },
};

/** Página de perfil de cada rol (enlace del menú de usuario). */
export const dashboardProfileHref: Partial<Record<LDCRole, string>> = {
  comercio: "/dashboard/comercio/cuenta",
  usuario: "/dashboard/usuario/perfil",
};
