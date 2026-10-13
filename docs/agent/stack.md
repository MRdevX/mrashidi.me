# Stack

Before using an API, read the official docs for the version pinned here (house rules §4,
[DR-0001](../decisions/0001-adopt-shared-house-rules.md)). Versions come from `package.json`;
when you bump a major or minor, update the row in the same PR.

| Library | Version | Official docs | House conventions |
| ------- | ------- | ------------- | ----------------- |
| Next.js | 16.4 | [nextjs.org/docs](https://nextjs.org/docs) · local `node_modules/next/dist/docs/` | App Router. Route files in `src/app/` stay thin and compose a feature from `src/features/` ([DR-0002](../decisions/0002-feature-slices.md)). Server components by default; `"use client"` only for hooks, browser APIs, or handlers. |
| React | 19.3 | [react.dev](https://react.dev/reference/react) | Function components only. Derive during render; effects only to sync with something outside React. |
| TypeScript | 7.0 | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | Strict. Import through the path aliases in `AGENTS.md`. |
| Tailwind CSS | 4.3 | [tailwindcss.com/docs](https://tailwindcss.com/docs) | Theme tokens in `src/styles/variables.css` and `theme.css`. Variants with CVA, class merging with `cn` from `@lib/utils`. |
| shadcn/ui | new-york, RSC | [ui.shadcn.com/docs](https://ui.shadcn.com/docs) | Primitives in `src/components/ui/`; config in `components.json`. |
| Biome | 2.5 | [biomejs.dev](https://biomejs.dev/reference/configuration/) | The only linter and formatter ([DR-0003](../decisions/0003-biome-only.md)). `pnpm check` / `pnpm check:fix`. |
| Vercel AI SDK (`ai`, `@ai-sdk/react`) | 7.0 / 4.0 | [ai-sdk.dev/docs](https://ai-sdk.dev/docs/introduction) | Ask MR only. Model id from `ASK_MR_MODEL` through the AI Gateway ([DR-0004](../decisions/0004-ask-mr-grounded-public-knowledge.md)). |
| Upstash Redis / Ratelimit | 1.39 / 2.2 | [upstash.com/docs/redis](https://upstash.com/docs/redis/overall/getstarted) | Rate limits for contact, resume, and Ask MR. Falls back to in-memory when Redis is not configured. |
| Zod | 4.6 | [zod.dev](https://zod.dev) | Zod 4 API. Validates untrusted input once at the route boundary; schemas in `src/lib/validation/`. |
| React Hook Form | 7.90 | [react-hook-form.com](https://react-hook-form.com/docs) | Contact and resume request forms, with the Zod resolver. |
| Framer Motion | 14.1 | [motion.dev/docs/react](https://motion.dev/docs/react) | Shared variants in `src/lib/animations.ts`. Respect reduced motion. |
| ky | 2.2 | [github.com/sindresorhus/ky](https://github.com/sindresorhus/ky) | Outbound HTTP from services in `src/lib/services/`. |
| pino | 10.4 | [getpino.io](https://getpino.io) | Through `logger` in `@lib/core`, never `console` in app code. |
| Sentry (`@sentry/nextjs`) | 11.6 | [docs.sentry.io/platforms/javascript/guides/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) | Shared options in `sentry-shared.ts`; hooks in `src/instrumentation*.ts`. |
| Vercel Blob / Analytics / Speed Insights | 2.8 / 2.0 | [vercel.com/docs](https://vercel.com/docs) | Blob holds the CV PDF behind `api/cv/**`. |
| next-pwa | 5.6 | [github.com/shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa) | Disabled with `SKIP_PWA=true` (`pnpm build:fast`). |
| Vitest | 5.0 | [vitest.dev](https://vitest.dev/guide/) | Unit tests in `tests/unit/`, mirroring `src/`. |
| Playwright | 1.64 | [playwright.dev/docs](https://playwright.dev/docs/intro) | E2E in `tests/e2e/`; run locally, not in CI. |
| standard-version | via `npx` | [github.com/conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version) | Run only by `auto-release.yml`; config in `.versionrc.json`. |
