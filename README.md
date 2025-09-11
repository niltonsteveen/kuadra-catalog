## Kuadra Catalog

Next.js 15 + React 19 + App Router + TypeScript + Tailwind v4, multi‑tenant y página pública de Design System.

### Requisitos
- Node 20/22
- pnpm (Corepack)

### Variables de entorno
Crear `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_CONFIG_URL=/api/mock-config
```

### Scripts
- `pnpm dev` — desarrollo (Turbopack)
- `pnpm build` — build prod (Turbopack)
- `pnpm start` — servidor prod
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript (no emite)

### Rutas principales
- `/` — Landing marketing
- `/design-system` — Página pública para visualizar/editar tokens (sin componentes reales)
- `/{tenant}` — Home del catálogo para un comercio (placeholders)
- `/api/mock-config` — Endpoint público con configuración mock (color, estilo, modo, tipografías)

### Estilos y theming
- Tailwind v4 importado en `globals.css` con tokens base; sin `tailwind.config.js`.
- Variantes personalizadas:
  - `dark:` (controlada por `.dark` en `<html>`)
  - `modern:` / `classic:` (controladas por `.modern` / `.classic` en `<html>`)
- Tokens por estilo:
  - `html.modern { --radius-md: 0.75rem }`
  - `html.classic { --radius-md: 0px }`
- Tipografías con `next/font/google`:
  - Manrope (`--kuadra-font-sans`) y IBM Plex Mono (`--kuadra-font-mono`)

### Preferencia de tema y estilo
- Script inline en `RootLayout` aplica:
  - Tema: `localStorage.theme ∈ {light, dark, auto}`; `auto` oscurece 19:00–06:59.
  - Estilo: `localStorage.style ∈ {moderno, clasico}` aplica `.modern/.classic` y `font-sans/mono`.
  - Overrides opcionales: `localStorage.primaryColor`, `localStorage.radius`.
- En el layout del tenant, si no hay preferencia local, se setea la del mock.

### Ejemplo de uso de variantes
```tsx
<div className="rounded-[var(--radius-md)] border modern:shadow-sm classic:shadow-none modern:px-6 classic:px-3">
  ...
</div>
```

### CI
GitHub Actions: `.github/workflows/ci.yml` ejecuta install, lint, typecheck y build en push/PR a `main`.
