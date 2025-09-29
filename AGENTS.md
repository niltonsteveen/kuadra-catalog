# Repository Guidelines

## Estructura del proyecto y modulos
El codigo vive en `src/app`, organizado en grupos de rutas: `(marketing)` publica, `[tenant]` para catalogos por cliente, `design-system` para el playground de tokens y `api` para endpoints mock. Los componentes reutilizables residen en `src/components`, mientras `public` guarda imagenes y fuentes. La configuracion de estilos globales se concentra en `src/app/globals.css` y las rutinas de CI viven en `.github/workflows/ci.yml`.

## Comandos de construccion, pruebas y desarrollo
Trabaja siempre con pnpm (Corepack). Comandos clave:
- `pnpm install` instala dependencias o actualiza tras cambiar la version de Node.
- `pnpm dev` levanta desarrollo con Turbopack y recarga rapida.
- `pnpm build` genera el bundle productivo, igual que en CI.
- `pnpm start` sirve la build generada para validaciones locales.
- `pnpm lint` ejecuta ESLint segun `eslint.config.mjs`.
- `pnpm typecheck` valida tipos con `tsc` sin emitir.

## Estilo de codigo y convenciones
Usamos TypeScript con indentacion de dos espacios y comas finales. Componentes y hooks siguen `PascalCase` y `useCamelCase`; los segmentos de ruta van en kebab-case o corchetes cuando son dinamicos. Prefiere componentes de servidor y limita los client components agregando la directiva `use client` cuando sea necesario. Las clases de Tailwind deben reutilizar los tokens definidos en `globals.css` en lugar de valores crudos. Ejecuta ESLint con autofix antes de subir cambios.

## Lineamientos de pruebas
Aun no existe runner automatizado, asi que cada cambio debe pasar `pnpm lint`, `pnpm typecheck` y un recorrido manual por `/`, `/design-system` y rutas de tenant. Si agregas pruebas, usa Vitest con React Testing Library, coloca los archivos `*.test.tsx` junto al modulo validado y registra cualquier script nuevo en `package.json`. Mockea datos mediante `src/app/api/mock-config/route.ts` para cubrir variaciones de estilo y tema.

## Commits y pull requests
El historial sigue Conventional Commits (`feat(scope): detalle`, `fix: mensaje corto`) con verbos en imperativo. Agrupa cambios relacionados y evita commits ruidosos. En cada PR describe el objetivo, enlaza la incidencia o ticket, lista validaciones manuales ejecutadas (`pnpm build`, rutas revisadas) y adjunta capturas o gifs cuando hay cambios de UI. Comprueba que el flujo de CI finalice antes de pedir revision.

## Entorno y configuracion
Configura `.env.local` con `NEXT_PUBLIC_APP_URL` y `NEXT_PUBLIC_MOCK_CONFIG_URL`; agrega nuevas variables solo si son necesarias y nunca subas secretos. Para permitir nuevos origenes de imagenes, actualiza `next.config.ts` y limita los dominios al CDN esperado. Si el despliegue necesita ajustes adicionales, documentalos en la descripcion del PR.
