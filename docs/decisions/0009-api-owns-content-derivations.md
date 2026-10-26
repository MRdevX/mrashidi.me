---
id: 0009
title: Derive content read models in the API, render them in the web app
issues: []
status: accepted
date: 2026-10-26
supersedes: [DR-0007]
superseded_by: []
related: [DR-0002, DR-0005, DR-0006]
areas: [api, app, ask-mr]
---

# DR-0009: Derive content read models in the API, render them in the web app

> Rules computed from site content (experience periods and durations, skill tiers and groups,
> featured skills, project slugs and year ranges, the project catalog overview and stack
> taxonomy, the Ask MR knowledge context) live in the API's domain and come back as read
> models. The web app keeps presentation (labels, formatting, icons), URL and UI state, and
> the per-keystroke project filter. API modules are split per bounded context: `profile`,
> `resume`, `projects`, `ask-mr`. Web fallback and tests use read-model fixtures generated
> from the API's own queries. Everything in DR-0007 stays except where the knowledge context
> is built: the API builds it, and hidden roles and role notes never leave the Worker.

## Context

After DR-0005 and DR-0006 the API returned stored JSON as-is from one `content` module whose
domain was a port and whose use cases only mapped `null` to a 404. Every derived rule lived in
`apps/web`: `features/resume/period.ts`, `features/about/aboutSkillsGrouped.ts`,
`features/home/techStack.ts`, `features/projects/domain/{project,stack,catalog}.ts` and
`features/ask-mr/knowledge/buildKnowledge.ts`. Two featured-skill mechanisms existed (a list in
code and an `includeInMainStack` flag), the project slug was recomputed in three web files, and
the web needed the private `knowledge` section only to serialise it.

The API and web deploy separately (DR-0008), so a response shape change can meet an older web
build for a few minutes.

## Decision

- A rule derived from content lives in the owning API module's `domain/`, is exposed by an
  `application/` query, and reaches the web as a read model whose Zod schema sits in
  `packages/types`.
- API modules: `profile` (`/v1/profile`, `/v1/about`), `resume` (`/v1/experience`,
  `/v1/skills`, `/v1/education`, `/v1/certificates`), `projects` (`/v1/projects`,
  `/v1/projects/:slug`), `ask-mr` (`/v1/knowledge*`). A module reads another only through its
  `index.ts`. `app.ts` is the only composition root; `ContentNotFoundError` lives in
  `src/shared/`.
- Response changes are additive: new fields or new routes. A route or field is removed only
  after the web build that stopped reading it is live.
- The web app keeps presentation and interaction: display labels, date and duration
  formatting, icons, URL state, pagination, and the client-side project search, filter, facet
  counts and sort over the API's data.
- Read-model fixtures in `packages/types/fixtures/api/` are written by an API script from the
  raw fixtures with a fixed clock. A Worker test fails when the routes and the committed JSON
  disagree. The web falls back to them without `CONTENT_API_URL`, and web tests render with them.
- Ask MR: the API builds the knowledge context (`GET /v1/knowledge/context`, bearer token,
  `private, no-store`). The privacy guard at seed time, the token, and the fail-closed chat
  route stay as in DR-0007.

## Consequences

- **Gains:** one home per rule, tested once in the Worker pool; the web bundle loses parsing
  and taxonomy code; hidden roles and role notes stop crossing to Vercel; the API becomes
  useful to a second client without re-implementing the rules.
- **Costs:** a rule change now touches the contract, the API, the fixtures and the web; the
  fixtures must be regenerated when content rules change; the stack taxonomy and skill groups
  are code in the API rather than data.
- **Accepted risks:** an ongoing role's duration is computed at request time and cached for an
  hour by the web, so it can lag a month boundary by up to an hour.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Keep the rules in web, shared through `packages/types` | The API stays a pass-through and any second client re-derives everything; `packages/` is for code with two real consumers, and these rules have one |
| Full server-side project search (`/v1/projects?q=&stack=`) | A round trip per keystroke for a catalogue of a few dozen projects; the web already holds all of them |
| Drop the web fixture fallback and require the local API | Dev and unit tests would need Wrangler running; generated fixtures keep them offline and still match the API |
| Keep one `content` module | Its domain would mix resume, project and Ask MR rules in one folder, against the slice layout |

## Implementation

- `apps/api/src/modules/{profile,resume,projects,ask-mr}/`, `apps/api/src/shared/`, `apps/api/src/app.ts`
- `apps/api/scripts/build-fixtures.ts`, `packages/types/fixtures/api/`
- `packages/types/src/` read-model schemas
- `apps/web/src/lib/content/server.ts` and the consumers in `apps/web/src/features/{resume,about,home,projects,ask-mr}/`

## Revisit when

- The API gains write endpoints or an admin, and the taxonomies should become data.
- Project filtering needs to work across more items than the web can hold in memory.
- A second client needs a different shape of the same read model.
