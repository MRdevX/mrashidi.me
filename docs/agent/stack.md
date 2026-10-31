# Stack

Before using an API, read the official docs for the version pinned here (house rules §4,
[DR-0001](../decisions/0001-adopt-shared-house-rules.md)). Versions come from each workspace's `package.json` (the site: `apps/web/package.json`);
when you bump a major or minor, update the row in the same PR.

| Library | Version | Official docs | House conventions |
| ------- | ------- | ------------- | ----------------- |
| Turborepo | 2.11 | [turborepo.com/docs](https://turborepo.com/docs) | Tasks in root `turbo.json`. A package-level task override replaces the root one, so it re-declares `dependsOn: ["^build"]`. Workspaces are `apps/*` and `packages/*` ([DR-0005](../decisions/0005-turborepo-web-on-vercel-api-on-workers.md)). |
| Terraform | 1.17 | [developer.hashicorp.com/terraform/docs](https://developer.hashicorp.com/terraform/docs) | `infra/`, version in `infra/.terraform-version`. State in R2 through the S3 backend. Commit `.terraform.lock.hcl` with `linux_amd64` and `darwin_arm64` hashes (`terraform providers lock`). |
| Terraform providers | cloudflare 5.28, vercel 5.24, github 6.13, onepassword 3.4 | [registry.terraform.io](https://registry.terraform.io/) | Import existing resources with `import` blocks; never apply an import whose plan shows changes. |
| Hono | 4.13 | [hono.dev/docs](https://hono.dev/docs/) | `apps/api` only. One composition root (`src/app.ts`); per-route middleware, not router-wide `use()`. |
| Drizzle ORM / Kit | 0.45 / 0.31 | [orm.drizzle.team/docs](https://orm.drizzle.team/docs/get-started/d1-new) | D1 (SQLite) with `casing: "snake_case"`. Kit only generates migrations; Wrangler applies them. `drizzle-orm` is hoisted in `pnpm-workspace.yaml` because Kit imports it undeclared. |
| Wrangler | 4.153 | [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler/) | `apps/api/wrangler.toml`. `compatibility_date` must not be newer than the workerd in `@cloudflare/vitest-pool-workers`, or Worker tests fail to start. |
| Workers Vitest pool | 0.23 | [developers.cloudflare.com/workers/testing/vitest-integration](https://developers.cloudflare.com/workers/testing/vitest-integration/) | Needs Vitest 4, so `apps/api` pins `vitest@^4` instead of the catalog's Vitest 5. |
| Next.js | 16.4 | [nextjs.org/docs](https://nextjs.org/docs) · local `apps/web/node_modules/next/dist/docs/` | App Router. Route files in `apps/web/src/app/` stay thin and compose a feature from `apps/web/src/features/` ([DR-0002](../decisions/0002-feature-slices.md)). Server components by default; `"use client"` only for hooks, browser APIs, or handlers. Caching uses the previous model (no `cacheComponents`): content fetches carry `next: { tags: ["content"], revalidate }` and `revalidateTag("content", "max")` refreshes them. |
| React | 19.3 | [react.dev](https://react.dev/reference/react) | Function components only. Derive during render; effects only to sync with something outside React. |
| TypeScript | 7.0 | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | Strict. Import through the path aliases in `AGENTS.md`. |
| Tailwind CSS | 4.3 | [tailwindcss.com/docs](https://tailwindcss.com/docs) | Theme tokens in `apps/web/src/styles/variables.css` and `theme.css`. Orange fills, borders and rings use `primary`; orange text uses `brand-text`, which meets 4.5:1 in both themes. Don't use Tailwind's `orange-400…600` for brand colour. Fonts come from `next/font` in `apps/web/src/lib/fonts.ts`, mapped to `font-sans`, `font-albert`, `font-terminal` and `font-cyberpunk` in `theme.css`. Variants with CVA, class merging with `cn` from `@lib/utils`. |
| shadcn/ui | new-york, RSC | [ui.shadcn.com/docs](https://ui.shadcn.com/docs) | Primitives in `apps/web/src/components/ui/`; config in `components.json`. |
| Biome | 2.6 | [biomejs.dev](https://biomejs.dev/reference/configuration/) | The only linter and formatter ([DR-0003](../decisions/0003-biome-only.md)). `pnpm check` / `pnpm check:fix`. |
| Vercel AI SDK (`ai`, `@ai-sdk/react`) | 7.0 / 4.0 | [ai-sdk.dev/docs](https://ai-sdk.dev/docs/introduction) | Ask MR only. Model id from `ASK_MR_MODEL` through the AI Gateway ([DR-0004](../decisions/0004-ask-mr-grounded-public-knowledge.md)). |
| Upstash Redis / Ratelimit | 1.39 / 2.2 | [upstash.com/docs/redis](https://upstash.com/docs/redis/overall/getstarted) | Rate limits for contact, resume, and Ask MR. Falls back to in-memory when Redis is not configured. |
| Zod | 4.6 | [zod.dev](https://zod.dev) | Zod 4 API. Validates untrusted input once at the route boundary; schemas in `apps/web/src/lib/validation/`. |
| React Hook Form | 7.91 | [react-hook-form.com](https://react-hook-form.com/docs) | Contact and resume request forms, with the Zod resolver. |
| Framer Motion | 14.6 | [motion.dev/docs/react](https://motion.dev/docs/react) | Shared variants in `apps/web/src/lib/animations.ts`. Respect reduced motion. |
| three / React Three Fiber | 0.186 / 9.8 | [threejs.org/docs](https://threejs.org/docs/) · [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/) | Progressive enhancement only, behind `useRender3D()` from `@lib/three` and loaded with `next/dynamic({ ssr: false })`. No drei: its text helpers spawn blob workers the CSP blocks ([DR-0013](../decisions/0013-webgl-effects-as-progressive-enhancement.md)). |
| fast-xml-parser | 5.11 | [github.com/NaturalIntelligence/fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) | `apps/api` only: the Medium RSS feed in `apps/api/src/modules/blog/infrastructure/medium-feed-gateway.ts`. `item` is always parsed as an array. |
| pino | 10.4 | [getpino.io](https://getpino.io) | Through `logger` in `@lib/core`, never `console` in app code. |
| Sentry (`@sentry/nextjs`) | 11.9 | [docs.sentry.io/platforms/javascript/guides/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) | Shared options in `sentry-shared.ts`; hooks in `apps/web/src/instrumentation*.ts`. |
| Vercel Blob / Analytics / Speed Insights | 2.8 / 2.0 | [vercel.com/docs](https://vercel.com/docs) | Blob holds the CV PDF behind `api/cv/**`. |
| next-pwa | 5.6 | [github.com/shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa) | Disabled with `SKIP_PWA=true` (`pnpm build:fast`). |
| Vitest | 5.0 | [vitest.dev](https://vitest.dev/guide/) | Unit tests in `apps/web/tests/unit/`, mirroring `apps/web/src/`. |
| Playwright | 1.64 | [playwright.dev/docs](https://playwright.dev/docs/intro) | E2E in `apps/web/tests/e2e/`; run locally, not in CI. |
| standard-version | via `npx` | [github.com/conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version) | Run only by `auto-release.yml`; config in `.versionrc.json`. |
