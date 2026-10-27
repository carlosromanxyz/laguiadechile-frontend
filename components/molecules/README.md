# Molecules

Combinaciones pequeñas de atoms y `ui` con una sola función (una card, un menú, un encabezado).

**Puede importar:** atoms, `@/components/ui` y otras molecules (además de `@/lib`, `@/interfaces`,
`@/hooks` y `@/config`). Nada de organisms ni templates.

Cada molécula vive en `ldc-x/` con `ldc-x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/molecules/ldc-x`. «Cliente» marca las que llevan `"use client"`.

## Componentes

- **ldc-app-store-badges** (`LDCAppStoreBadges`): insignias de App Store y Google Play.
- **ldc-auth-card** (`LDCAuthCard`): bloque de acceso: tarjeta con `LDCLogo` y `LDCAuthHeader`, o sin tarjeta con `bare` (pantalla dividida, con enlace de vuelta opcional en `back`), y el formulario como hijo.
- **ldc-auth-header** (`LDCAuthHeader`): encabezado de acceso: ícono del rol, h1 de marca y descripción.
- **ldc-breadcrumbs** (`LDCBreadcrumbs`): migas de pan, en variante clara u oscura.
- **ldc-category-card** (`LDCCategoryCard`): card de categoría con ícono, nombre y conteo. Cliente.
- **ldc-city-card** (`LDCCityCard`): card de ciudad con imagen de fondo y conteo de publicaciones. Cliente.
- **ldc-classified-card** (`LDCClassifiedCard`): card horizontal de aviso clasificado. Cliente.
- **ldc-classified-seller** (`LDCClassifiedSeller`): caja del vendedor con botones de contacto en la ficha de aviso. Cliente.
- **ldc-combobox** (`LDCCombobox`): combobox con búsqueda (Command + Popover). Cliente.
- **ldc-contact-actions** (`LDCContactActions`): botones de contacto directo (WhatsApp, llamar, correo) que tengan datos.
- **ldc-contact-info** (`LDCContactInfo`): redes sociales de La Guía en la página de contacto.
- **ldc-empty-state** (`LDCEmptyState`): estado vacío con ícono, título y texto.
- **ldc-footer-nav-list** (`LDCFooterNavList`): lista de enlaces del pie dentro de un `<nav>` etiquetado.
- **ldc-footer-widget** (`LDCFooterWidget`): columna del pie de página con título opcional.
- **ldc-form-field** (`LDCFormField`): campo de React Hook Form sobre `Field` de shadcn (etiqueta, control y error). Cliente.
- **ldc-hero-slider** (`LDCHeroSlider`): carrusel automático de imágenes de fondo del hero. Cliente.
- **ldc-listing-card** (`LDCListingCard`): card de comercio o servicio. Cliente.
- **ldc-listing-gallery** (`LDCListingGallery`): galería de fotos en carrusel de las fichas. Cliente.
- **ldc-listing-map** (`LDCListingMap`): mapa de Google Maps embebido con la dirección.
- **ldc-listing-social-media** (`LDCListingSocialMedia`): redes sociales de un comercio o servicio.
- **ldc-nav-menu** (`LDCNavMenu`): navegación principal de escritorio del header.
- **ldc-news-author** (`LDCNewsAuthor`): caja del autor, fecha y tiempo de lectura en la ficha de noticia.
- **ldc-news-card** (`LDCNewsCard`): card de noticia. Cliente.
- **ldc-page-header** (`LDCPageHeader`): título, descripción y acciones de una página del panel.
- **ldc-price-box** (`LDCPriceBox`): caja de precio con la línea de publicación.
- **ldc-property-agent** (`LDCPropertyAgent`): caja del corredor o la agencia con botones de contacto en la ficha de propiedad. Cliente.
- **ldc-property-card** (`LDCPropertyCard`): card de propiedad con precio, características y ubicación. Cliente.
- **ldc-property-features** (`LDCPropertyFeatures`): grilla de superficie, dormitorios, baños y estacionamientos.
- **ldc-region-card** (`LDCRegionCard`): card de región con numeral romano y conteo de ciudades.
- **ldc-role-option** (`LDCRoleOption`): tarjeta-enlace de un tipo de cuenta con `LDCRoleIcon`, título, texto y chevron.
- **ldc-section-header** (`LDCSectionHeader`): encabezado de sección (variantes `section` y `compact`).
- **ldc-sidebar-item** (`LDCSidebarItem`): ítem del menú lateral del panel con estado activo. Cliente.
- **ldc-social-network-list** (`LDCSocialNetworkList`): fila de íconos de redes sociales de La Guía.
- **ldc-social-share-buttons** (`LDCSocialShareButtons`): botón de compartir (Web Share API o copia al portapapeles). Cliente.
- **ldc-stat-card** (`LDCStatCard`): tarjeta de métrica del panel.
- **ldc-theme-mode-toggler** (`LDCThemeModeToggler`): switch de tema claro/oscuro con íconos. Cliente.
- **ldc-user-menu** (`LDCUserMenu`): menú del usuario al pie del sidebar del panel. Cliente.
