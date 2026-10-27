# Templates

Esqueletos de página: deciden qué organisms van en cada zona y en qué orden.

**Puede importar:** cualquier nivel (organisms, molecules, atoms, `ui`) y `@/lib`/`@/interfaces`,
pero **sin datos**: un template no hace fetch ni importa `@/lib/api/*`; recibe todo por props
desde la página de `app/`, que llama a la DAL. Son siempre Server Components (sin `"use client"`);
lo interactivo va en los organisms cliente que contienen.

Cada template vive en `ldc-x/` con `ldc-x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/templates/ldc-x`.

## Componentes

- **ldc-home-template** (`LDCHomeTemplate`): home con hero, destacados y recientes; recibe los datos desde `app/(main)/page.tsx`.
- **ldc-listing-page-template** (`LDCListingPageTemplate`): páginas de listado con el hero arriba y el contenido en `<main>`.
- **ldc-detail-template** (`LDCDetailTemplate`): fichas de detalle con hero, columna principal, sidebar y relacionados según `kind`.
- **ldc-city-template** (`LDCCityTemplate`): ficha de ciudad con clima y farmacia, comercios, propiedades, Wikipedia y avisos.
- **ldc-about-template** (`LDCAboutTemplate`): página «Nosotros».
- **ldc-contact-template** (`LDCContactTemplate`): página «Contacto» con formulario y redes.
- **ldc-coming-soon-template** (`LDCComingSoonTemplate`): mensaje «Próximamente» de las páginas sin contenido.
- **ldc-under-construction-template** (`LDCUnderConstructionTemplate`): página «En construcción» (el marco lo pone `app/en-construccion/layout.tsx`).
- **ldc-dashboard-page-template** (`LDCDashboardPageTemplate`): páginas del panel con encabezado y contenido.
- **ldc-auth-template** (`LDCAuthTemplate`): páginas de acceso: barra con logo y tema, el formulario como hijo y una portada opcional (`aside`) desde `lg`.
