# Project context for AI agents

Personal site and portfolio for Mahdi Rashidi at [mrashidi.me](https://mrashidi.me): about, CV,
projects, blog (Medium RSS), contact, and the Ask MR chat assistant. One Next.js app, deployed
on Vercel.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind v4, shadcn/ui (new-york, RSC), CVA, clsx/tailwind-merge
- **Lint & format:** Biome only (no ESLint or Prettier)
- **Tests:** Vitest (unit, `tests/unit/`), Playwright (E2E, `tests/e2e/`)
- **Other:** Vercel AI SDK (Ask MR), Upstash Redis, Sentry, Vercel (Analytics, Speed Insights, Blob), PWA (next-pwa)

Pinned versions, official docs, and house conventions per library: [docs/agent/stack.md](docs/agent/stack.md).

## Path aliases

Use these in imports instead of relative paths (from `tsconfig.json`):

- `@/` → `src/`
- `@app/*` → `src/app/*`
- `@components/*` → `src/components/*`
- `@features/*` → `src/features/*`
- `@lib/*` → `src/lib/*`

## Commands

- **Gate:** `pnpm gate` (Biome, agent tooling, typecheck, unit tests). Pre-push runs it.
- **Lint/format:** `pnpm check`; `pnpm check:fix` to fix.
- **Unit tests:** `pnpm test` (watch), `pnpm test:run`, `pnpm test:coverage`
- **E2E:** `pnpm test:e2e`, `pnpm test:e2e:ui`, `pnpm test:e2e:debug`
- **Build:** `pnpm build:fast` (no PWA, no sitemap/OG generation); `pnpm build` (full)
- **Ask MR eval:** `pnpm eval:ask-mr`
- **Dev:** `pnpm dev` (Turbopack)

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
| Endpoint sources | `src/app/api/**/route.ts` |
| Slice layout | `src/features/<feature>/`. Layered slices use `domain/`, `application/`, `infrastructure/`, `ui/` (see `src/features/projects/`); Ask MR splits `client/`, `server/`, `knowledge/`, `ui/`. Server-only code in a flat slice sits behind a `server` entry (`@/features/blog/server`, `@/features/home/server`, `@/features/projects/server`) that client code never imports. Shared UI in `src/components/`, shared logic in `src/lib/` |
| Decision records | `docs/decisions/`, files `NNNN-short-slug.md` |
| Stack doc | [`docs/agent/stack.md`](docs/agent/stack.md) |

### mrashidi.me specifics

These add to the house rules; none of them loosen one.

- Next.js 16 changed APIs and conventions: read `node_modules/next/dist/docs/` before writing Next code.
- `src/app/` stays thin: a route file composes a feature from `src/features/<feature>/`.
- JSON API routes wrap their handler in `createMiddleware` from `@/lib/api/middleware`. The Ask MR routes (`api/chat/**`) run the guards in `src/features/ask-mr/server/` instead; `api/og` only renders an image.
- Ask MR answers only from site data plus `src/features/ask-mr/knowledge/askMrKnowledge.ts`, which is public. Never add contact details beyond the site's, residence or visa status, compensation, or anything that could be misused; `tests/unit/ask-mr/knowledge.test.ts` guards this.
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
