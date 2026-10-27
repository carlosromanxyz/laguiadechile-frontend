# Atoms

Piezas mínimas de la interfaz: un elemento con su estilo, sin componer otros niveles.

**Puede importar:** `@/components/ui`, `@/lib`, `@/interfaces` y otros atoms. Nada de molecules,
organisms ni templates.

Cada átomo vive en `ldc-x/` con `ldc-x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/atoms/ldc-x`. «Cliente» marca los que llevan `"use client"`.

## Componentes

- **ldc-avatar** (`LDCAvatar`, `getInitials`): avatar con foto o iniciales, enmarcado o suelto.
- **ldc-badge** (`LDCBadge`): etiqueta con las variantes de las cards (categoría, destacado, nuevo, tipo de aviso…).
- **ldc-card-surface** (`LDCCardSurface`): carcasa común de las cards (borde, fondo, sombra y hover).
- **ldc-category-icon** (`LDCCategoryIcon`): ícono de categoría (react-icons) sobre fondo de color. Cliente.
- **ldc-container** (`LDCContainer`): contenedor centrado con ancho máximo y padding horizontal.
- **ldc-cta-button** (`LDCCTAButton`): botón de llamada a la acción; enlace si recibe `href`, botón si no (`type="submit"`, `loading` y `variant="contrast"` con texto negro).
- **ldc-decorative-shapes** (`LDCDecorativeShape`, `LDCDecorativeLayer`): manchas, acentos y resplandores de las secciones de «Nosotros».
- **ldc-details-link** (`LDCDetailsLink`): enlace «Ver detalles» con flecha de las cards.
- **ldc-featured-ribbon** (`LDCFeaturedRibbon`): trama diagonal de destacado sobre la imagen de una card.
- **ldc-footer-link** (`LDCFooterLink`): enlace del pie de página.
- **ldc-footer-title** (`LDCFooterTitle`): título de una columna del pie de página.
- **ldc-hero-text** (`LDCHeroText`): titular del hero de la home con palabras resaltadas y animadas.
- **ldc-load-more-button** (`LDCLoadMoreButton`): botón «Cargar más» con estado de carga. Cliente.
- **ldc-location-link** (`LDCLocationLink`): ícono y enlace a la ciudad (variantes `default`, `compact` y `split`).
- **ldc-logo** (`LDCLogo`): logo de La Guía de Chile (isotipo y texto).
- **ldc-nav-link** (`LDCNavLink`): enlace de la navegación principal con estado activo. Cliente.
- **ldc-number-badge** (`LDCNumberBadge`): círculo con un número, en degradado o contorno.
- **ldc-panel** (`LDCPanel`): carcasa de panel (`bg-card rounded-xl border p-5`) de sidebars y fichas.
- **ldc-password-input** (`LDCPasswordInput`): campo de contraseña con botón para mostrarla u ocultarla. Cliente.
- **ldc-property-image-carousel** (`LDCPropertyImageCarousel`): carrusel de fotos de la card de propiedad. Cliente.
- **ldc-role-icon** (`LDCRoleIcon`): ícono de un rol (`lib/auth/roles.ts`) en un círculo con su color de marca.
- **ldc-scroll-indicator** (`LDCScrollIndicator`): indicador animado para bajar al pie del hero. Cliente.
- **ldc-section** (`LDCSection`): sección de página con contenedor, padding y espaciado comunes.
- **ldc-social-network-icon** (`LDCSocialNetworkIcon`): ícono de red social en un círculo con hover.
- **ldc-switch** (`LDCSwitch`): switch de Radix con los colores de la marca. Cliente.
