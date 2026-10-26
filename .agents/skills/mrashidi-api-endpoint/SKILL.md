---
name: mrashidi-api-endpoint
description: >-
  Adds or changes a route on @mrashidi/api, the Hono Worker on Cloudflare with D1:
  port, Drizzle repository, query, route, Worker test. Use when adding or changing a
  /v1 content endpoint or anything under apps/api/src.
disable-model-invocation: false
---

# mrashidi.me API endpoint

## Before you start

- Read [DR-0005](../../../docs/decisions/0005-turborepo-web-on-vercel-api-on-workers.md), [DR-0006](../../../docs/decisions/0006-personal-data-in-d1.md) and [DR-0009](../../../docs/decisions/0009-api-owns-content-derivations.md).
- Check the pinned Hono, Drizzle and Wrangler versions in [stack.md](../../../docs/agent/stack.md) and read their docs.

## Layers (`apps/api/src/modules/<module>/`)

1. **Contract:** request and response shapes are Zod schemas in `packages/types/src/`. Add the schema there first.
2. **Domain:** the port and the rules derived from content in `domain/` (plain TypeScript, no Hono or Drizzle imports). The web renders the resulting read model; it does not re-derive it.
3. **Infrastructure:** the Drizzle implementation in `infrastructure/`. Parse every row with the schema before returning it.
4. **Application:** one query or command per function in `application/`; throw a named error for "not found".
5. **HTTP:** the route in `http/`, with per-route middleware (`cacheControl`, `bearerAuth`), never router-wide `use()`, because routers share the `/v1` mount. Map new errors in `src/app.ts` `onError`.
6. Export the module's public surface from its `index.ts`; `src/app.ts` is the only composition root. A module reads another only through that module's `index.ts`.
7. Change responses additively: add fields or routes. Remove one only after the web build that stopped reading it is live, since the Worker and the site deploy separately.

Imports inside the API use `#app`, `#bindings`, `#db/*`, `#modules/*`, `#shared/*` with `.ts` extensions.

## Tests

`apps/api/test/*.test.ts` run in the Workers pool (`@cloudflare/vitest-pool-workers`, Vitest 4) against a D1 seeded from `@mrashidi/types/fixtures` by the same SQL builder as `db:seed`. Call the Worker with `exports.default.fetch(...)` from `cloudflare:workers`.

A route whose body differs from the stored content asserts it with `toMatchFileSnapshot` into `packages/types/fixtures/api/`; the web falls back to those files without `CONTENT_API_URL`. Pin time-dependent output with `vi.setSystemTime`, and run `pnpm --filter @mrashidi/api fixtures:update` after an intended change.

## Done

`pnpm gate`, then `pnpm dev:api` and curl the route.
