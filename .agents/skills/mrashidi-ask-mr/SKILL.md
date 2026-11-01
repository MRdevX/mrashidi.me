---
name: mrashidi-ask-mr
description: >-
  Changes Ask MR, the site's AI chat assistant: knowledge file, system prompt,
  tools, guards, and UI, within the public-knowledge privacy rule. Use when
  adding facts Ask MR can answer, changing its prompt, tools, model, limits, or
  chat UI, or debugging a wrong answer.
disable-model-invocation: false
---

# Ask MR

Ask MR answers only from the content API: the site content plus the knowledge context the API
builds ([DR-0009](../../../docs/decisions/0009-api-owns-content-derivations.md)). Treat everything the model
sees as public: a crafted prompt can extract it.

## Map

| Part | Where |
| ---- | ----- |
| Extra facts | `knowledge.json` in the private `mrashidi-data` repo, read by the API |
| Knowledge context | `apps/api/src/modules/ask-mr/domain/knowledge-context.ts`, served by `GET /v1/knowledge/context` |
| Prompt assembly | `apps/api/src/modules/ask-mr/domain/instructions.ts` |
| Tools | `apps/api/src/modules/ask-mr/application/tools.ts` |
| Model call | `apps/api/src/modules/ask-mr/application/chat.ts`, served by `POST /v1/ask-mr/chat` |
| Model ids (Workers AI) | `apps/api/src/modules/ask-mr/infrastructure/workers-ai-model.ts` |
| Request, tool and metadata contract | `packages/types/src/ask-mr-chat.ts` |
| Guards (BotID, limits, kill switch), logging | `server/guards.ts`, `server/logging.ts`, `server/redis.ts` |
| Routes | `apps/web/src/app/api/chat/route.ts` (proxies to the API), `apps/web/src/app/api/chat/feedback/route.ts` |
| UI | `ui/`, `client/`; terminal `ask` command in `apps/web/src/features/home/terminal/` |

Paths without a prefix are under `apps/web/src/features/ask-mr/`. The model runs on Workers AI in
the API Worker ([DR-0014](../../../docs/decisions/0014-ask-mr-on-workers-ai.md)); the free
allocation is 10,000 neurons a day, about 120 turns.

## Adding facts

- Edit `knowledge.json` in `mrashidi-data`, then seed ([mrashidi-d1-migration](../mrashidi-d1-migration/SKILL.md)). Third person, one or two sentences per entry.
- An empty field is left out of the prompt, so Ask MR deflects to contact. Leave a field empty rather than guess.
- Never add phone numbers, a personal email beyond the site's, residence or visa status, compensation, or availability details. `availability` holds only a general statement of how he works (consulting, project work, terms agreed case by case), no dates or notice periods ([DR-0014](../../../docs/decisions/0014-ask-mr-on-workers-ai.md)). `AskMrKnowledgeSchema` (`packages/types/src/knowledge.ts`) rejects them at seed time; extend it when you add a new kind of field.
- `roleNotes[].company` must match `company` in `experience.json`.
- Fact checks for `pnpm eval:ask-mr` live in `ask-mr-eval.json` in `mrashidi-data` (`MR_DATA_DIR` points at it); generic behaviour cases stay in `apps/api/scripts/ask-mr-eval.ts`.

## Changing prompt, tools, or model

- Tools stay read-only. A tool that writes or sends needs a decision record.
- Server code in `server/` never imports from `ui/` or `client/`, and the reverse.
- Availability, hiring and rates come up only when the visitor asks, in one plain sentence, never in bold, and never in the starter chips (`client/suggestions.ts`) or follow-up suggestions.
- Run `pnpm eval:ask-mr` before and after against `pnpm dev:api` (it posts to the API's chat endpoint and spends neurons); put both pass counts in How to Test.

## Verify

`pnpm gate`, then `pnpm test:e2e apps/web/tests/e2e/ask-mr.spec.ts`. Locally the chat needs
`pnpm dev:api` (after `wrangler login`; the AI binding always runs remotely) and
`CONTENT_API_URL=http://localhost:8787` for the web app; without Upstash the limits fall back to
memory. API tests inject a mock model and never reach Workers AI.
