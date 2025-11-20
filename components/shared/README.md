# Shared Components

Componentes compartidos que no encajan en la metodología Atomic Design estricta. Incluye providers, wrappers y utilidades.

## Propósito

- Componentes utilitarios
- Providers de contexto
- Error boundaries
- HOCs y wrappers

## Componentes

- **providers/**: Context providers (theme, auth, etc.)
- **error-boundary/**: Manejo de errores de React

## Convenciones

Cada componente debe tener:
```
component-name/
├── component-name.tsx
├── index.ts
```
