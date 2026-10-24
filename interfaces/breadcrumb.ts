/** Un paso de la ruta de migas de pan. */
export interface IBreadcrumbItem {
  /** Texto visible */
  label: string;
  /** Ruta del enlace (cadena vacía para la página actual) */
  href: string;
}
