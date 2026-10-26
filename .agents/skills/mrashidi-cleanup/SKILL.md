---
name: mrashidi-cleanup
description: >-
  The mrashidi.me checklist that runs after house-cleanup: path aliases, slice
  leaks, single-consumer shared code, duplicated clients and helpers, client
  boundaries, doc accuracy. Use when cleaning up, refactoring, removing dead
  code, or tidying site files a change already touches.
disable-model-invocation: false
---

# mrashidi.me cleanup

Run [house-cleanup](../house-cleanup/SKILL.md) first: scope, dead code, the house rules, one
commit per kind of cleanup, no behaviour change. This skill adds the checks only this site has.

## Scope

Boy-scout by default: the files and the slice the task touches
([DR-0001](../../../docs/decisions/0001-adopt-shared-house-rules.md)). Moving a slice into the
layered shape, or a shared file into its only consumer's slice, is its own PR
([DR-0002](../../../docs/decisions/0002-feature-slices.md)).

## Dead code

`pnpm dlx knip --no-progress`, then confirm each hit with `rg`. Not dead, even when knip says so:
`apps/web/src/app/**` route, page, layout, and metadata files, `apps/web/src/instrumentation*.ts`,
`sentry.*.config.ts`, `sentry-shared.ts`, and `apps/web/scripts/*` run from `package.json`. An export used
only by its own tests is dead: delete the export and those tests together.

## Checklist

- [ ] Imports use `@/`, `@app/`, `@components/`, `@features/`, `@lib/`, never `../../`
- [ ] One feature imports another only through its `index.ts`
- [ ] Files in `apps/web/src/components/`, `apps/web/src/lib/`, `apps/web/src/hooks/` with one consumer → note them for a slice move; don't move inside a feature PR
- [ ] One Upstash Redis client and one HTTP client (`ky` through `apps/web/src/lib/fetcher.ts`) per concern, not a new one per feature
- [ ] Constants and copy have one home: `apps/web/src/config/`, `apps/web/src/data/`, or the feature; not repeated in a component
- [ ] `"use client"` only where hooks, browser APIs, or handlers need it; server-only code never reachable from a client component
- [ ] `logger` from `@lib/core`, not `console`, in app code
- [ ] `AGENTS.md`, `docs/agent/stack.md`, and `README.md` still match the code you changed

## Verify

`pnpm gate`. If you touched pages, routes, or `apps/web/src/components/ui/`, also `pnpm build:fast`.

## Do not

- Restyle or merge UI primitives (`Cyberpunk*`, shadcn, `SurfaceCard`) in a cleanup commit; visible changes need their own PR
- Edit `.agents/house-rules.md` or `.agents/skills/house-*`
