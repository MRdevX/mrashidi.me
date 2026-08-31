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
- **Unit tests:** `pnpm test` (watch), `pnpm test:run`, `pnpm test:coverage`, `pnpm test:ui`
- **E2E:** `pnpm test:e2e`, `pnpm test:e2e:ui`, `pnpm test:e2e:debug`
- **Dev:** `pnpm dev` (Turbopack)

When touching code, run `pnpm check` and relevant tests. Do not introduce ESLint or Prettier; keep Biome as the single linter and formatter.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
