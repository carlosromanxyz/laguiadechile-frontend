# UI (shadcn/ui)

Componentes de shadcn/ui (estilo `new-york`, color base `neutral`), sin prefijo LDC. Cuentan como
átomos del sistema de diseño.

**Puede importar:** solo otros componentes de `ui`, `@/lib` y `@/hooks`. Nunca atoms, molecules,
organisms ni templates. Se agregan con `npx shadcn@latest add <componente>` y no se editan a mano:
si hace falta otra apariencia, se envuelve en un átomo `ldc-*`.

Se importan por archivo: `import { Button } from "@/components/ui/button"`.

## Componentes

- **accordion**: secciones que se expanden y contraen.
- **alert-dialog**: diálogo de confirmación modal.
- **avatar**: imagen de perfil con respaldo.
- **breadcrumb**: primitivas de migas de pan.
- **button**: botón con variantes y tamaños.
- **card**: tarjeta con encabezado, contenido y pie.
- **carousel**: carrusel sobre Embla.
- **command**: lista con búsqueda (cmdk), base del combobox.
- **dialog**: diálogo modal.
- **dropdown-menu**: menú desplegable.
- **field**: campo de formulario (etiqueta, descripción, error, grupos); lo envuelve `LDCFormField`.
- **form**: integración de React Hook Form (campo, etiqueta, mensaje).
- **input**: campo de texto.
- **label**: etiqueta de formulario.
- **popover**: contenido flotante anclado a un disparador.
- **select**: selector desplegable.
- **separator**: línea divisoria.
- **sheet**: panel lateral deslizable.
- **sidebar**: sidebar del panel con su provider y sus piezas.
- **skeleton**: bloque de carga.
- **sonner**: toasts (notificaciones).
- **switch**: interruptor de Radix.
- **table**: primitivas de tabla.
- **tabs**: pestañas.
- **textarea**: campo de texto multilínea.
- **tooltip**: ayuda emergente.

Documentación: https://ui.shadcn.com/docs/components
