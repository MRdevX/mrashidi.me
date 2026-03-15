# Project context for AI agents

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind v4, shadcn/ui (new-york, RSC), CVA, clsx/tailwind-merge
- **Lint & format:** Biome only (no ESLint or Prettier)
- **Tests:** Vitest (unit, `tests/unit/`), Playwright (E2E, `tests/e2e/`)
- **Other:** Sentry, Vercel (Analytics, Speed Insights, Blob), PWA (next-pwa)

## Path aliases

Use these in imports (from `tsconfig.json`):

- `@/` → `src/`
- `@app/*` → `src/app/*`
- `@components/*` → `src/components/*`
- `@features/*` → `src/features/*`
- `@lib/*` → `src/lib/*`
- `@server/*` → `src/services/*`
- `@types/*` → `src/types/*`

Prefer path aliases over relative paths for clarity.

## Tooling

- **Lint/format:** `pnpm check` (lint + format); `pnpm check:fix` or `pnpm check --write` to fix. Use Biome only.
- **Unit tests:** `pnpm test`, `pnpm test:run`, `pnpm test:coverage`, `pnpm test:watch`
- **E2E:** `pnpm test:e2e`, `pnpm test:e2e:ui`, `pnpm test:e2e:debug`
- **Dev:** `pnpm dev` (Turbopack)

When touching code, run `pnpm check` and relevant tests. Do not introduce ESLint or Prettier; keep Biome as the single linter and formatter.
