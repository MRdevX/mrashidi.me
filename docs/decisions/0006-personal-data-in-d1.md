---
id: 0006
title: Keep personal data in D1, seeded from a private repo
issues: []
status: accepted
date: 2026-10-26
supersedes: []
superseded_by: []
related: [DR-0005, DR-0007]
areas: [app, api, infra]
---

# DR-0006: Keep personal data in D1, seeded from a private repo

> The public repo ships code, not personal data. Profile, bio, experience, education, skills,
> certificates, projects and Ask MR knowledge live in a D1 database behind the Hono API. The
> source of truth is a private `mrashidi-data` repo of JSON files; `pnpm --filter @mrashidi/api
> db:seed` validates them against `@mrashidi/types` and upserts them. The public repo carries
> a fake fixture dataset for development and tests. Admin write endpoints come later.

## Context

`src/data/**`, `src/features/projects/infrastructure/projectData.ts` and
`src/features/ask-mr/knowledge/askMrKnowledge.ts` (about 45 KB in all), plus names and handles
scattered through components, make the repo a copy of the owner's CV. The owner wants the code
reusable without the data. The data is still shown on the live site; the aim is to stop
publishing it as source, not to hide it.

## Decision

- Content contract: Zod schemas in `packages/types`, shared by the API, the seed script and
  the web client. Every read is parsed at the boundary.
- Storage: D1 `mrashidi-db`. Singletons in `content_sections(key, data)`, ordered lists in
  their own tables (`projects`, `work_experience`), JSON columns validated by the schemas.
- Source: JSON files in the private `mrashidi-data` repo. The seed script refuses data that
  fails the schema or the DR-0007 privacy guard.
- The public repo holds only fixture data under `packages/types/fixtures/`. Tests use fixtures,
  never real data.
- Git history is left as it is; the data already in it is also on the live site.
- A gate script fails when known personal tokens appear outside an allowlist.

## Consequences

- **Gains:** forks and readers get the code without the CV; content changes no longer need a
  deploy of the web app.
- **Costs:** a second repo to keep; local development needs a seeded D1 (fixtures by default).
- **Accepted risks:** the private repo and D1 drift. The seed is idempotent and re-runnable.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Rewrite git history to purge the data | Breaks clones, forks and PR links for data that is public on the site anyway |
| Admin UI as the only source | More code before any data leaves the repo; planned as the next step |
| Env vars or a private npm package | Data still ends up in build output and bundles, and edits need a redeploy |

## Implementation

- [x] `packages/types/`, `packages/types/fixtures/`
- [x] `apps/api/src/modules/content/`, `apps/api/migrations/`, `apps/api/scripts/seed.ts`
- [x] `apps/web/src/lib/content/`; deleted `apps/web/src/data/profile/`
- [x] `scripts/check-no-personal-data.mjs` (hashed phrases; `CHANGELOG.md` skipped because it mirrors history)

## Revisit when

- Content is edited often enough that an admin UI pays for itself.
- A second consumer (mobile, CLI) needs write access.
