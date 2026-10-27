# Organisms

Secciones completas de la interfaz armadas con molecules y atoms: header, footer, heros,
formularios, grillas paginadas y bloques del panel.

**Puede importar:** otros organisms, molecules, atoms y `@/components/ui` (que cuenta como átomo),
además de `@/lib`, `@/interfaces`, `@/hooks` y `@/config`. Nunca templates. Los datos llegan por
props: un client component no importa `@/lib/api/*`.

Cada organismo vive en `ldc-x/` con `ldc-x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/organisms/ldc-x`. «Cliente» marca los que llevan `"use client"`.

## Componentes

### Sitio público
- **ldc-header** (`LDCHeader`): header fijo con logo, navegación, cambio de tema, botón de publicar y menú móvil.
- **ldc-mobile-menu** (`LDCMobileMenu`): botón hamburguesa y panel lateral de navegación en móvil. Cliente.
- **ldc-footer** (`LDCFooter`): pie de página con logo, enlaces, redes y apps.
- **ldc-hero** (`LDCHero`): hero de la home con carrusel de fondo, titular y buscador. Cliente.
- **ldc-search-form** (`LDCSearchForm`): buscador con texto, categoría y ciudad (React Hook Form + Zod). Cliente.
- **ldc-page-hero** (`LDCPageHero`): carcasa común de los heroes de listado y de detalle.
- **ldc-listings-page-hero** (`LDCListingsPageHero`): hero de las páginas de listado con migas, título e ícono.
- **ldc-under-construction** (`LDCUnderConstruction`): bloque central de «En construcción» con logo, título y redes. Cliente.

### Home
- **ldc-featured-categories** (`LDCFeaturedCategories`): grilla de categorías destacadas.
- **ldc-featured-cities** (`LDCFeaturedCities`): grilla de ciudades destacadas.
- **ldc-featured-listings** (`LDCFeaturedListings`): grilla de comercios y servicios destacados.
- **ldc-recent-listings** (`LDCRecentListings`): comercios y servicios recientes.
- **ldc-recent-properties** (`LDCRecentProperties`): propiedades recientes.
- **ldc-recent-classifieds** (`LDCRecentClassifieds`): avisos clasificados recientes.
- **ldc-recent-posts** (`LDCRecentPosts`): noticias recientes.

### Nosotros y contacto
- **ldc-about-hero** (`LDCAboutHero`): hero de «Nosotros».
- **ldc-about-what** (`LDCAboutWhat`): sección «Qué es La Guía de Chile».
- **ldc-about-why** (`LDCAboutWhy`): sección «Por qué La Guía de Chile».
- **ldc-contact-form** (`LDCContactForm`): formulario de contacto con validación y estado de envío. Cliente.

### Listados paginados
- **ldc-load-more-grid** (`LDCLoadMoreGrid`): grilla con animación de entrada y botón «Cargar más». Cliente.
- **ldc-paginated-listings-grid** (`LDCPaginatedListingsGrid`): grilla paginada de comercios o servicios. Cliente.
- **ldc-paginated-properties-grid** (`LDCPaginatedPropertiesGrid`): grilla paginada de propiedades. Cliente.
- **ldc-paginated-classifieds-list** (`LDCPaginatedClassifiedsList`): lista paginada de avisos. Cliente.
- **ldc-paginated-news-grid** (`LDCPaginatedNewsGrid`): grilla paginada de noticias. Cliente.

### Fichas de detalle
- **ldc-listing-detail-hero** (`LDCListingDetailHero`): hero de la ficha de comercio o servicio.
- **ldc-listing-info** (`LDCListingInfo`): contacto, formulario y horario de un comercio o servicio. Cliente.
- **ldc-property-detail-hero** (`LDCPropertyDetailHero`): hero de la ficha de propiedad.
- **ldc-classified-detail-hero** (`LDCClassifiedDetailHero`): hero de la ficha de aviso.
- **ldc-news-article-hero** (`LDCNewsArticleHero`): hero de la ficha de noticia con autor, fecha y lectura.
- **ldc-related-section** (`LDCRelatedSection`): franja de contenido relacionado al pie de una ficha.

### Ciudad
- **ldc-weather-widget** (`LDCWeatherWidget`): clima de la ciudad o su esqueleto (datos de `useCityWeather`).
- **ldc-pharmacy-banner** (`LDCPharmacyBanner`): farmacia de turno o su esqueleto (datos de `useOnDutyPharmacy`).
- **ldc-wikipedia-section** (`LDCWikipediaSection`): resumen, imagen y enlace del artículo de Wikipedia de la ciudad.

### Panel (dashboard)
- **ldc-dashboard-header** (`LDCDashboardHeader`): barra superior del panel con migas de pan. Cliente.
- **ldc-dashboard-sidebar** (`LDCDashboardSidebar`): menú lateral del panel con el usuario. Cliente.
- **ldc-login-form** (`LDCLoginForm`): formulario de inicio de sesión por rol (`lib/auth/roles.ts`) con `LDCFormField` y error en línea. Cliente.
- **ldc-auth-cover** (`LDCAuthCover`): portada del acceso desde `lg`: comercio destacado y conteos de la guía.
- **ldc-role-gateway** (`LDCRoleGateway`): repartidor de `/ingresar`: tarjetas de los roles con login público y nota sin registro.
- **ldc-category-form** (`LDCCategoryForm`): formulario para crear o editar una categoría. Cliente.
- **ldc-resource-table** (`LDCResourceTable`): tabla genérica de recursos con columna de acciones opcional.
- **ldc-resource-row-actions** (`LDCResourceRowActions`): menú de editar y eliminar de una fila, con confirmación. Cliente.
