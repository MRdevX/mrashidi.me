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

- Read [DR-0005](../../../docs/decisions/0005-turborepo-web-on-vercel-api-on-workers.md) and [DR-0006](../../../docs/decisions/0006-personal-data-in-d1.md).
- Check the pinned Hono, Drizzle and Wrangler versions in [stack.md](../../../docs/agent/stack.md) and read their docs.

## Layers (`apps/api/src/modules/<module>/`)

1. **Contract:** request and response shapes are Zod schemas in `packages/types/src/`. Add the schema there first.
2. **Domain:** the port in `domain/` (an interface, plain TypeScript, no Hono or Drizzle imports).
3. **Infrastructure:** the Drizzle implementation in `infrastructure/`. Parse every row with the schema before returning it.
4. **Application:** one query or command per function in `application/`; throw a named error for "not found".
5. **HTTP:** the route in `http/`, with per-route middleware (`cacheControl`, `bearerAuth`), never router-wide `use()`, because routers share the `/v1` mount. Map new errors in `src/app.ts` `onError`.
6. Export the module's public surface from its `index.ts`; `src/app.ts` is the only composition root.

Imports inside the API use `#app`, `#bindings`, `#db/*`, `#modules/*`, `#shared/*` with `.ts` extensions.

## Tests

`apps/api/test/*.test.ts` run in the Workers pool (`@cloudflare/vitest-pool-workers`, Vitest 4) against a D1 seeded from `@mrashidi/types/fixtures` by the same SQL builder as `db:seed`. Call the Worker with `exports.default.fetch(...)` from `cloudflare:workers`.

## Done

`pnpm gate`, then `pnpm dev:api` and curl the route.
