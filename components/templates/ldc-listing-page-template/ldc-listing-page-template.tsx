import type { ReactNode } from "react";

export interface LDCListingPageTemplateProps {
  /** Hero de la página, normalmente `LDCListingsPageHero` ya renderizado */
  hero: ReactNode;
  /** Contenido principal (grilla, lista o secciones), va dentro de `<main>` */
  children: ReactNode;
}

/**
 * LDCListingPageTemplate - Estructura de las páginas de listado
 *
 * Server Component sin datos: hero arriba y el contenido dentro de `<main>`.
 * La página hace el fetch con la DAL y pasa el hero y el contenido ya
 * renderizados (así los íconos Lucide del hero no cruzan a un client component).
 *
 * @example
 * <LDCListingPageTemplate
 *   hero={<LDCListingsPageHero title="Comercios" breadcrumbs={breadcrumbs} icon={Store} />}
 * >
 *   <LDCPaginatedListingsGrid listings={commerces} … />
 * </LDCListingPageTemplate>
 */
export function LDCListingPageTemplate({
  hero,
  children,
}: LDCListingPageTemplateProps) {
  return (
    <>
      {hero}
      <main>{children}</main>
    </>
  );
}
