# Pages

Componentes de página completos que combinan templates con contenido y lógica específica.

## Propósito

- Representan páginas completas de la aplicación
- Combinan templates con datos específicos
- Contienen lógica de página (fetching, estado, etc.)
- Se conectan con Next.js App Router

## Componentes

- **home-page/**: Página de inicio
- **search-page/**: Página de búsqueda de empresas
- **business-detail-page/**: Página de detalle de empresa
- **contact-page/**: Página de contacto

## Convenciones

Cada componente debe tener:
```
page-name/
├── page-name.tsx
├── index.ts
```

**Nota**: Estos componentes son importados por las rutas de Next.js en `/app`.
