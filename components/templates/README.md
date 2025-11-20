# Templates

Layouts que definen la estructura de las páginas. Combinan organisms para crear esqueletos de páginas reutilizables.

## Propósito

- Definen la estructura y disposición de las páginas
- Combinan organisms en layouts específicos
- Proporcionan slots para contenido dinámico
- Mantienen consistencia visual entre páginas

## Componentes

- **main-layout/**: Layout principal del sitio (header + content + footer)
- **search-layout/**: Layout para páginas de búsqueda (sidebar + resultados)
- **business-detail-layout/**: Layout para páginas de detalle de empresa

## Convenciones

Cada componente debe tener:
```
layout-name/
├── layout-name.tsx
├── index.ts
```
