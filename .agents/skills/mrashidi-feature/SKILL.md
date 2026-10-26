---
name: mrashidi-feature
description: >-
  Adds a page, section, or API route to mrashidi.me as a feature slice: thin
  route file, logic in apps/web/src/features, metadata, sitemap and OG image, tests.
  Use when adding or changing a page, a site section, or an API route.
disable-model-invocation: false
---

# mrashidi.me feature

## Before you start

- Search [`docs/decisions/`](../../../docs/decisions/README.md) for the area ([house-decision](../house-decision/SKILL.md)).
- Read the Next.js 16 guide for the API you use in `node_modules/next/dist/docs/`, and the pinned docs in [stack.md](../../../docs/agent/stack.md).

## Slice

1. Put the feature in `apps/web/src/features/<feature>/` and export its public surface from `index.ts` ([DR-0002](../../../docs/decisions/0002-feature-slices.md)). Layers (`domain/`, `application/`, `infrastructure/`, `ui/`) only when it has domain logic; see `apps/web/src/features/projects/`.
2. Reuse `apps/web/src/components/ui/` primitives and `cn` from `@lib/utils`. Move code to `apps/web/src/components/` or `apps/web/src/lib/` only when a second feature uses it.
3. Server components by default; `"use client"` on the smallest component that needs it.

## Page

1. `apps/web/src/app/<route>/page.tsx` renders the feature and nothing else.
2. Metadata: add an entry to `pageMetadataConfigs` in `apps/web/src/lib/metadata.ts` and export it from `apps/web/src/app/<route>/layout.tsx` with `generatePageMetadata`, as `apps/web/src/app/about/` does.
3. Navigation in `apps/web/src/data/navigation.ts` if the page is linked.
4. Add the page to `apps/web/scripts/generate-og-images.jsx`; `pnpm generate-assets` regenerates `apps/web/public/sitemap.xml` and the OG images. Commit both.

## API route

1. `apps/web/src/app/api/<name>/route.ts`, wrapped in `createMiddleware` from `@/lib/api/middleware`.
2. Validate the body or query with a Zod schema once, at the route. Map errors with `@lib/errors`.
3. Outside calls go through a service in `apps/web/src/lib/services/` or the feature's `infrastructure/`.
4. List the route under Affected Endpoints in the PR.

## Tests

- Unit tests in `apps/web/tests/unit/` mirroring `apps/web/src/`, named after the guarantee.
- A user flow worth guarding gets a Playwright spec in `apps/web/tests/e2e/`.

## Verify

`pnpm gate`, then `pnpm build:fast`. Open the page with `pnpm dev`. PR body with [house-pr](../house-pr/SKILL.md).
