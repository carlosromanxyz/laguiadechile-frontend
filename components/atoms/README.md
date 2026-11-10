# Atoms

Piezas mínimas de la interfaz: un elemento con su estilo, sin componer otros niveles.

**Puede importar:** `@/components/ui`, `@/lib`, `@/interfaces` y otros atoms. Nada de molecules,
organisms ni templates.

Cada átomo vive en `ldc-x/` con `ldc-x.tsx` e `index.ts`, y se importa por la carpeta:
`@/components/atoms/ldc-x`. «Cliente» marca los que llevan `"use client"`.

## Componentes

- **ldc-avatar** (`LDCAvatar`, `getInitials`): avatar con foto o iniciales, enmarcado o suelto; `initials` opcional manda sobre las que salen de `name` (para personas usuarias, `getPersonInitials` de `lib/people`).
- **ldc-back-link** (`LDCBackLink`): enlace de vuelta con flecha, en píldora discreta.
- **ldc-badge** (`LDCBadge`): etiqueta con las variantes de las cards (categoría, destacado, nuevo, tipo de aviso…).
- **ldc-card-surface** (`LDCCardSurface`): carcasa común de las cards (borde, fondo, sombra y hover).
- **ldc-category-icon** (`LDCCategoryIcon`): ícono de categoría (react-icons) sobre fondo de color. Cliente.
- **ldc-container** (`LDCContainer`): contenedor centrado con ancho máximo y padding horizontal.
- **ldc-cta-button** (`LDCCTAButton`): botón de llamada a la acción; enlace si recibe `href`, botón si no (`type="submit"`, `loading` y `variant="contrast"` con texto negro).
- **ldc-decorative-shapes** (`LDCDecorativeShape`, `LDCAccentBars`): barra vertical de acento (`variant="bar"`) y fila de barras horizontales de las secciones de «Nosotros», de color plano y sin blur; la barra se congela con `LDCMotionPauseProvider` (`@/components/shared`). Cliente.
- **ldc-details-link** (`LDCDetailsLink`): enlace «Ver detalles» con flecha de las cards.
- **ldc-featured-ribbon** (`LDCFeaturedRibbon`): trama diagonal de destacado sobre la imagen de una card.
- **ldc-footer-link** (`LDCFooterLink`): enlace del pie de página.
- **ldc-footer-title** (`LDCFooterTitle`): título de una columna del pie de página.
- **ldc-hero-text** (`LDCHeroText`): titular del hero de la home con palabras resaltadas y animadas.
- **ldc-illustration-scene** (`LDCIllustrationScene`, `ldcSceneEntry`, `ldcSceneCycle`): `<svg>` animado con framer-motion que recibe del servidor los grupos (`data-e`, `data-l`, `data-lit`) y un guion de armado y ciclo; arma al entrar en vista, se pausa fuera de la vista o con `LDCMotionPauseProvider` y queda en reposo con `prefers-reduced-motion`. Lo usan las escenas de las ilustraciones de «Nosotros». Cliente.
- **ldc-load-more-button** (`LDCLoadMoreButton`): botón «Cargar más» con estado de carga. Cliente.
- **ldc-location-link** (`LDCLocationLink`): ícono y enlace a la ciudad (variantes `default`, `compact` y `split`).
- **ldc-logo** (`LDCLogo`): logo de La Guía de Chile (isotipo y texto).
- **ldc-metric-view** (`LDCMetricView`): isla sin DOM que manda el evento `view` de la ficha de un comercio o servicio al montar. Cliente.
- **ldc-motion-pause-button** (`LDCMotionPauseButton`): botón redondo de 44 px que pausa y reanuda las animaciones del `LDCMotionPauseProvider` (WCAG 2.2.2), con tono `overlay` (blanco translúcido sobre color), `ink` (del color de `--ldc-hero-ink`, la tinta del hero de Nosotros) o `surface` (sobre el fondo del tema); oculto con `prefers-reduced-motion`. Cliente.
- **ldc-nav-link** (`LDCNavLink`): enlace de la navegación principal con estado activo. Cliente.
- **ldc-number-badge** (`LDCNumberBadge`): círculo con un número, en color plano (`solid`, `bg-pink-strong`) o contorno.
- **ldc-panel** (`LDCPanel`): carcasa de panel (`bg-card rounded-xl border p-5`) de sidebars y fichas.
- **ldc-password-input** (`LDCPasswordInput`): campo de contraseña con botón para mostrarla u ocultarla. Cliente.
- **ldc-place-today** (`LDCPlaceToday`): qué pasa hoy en un lugar («Hoy 10:00 - 18:00 · …», «Cerrado hoy», «Hoy hay feria», «Próxima: viernes…»), con el día del navegador en hora de Chile (`useChileWeekday`) para no quedar atado a la caché ISR (CLGDC-207). Cliente.
- **ldc-place-type-chip** (`LDCPlaceTypeChip`): distintivo tintado del tipo de lugar (atractivo, servicio público, feria o mercado): token `--place-*` al 12 % sobre la card, ícono en el token y nombre en `text-foreground` (CLGDC-207).
- **ldc-place-type-icon** (`LDCPlaceTypeIcon`): ícono Lucide de un tipo de lugar elegido por `type` (`MountainSnow`, `Landmark`, `ShoppingBasket`), decorativo (CLGDC-207).
- **ldc-property-image-carousel** (`LDCPropertyImageCarousel`): carrusel de fotos de la card de propiedad. Cliente.
- **ldc-role-icon** (`LDCRoleIcon`): ícono de un rol (`LDC_ROLE_META` de `lib/auth/roles.ts`) en un círculo con su color, el mismo del badge `role-*`; tamaños `xs` 24, `sm` 36, `md` 40 y `lg` 48 px. Sin rol, basta `icon` (nombre de `LDC_ROLE_ICONS` y tono del DS), como la tile «Sugerir».
- **ldc-scroll-indicator** (`LDCScrollIndicator`): indicador animado para bajar al pie del hero. Cliente.
- **ldc-section** (`LDCSection`): sección de página con contenedor, padding y espaciado comunes.
- **ldc-skip-link** (`LDCSkipLink`): enlace «Saltar al contenido», visible al recibir el foco.
- **ldc-social-network-icon** (`LDCSocialNetworkIcon`): ícono de red social en un círculo con hover.
- **ldc-switch** (`LDCSwitch`): switch de Radix con los colores de la marca. Cliente.
- **ldc-time-switch** (`LDCTimeSwitch`): isla sin DOM que muestra una cosa u otra según la hora del navegador respecto de un instante (p. ej. «Terminado» de un evento), sin depender de la caché ISR. Cliente.
- **ldc-week-days** (`LDCWeekDays`): los siete días L M M J V S D con los de feria rellenos en `--place-market` y, en `lg`, el de hoy anillado; `role="img"` con el horario completo en `aria-label` (CLGDC-207). Cliente.
