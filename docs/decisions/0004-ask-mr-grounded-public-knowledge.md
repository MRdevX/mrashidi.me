---
id: 0004
title: Ground Ask MR only in public site data and a public knowledge file
issues: []
status: accepted
date: 2026-10-13
supersedes: []
superseded_by: []
related: []
areas: [ask-mr, api]
---

# DR-0004: Ground Ask MR only in public site data and a public knowledge file

> Ask MR answers from the site's own profile and project data plus
> `src/features/ask-mr/knowledge/askMrKnowledge.ts`, built into the system prompt. Nothing
> private goes in: the repo is open source, so the knowledge file is public. Anything not in
> that data gets "ask Mahdi directly". The model runs through the Vercel AI Gateway behind
> BotID, per-IP and global daily limits, and a kill switch.

## Context

Ask MR (`ceb36e7`, `dc7836b`) answers visitor questions about Mahdi's work. Visitors include
recruiters asking about availability, location, and pay; the CV PDF and private notes hold
answers that must not be published. Any text the model sees can come back out under a crafted
prompt, so the only safe input is text that is already public.

## Decision

- Knowledge = site data (`src/data/profile/`, projects) + `askMrKnowledge.ts`, assembled by
  `buildKnowledge.ts`. Empty fields are left out of the prompt, so the assistant deflects instead
  of guessing.
- `askMrKnowledge.ts` never holds phone numbers, a personal email beyond the site's contact,
  residence or visa status, compensation, or availability details.
  `tests/unit/ask-mr/knowledge.test.ts` ("keeps private details out of the public knowledge
  file") enforces it.
- Tools are read-only: project cards, contact handoff, CV request, latest posts, suggestions.
  The CV itself stays behind the request flow.
- Model: `ASK_MR_MODEL` through the AI Gateway. Guards in `src/features/ask-mr/server/guards.ts`:
  BotID, per-IP limit, `ASK_MR_DAILY_BUDGET` across all visitors, `ASK_MR_ENABLED` kill switch.
  Logs are anonymous and expire after 30 days.
- Answer quality changes are checked with `pnpm eval:ask-mr`.

## Consequences

- **Gains:** a prompt injection can only leak what is already on the site; cost is capped per
  day.
- **Costs:** the assistant can't answer anything not published, and every new fact needs a
  public edit.
- **Accepted risks:** the model paraphrasing public facts wrongly. The eval script and feedback
  buttons catch it.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Retrieval over the CV PDF and private notes | Anything retrievable can be extracted by a crafted prompt |
| Private knowledge file kept out of the repo | Same leak through the model, and it would drift from the site data |
| Calling a provider SDK directly | The gateway gives one key, OIDC on Vercel, and model switches through an env var |

## Implementation

- [x] `src/features/ask-mr/knowledge/`, `src/features/ask-mr/server/`, `src/app/api/chat/`
- [x] `tests/unit/ask-mr/knowledge.test.ts`, `scripts/ask-mr-eval.ts`

## Revisit when

- Ask MR needs to answer from content that isn't public.
- Daily cost or abuse outgrows the per-IP and global limits.
