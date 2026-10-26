# Project context for AI agents

Personal site and portfolio for Mahdi Rashidi at [mrashidi.me](https://mrashidi.me): about, CV,
projects, blog (Medium RSS), contact, and the Ask MR chat assistant. A pnpm + Turborepo
monorepo ([DR-0005](docs/decisions/0005-turborepo-web-on-vercel-api-on-workers.md)):

| Path | Package | What |
| ---- | ------- | ---- |
| `apps/web/` | `@mrashidi/web` | The Next.js site, deployed on Vercel (Root Directory `apps/web`) |
| `apps/api/` | `@mrashidi/api` | Hono content API on Cloudflare Workers with D1 (`api.mrashidi.me`), read-only `/v1/*` routes |
| `infra/` | — | Terraform: zone DNS, D1, `api.mrashidi.me`, Vercel project, GitHub secrets ([docs/infrastructure.md](docs/infrastructure.md)) |
| `packages/types/` | `@mrashidi/types` | Zod content contract (profile, about, resume, projects, Ask MR knowledge) and the fake fixture dataset (`@mrashidi/types/fixtures`) |

Personal data moves to D1
([DR-0006](docs/decisions/0006-personal-data-in-d1.md)).

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind v4, shadcn/ui (new-york, RSC), CVA, clsx/tailwind-merge
- **Lint & format:** Biome only (no ESLint or Prettier)
- **Monorepo:** pnpm workspaces, Turborepo (`turbo.json`), shared `tsconfig.base.json`
- **API:** Hono on Cloudflare Workers, D1 with Drizzle, Wrangler; Worker tests with `@cloudflare/vitest-pool-workers`
- **Tests:** Vitest (unit, `apps/web/tests/unit/`), Playwright (E2E, `apps/web/tests/e2e/`)
- **Other:** Vercel AI SDK (Ask MR), Upstash Redis, Sentry, Vercel (Analytics, Speed Insights, Blob), PWA (next-pwa)

Pinned versions, official docs, and house conventions per library: [docs/agent/stack.md](docs/agent/stack.md).

## Path aliases

Inside `apps/web`, use these in imports instead of relative paths (from `apps/web/tsconfig.json`).
Paths in the rest of this file are from the repo root.

- `@/` → `src/`
- `@app/*` → `src/app/*`
- `@components/*` → `src/components/*`
- `@features/*` → `src/features/*`
- `@lib/*` → `src/lib/*`

## Commands

Run from the repo root. Per-package scripts: `pnpm --filter @mrashidi/web <script>`.

- **Gate:** `pnpm gate` (Biome, agent tooling, then `turbo run typecheck test`). Pre-push runs
  it. `pnpm gate:affected` limits turbo to packages changed against `origin/main`.
- **Lint/format:** `pnpm check`; `pnpm check:fix` to fix.
- **Unit tests:** `pnpm test` (all packages); watch with `pnpm --filter @mrashidi/web test:watch`
- **E2E:** `pnpm test:e2e`; UI/debug modes via `pnpm --filter @mrashidi/web test:e2e:ui|test:e2e:debug`
- **Build:** `pnpm build:fast` (web, no PWA, no sitemap/OG generation); `pnpm build` (turbo, full)
- **Ask MR eval:** `pnpm eval:ask-mr`
- **Dev:** `pnpm dev` (turbo, every app's `dev`); `pnpm dev:web`, `pnpm dev:api` (Wrangler on `:8787`)
- **Infra:** `pnpm infra:plan:<root>` / `pnpm infra:apply:<root>` (`bootstrap`, `global`, `production`, `github`), wrapped in `op run --env-file infra/.env.op --`
- **API data:** `pnpm --filter @mrashidi/api db:migrate:local`, then `db:seed` (fixtures; `--source <dir>` for real data); `pnpm check-migrations`

## Skills

Skills live in `.agents/skills/`; `.claude/skills` and `.cursor/skills` are symlinks to it.
`pnpm check:agent-tooling` checks the links, the frontmatter, and the vendored house files.

Shared skills (vendored from house-rules, never edit here):

| Skill | Use for |
| ----- | ------- |
| `house-pr` | PR title and body in the house format |
| `house-review` | Reviewing a branch or PR against the house rules and decision records |
| `house-decision` | Finding binding decisions; writing a decision record |
| `house-comments` | The comment bar |
| `house-cleanup` | Dead code, duplication, naming, layer leaks |

Project skills (each runs after or around its `house-*` counterpart):

| Skill | Use for |
| ----- | ------- |
| `mrashidi-feature` | Adding a page, section, or API route as a feature slice |
| `mrashidi-ask-mr` | Changing Ask MR knowledge, prompt, tools, guards, or UI |
| `mrashidi-cleanup` | Site checks after `house-cleanup` |
| `mrashidi-review` | `house-review` plus the site gates |
| `mrashidi-api-endpoint` | Adding or changing a route on the Hono API |
| `mrashidi-d1-migration` | Changing the D1 schema; seeding content |
| `mrashidi-deploy` | Terraform, API deploys, production seeding, rollback |

Third-party skills (`code-review`, `codebase-design`, `diagnosing-bugs`, `tdd`, `grilling`,
`research`, `writing-for-agents`, `resolving-merge-conflicts`, `design-taste-frontend`,
`redesign-existing-projects`) are vendored with their source and hash in `skills-lock.json`.

## Decision records

Read [docs/decisions/README.md](docs/decisions/README.md) and search `docs/decisions/` for the
area you touch before feature work. An `accepted` record is binding.

## House rules

This project follows the shared house rules, vendored into `.agents/` from
`github.com/MRdevX/house-rules`.

@.agents/house-rules.md

Never edit `.agents/house-rules.md` or `.agents/skills/house-*`: change them in the house-rules
repo, then run `pnpm house-rules:sync` (it clones or pulls `~/.house-rules`; set
`HOUSE_RULES_DIR=<checkout>` to sync from a local checkout). `pnpm house-rules:install` links
the rules into your global agent config.

### Project facts

| Fact | Value |
| ---- | ----- |
| Gate | `pnpm gate` (pre-push runs it) |
| Issue reference | `- Fixes #123`, one line per issue, in the `References` section |
| Extra PR sections | `References`, last |
| Endpoint sources | `apps/web/src/app/api/**/route.ts`, `apps/api/src/modules/*/http/*.ts` |
| Slice layout | API: `apps/api/src/modules/<module>/{domain,application,infrastructure,http}/`, composed in `apps/api/src/app.ts`. Web: `apps/web/src/features/<feature>/`. Layered slices use `domain/`, `application/`, `infrastructure/`, `ui/` (see `apps/web/src/features/projects/`); Ask MR splits `client/`, `server/`, `knowledge/`, `ui/`. Server-only code in a flat slice sits behind a `server` entry (`@/features/blog/server`, `@/features/home/server`, `@/features/projects/server`) that client code never imports. Shared UI in `apps/web/src/components/`, shared logic in `apps/web/src/lib/`; code with consumers in two apps goes to `packages/<name>/` |
| Decision records | `docs/decisions/`, files `NNNN-short-slug.md` |
| Stack doc | [`docs/agent/stack.md`](docs/agent/stack.md) |

### mrashidi.me specifics

These add to the house rules; none of them loosen one.

- Next.js 16 changed APIs and conventions: read `apps/web/node_modules/next/dist/docs/` before writing Next code.
- `apps/web/src/app/` stays thin: a route file composes a feature from `apps/web/src/features/<feature>/`.
- JSON API routes wrap their handler in `createMiddleware` from `@/lib/api/middleware`. The Ask MR routes (`api/chat/**`) run the guards in `apps/web/src/features/ask-mr/server/` instead; `api/og` only renders an image.
- Ask MR answers only from site data plus `apps/web/src/features/ask-mr/knowledge/askMrKnowledge.ts`, which is public. Never add contact details beyond the site's, residence or visa status, compensation, or anything that could be misused; `apps/web/tests/unit/ask-mr/knowledge.test.ts` guards this.
- `TODO` needs a GitHub issue: `TODO(#123)`.
- Commit scopes: the feature or area, e.g. `ask-mr`, `blog`, `resume`, `projects`, `contact`, `ui`, `api`, `deps`, `ci`, `agents`, `docs`.
- Releases are automatic: `auto-release.yml` runs standard-version on `main` and writes `CHANGELOG.md`. Don't bump the version or edit the changelog by hand.

## Pull requests

Every PR body follows [`.github/pull_request_template.md`](.github/pull_request_template.md);
skill **house-pr** writes it. Overview, What Changed (`Area | Before | After`), Breaking
Changes and Affected Endpoints only when they apply, How to Test ending with `pnpm gate`, then
References.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
