---
id: 0007
title: Load Ask MR knowledge from the content API and guard it at seed time
issues: []
status: proposed
date: 2026-10-26
supersedes: [DR-0004]
superseded_by: []
related: [DR-0006]
areas: [ask-mr, api]
---

# DR-0007: Load Ask MR knowledge from the content API and guard it at seed time

> Ask MR keeps every rule of DR-0004 except where its knowledge comes from: profile, projects
> and the extra knowledge record are read from the content API (DR-0006) instead of files in
> the repo. The privacy guard that `tests/unit/ask-mr/knowledge.test.ts` enforced moves into the
> seed script, so private details never reach D1. `GET /v1/knowledge` requires a bearer token.

## Context

DR-0004 grounds Ask MR in site data plus `askMrKnowledge.ts`, and enforces "nothing private" with
a unit test over the file. Once the data leaves the repo (DR-0006) that test has nothing to
read, and the guard has to run where the data enters the system.

## Decision

- `buildKnowledge.ts` takes its sources from the server-only content client.
- The seed script rejects knowledge with phone numbers, a personal email beyond the site's
  contact, residence or visa status, compensation, or availability details.
- `GET /v1/knowledge` is served only with `Authorization: Bearer $CONTENT_API_TOKEN`; it holds
  role notes and hidden roles that the site itself does not render.
- Model, gateway, tools, BotID, limits, kill switch and `pnpm eval:ask-mr` stay as in DR-0004.
  Ask MR stays on Vercel (DR-0005).

## Consequences

- **Gains:** knowledge edits need a seed, not a deploy; the guard covers every source, not one file.
- **Costs:** a failing content API leaves Ask MR without knowledge; the chat route must fail closed.
- **Accepted risks:** the token leaking exposes only data that is safe for the model to repeat.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Keep `askMrKnowledge.ts` in the repo | Leaves personal data in the public repo, against DR-0006 |
| Public `/v1/knowledge` | Exposes hidden roles and notes the site deliberately does not render |

## Implementation

- [ ] `apps/api/scripts/seed.ts` privacy guard, `apps/api/src/modules/content/http/`
- [ ] `apps/web/src/features/ask-mr/knowledge/buildKnowledge.ts`

## Revisit when

- Ask MR needs to answer from content that isn't public.
