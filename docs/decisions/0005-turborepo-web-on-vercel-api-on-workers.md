---
id: 0005
title: Split the site into a Turborepo with Next.js on Vercel and a Hono API on Workers
issues: []
status: accepted
date: 2026-10-26
supersedes: []
superseded_by: []
related: [DR-0002, DR-0006]
areas: [app, api, ci, infra, tooling]
---

# DR-0005: Split the site into a Turborepo with Next.js on Vercel and a Hono API on Workers

> The repo is a pnpm + Turborepo monorepo: `apps/web` (Next.js, stays on Vercel), `apps/api`
> (Hono on Cloudflare Workers with D1), and `packages/*` for code with two real consumers.
> Cloudflare and Vercel resources are managed with Terraform under `infra/`. The layout,
> task graph and infra pattern follow masir-app (Targela) so the projects stay alike.

## Context

Personal data has to leave the repo (DR-0006), which needs a backend with storage the public
repo does not contain. Two sibling projects already run the target stack: masir-app (Hono
Worker, Terraform, Turborepo) and r4zzle (Next.js on Cloudflare through OpenNext, Hono + D1).
r4zzle shows what OpenNext costs today: `proxy.ts` is unsupported so it keeps `middleware.ts`,
and the 3 MiB Worker limit forced dropping `@sentry/nextjs` for a hand-written worker wrapper.
This site also relies on Vercel-only features: BotID and the AI Gateway for Ask MR, Vercel
Analytics and Speed Insights.

## Decision

- Workspaces: `apps/web` (`@mrashidi/web`), `apps/api` (`@mrashidi/api`), `packages/*`
  (`@mrashidi/<name>`). Packages ship TypeScript source through `exports`, with no build step.
- Turborepo runs `build`, `typecheck`, `test` and `check` per package. A package-level task
  override re-declares `^build`, because package task keys replace the root ones.
- `pnpm gate` stays the single local and pre-push gate; it runs the root checks and then the
  turbo tasks. `pnpm gate:affected` limits turbo to packages changed against `origin/main`.
- `apps/web` stays on Vercel with Root Directory `apps/web`. `apps/api` deploys with wrangler.
- Terraform under `infra/` owns zones, DNS, D1, R2, Worker custom domains and the Vercel
  project. Wrangler owns Worker code and bindings. State lives in R2.
- One environment (production). Vercel preview deployments are the staging surface.

## Consequences

- **Gains:** the API and its data are deployable apart from the site; the same shape as the
  sibling projects; the frontend can move host later without touching the data path.
- **Costs:** two platforms and two sets of secrets; content reads cross from Vercel to
  Cloudflare over HTTPS, so the web app must cache them.
- **Accepted risks:** Vercel and Cloudflare drift out of sync on env vars. Terraform owns both.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Move the Next.js app to Cloudflare with OpenNext | Loses BotID, AI Gateway wiring and Vercel analytics; r4zzle hit the `proxy.ts` and Worker-size limits |
| Keep one Next.js app and put data in Vercel storage | Still one deployable; does not match the sibling stack the user maintains |
| Route handlers in Next.js as the API | Data access would stay coupled to the frontend host |

## Implementation

- [x] `apps/web/`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`
- [ ] `apps/api/`, `packages/types/`
- [ ] `infra/`, `.github/workflows/infra.yml`, `.github/workflows/deploy-api.yml`

## Revisit when

- OpenNext supports `proxy.ts` and Node middleware, and BotID has a Cloudflare equivalent.
- Vercel cost or limits outgrow the hobby tier.
