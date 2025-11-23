/**
 * Navigation configuration for La Guía de Chile
 * Defines the main navigation items used in the header and other navigation components
 */

export interface NavigationItem {
  label: string;
  href: string;
}

export const navigationItems: NavigationItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Comercios", href: "/comercios" },
  { label: "Servicios", href: "/servicios" },
  { label: "Avisos", href: "/avisos" },
  { label: "Propiedades", href: "/propiedades" },
  { label: "Noticias", href: "/noticias" },
  { label: "Contacto", href: "/contacto" },
];
