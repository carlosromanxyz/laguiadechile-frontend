import {
  Folder,
  Home,
  LayoutDashboard,
  Map,
  MapPin,
  Newspaper,
  Store,
  Tags,
  type LucideIcon,
} from "lucide-react";

export interface IDashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface IDashboardNavGroup {
  label: string;
  items: IDashboardNavItem[];
}

export const dashboardNavigation: IDashboardNavGroup[] = [
  {
    label: "General",
    items: [
      { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/dashboard/listings", label: "Comercios", icon: Store },
      { href: "/dashboard/classifieds", label: "Avisos", icon: Tags },
      { href: "/dashboard/properties", label: "Propiedades", icon: Home },
      { href: "/dashboard/news", label: "Noticias", icon: Newspaper },
    ],
  },
  {
    label: "Catálogos",
    items: [
      { href: "/dashboard/categories", label: "Categorías", icon: Folder },
      { href: "/dashboard/cities", label: "Ciudades", icon: MapPin },
      { href: "/dashboard/regions", label: "Regiones", icon: Map },
    ],
  },
];
