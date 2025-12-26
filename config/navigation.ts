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

/**
 * Utility navigation items for footer
 * Legal and help pages
 */
export const utilityNavigationItems: NavigationItem[] = [
  { label: "Políticas de privacidad", href: "/politicas-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
];
