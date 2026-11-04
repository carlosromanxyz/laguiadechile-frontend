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
- **ldc-contact-form** (`LDCContactForm`): formulario de contacto que envía a `POST /contact` por server action, con estados (enviando, éxito, error, throttle) y honeypot oculto. Cliente.

### Listados paginados
- **ldc-load-more-grid** (`LDCLoadMoreGrid`): grilla con animación de entrada y botón «Cargar más». Cliente.
- **ldc-paginated-listings-grid** (`LDCPaginatedListingsGrid`): grilla paginada de comercios o servicios. Cliente.
- **ldc-paginated-properties-grid** (`LDCPaginatedPropertiesGrid`): grilla paginada de propiedades. Cliente.
- **ldc-paginated-events-grid** (`LDCPaginatedEventsGrid`): grilla de eventos con filtros arriba, «Cargar más» y estado vacío. Cliente.
- **ldc-event-filters** (`LDCEventFilters`): filtros de `/eventos` (cuándo, ciudad y categoría) en la URL. Cliente.
- **ldc-paginated-classifieds-list** (`LDCPaginatedClassifiedsList`): lista paginada de avisos. Cliente.
- **ldc-paginated-news-grid** (`LDCPaginatedNewsGrid`): grilla paginada de noticias. Cliente.

### Fichas de detalle
- **ldc-listing-detail-hero** (`LDCListingDetailHero`): hero de la ficha de comercio o servicio.
- **ldc-listing-info** (`LDCListingInfo`): contacto, formulario y horario de un comercio o servicio. Cliente.
- **ldc-property-detail-hero** (`LDCPropertyDetailHero`): hero de la ficha de propiedad.
- **ldc-classified-detail-hero** (`LDCClassifiedDetailHero`): hero de la ficha de aviso.
- **ldc-classified-form** (`LDCClassifiedForm`): formulario del aviso clasificado del panel (crear y editar), con estado, envío a revisión y vista previa. Cliente.
- **ldc-event-detail-hero** (`LDCEventDetailHero`): hero del detalle de evento (categoría, cuándo, lugar, compartir y favorito).
- **ldc-event-form** (`LDCEventForm`): formulario del evento del panel (crear, duplicar y editar), con estado, envío a revisión y vista previa en `LDCEventCard`. Cliente.
- **ldc-news-article-hero** (`LDCNewsArticleHero`): hero de la ficha de noticia con autor, fecha y lectura.
- **ldc-related-section** (`LDCRelatedSection`): franja de contenido relacionado al pie de una ficha.

### Ciudad
- **ldc-weather-widget** (`LDCWeatherWidget`): clima de la ciudad o su esqueleto (datos de `useCityWeather`).
- **ldc-pharmacy-banner** (`LDCPharmacyBanner`): farmacia de turno o su esqueleto (datos de `useOnDutyPharmacy`).
- **ldc-wikipedia-section** (`LDCWikipediaSection`): resumen, imagen y enlace del artículo de Wikipedia de la ciudad.

### Panel (dashboard)
- **ldc-dashboard-header** (`LDCDashboardHeader`): barra superior del panel con migas de pan desde `/dashboard`. Cliente.
- **ldc-dashboard-sidebar** (`LDCDashboardSidebar`): menú lateral del panel con grupos según los roles de la cuenta, CTA «Publicar» y el usuario. Cliente.
- **ldc-publish-chooser** (`LDCPublishChooser`): «¿Qué quieres publicar?» del inicio del panel, una opción por tipo (aviso, comercio, servicio, evento).
- **ldc-login-form** (`LDCLoginForm`): formulario de inicio de sesión (`/api/auth/login`) para los tres roles, con `LDCFormField`, error en línea y enlace al registro; entra al inicio del panel (`/dashboard`). Cliente.
- **ldc-register-form** (`LDCRegisterForm`): formulario del registro público (`/registro`): nombre, email, contraseña, confirmación y términos; el 409 va en el campo email. Cliente.
- **ldc-auth-cover** (`LDCAuthCover`): portada del acceso desde `lg`: comercio destacado y conteos de la guía.
- **ldc-role-gateway** (`LDCRoleGateway`): repartidor de `/ingresar`: tarjetas de los roles con login público y enlace al registro.
- **ldc-category-form** (`LDCCategoryForm`): formulario para crear o editar una categoría. Cliente.
- **ldc-region-form** (`LDCRegionForm`) y **ldc-city-form** (`LDCCityForm`): alta y edición de una región o una ciudad del catálogo admin (la ciudad con región, imagen y marcas). Cliente.
- **ldc-news-form** (`LDCNewsForm`) y **ldc-property-form** (`LDCPropertyForm`): alta y edición de una noticia o una propiedad en página propia, por secciones, con subida de imágenes y `LDCFormSaveBar`. Cliente.
- **ldc-resource-table** (`LDCResourceTable`): tabla genérica de recursos con columna de acciones opcional (menú o `renderActions` con `actionsClassName`), tarjetas bajo `md` (`renderCard`), esqueleto (`loading`) y estado vacío (`emptyState`).
- **ldc-admin-publication-list** (`LDCAdminPublicationList`): listado admin de fichas: toolbar, tabla o tarjetas con `LDCPublicationStatusActions` y paginación. Cliente.
- **ldc-admin-catalog-list** (`LDCAdminCatalogList`): listado del catálogo admin (regiones, ciudades, noticias, propiedades): toolbar de búsqueda (y ciudad), la tabla que arma la página, esqueleto, vacíos y paginación. Cliente.
- **ldc-admin-contact-message-list** (`LDCAdminContactMessageList`): bandeja «Mensajes» del admin: toolbar (búsqueda y leídos / no leídos), tabla o tarjetas con `LDCContactMessageActions` y paginación. Cliente.
- **ldc-resource-row-actions** (`LDCResourceRowActions`): menú de editar, archivar o desarchivar (`archive`) y eliminar de una fila, con confirmación. Cliente.
