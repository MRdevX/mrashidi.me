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

Ask MR answers only from the content API: the site content plus the `knowledge` section
([DR-0007](../../../docs/decisions/0007-ask-mr-knowledge-from-d1.md)). Treat everything the model
sees as public: a crafted prompt can extract it.

## Map

| Part | Where |
| ---- | ----- |
| Extra facts | `knowledge.json` in the private `mrashidi-data` repo, served by `GET /v1/knowledge` |
| Prompt assembly | `knowledge/buildKnowledge.ts`, `server/systemPrompt.ts` |
| Tools | `server/tools.ts` |
| Guards (BotID, limits, kill switch) | `server/guards.ts`, `server/redis.ts` |
| Model call | `server/modelCall.ts`, model id from `ASK_MR_MODEL` |
| Routes | `apps/web/src/app/api/chat/route.ts`, `apps/web/src/app/api/chat/feedback/route.ts` |
| UI | `ui/`, `client/`; terminal `ask` command in `apps/web/src/features/home/terminal/` |

All paths under `apps/web/src/features/ask-mr/` unless absolute.

## Adding facts

- Edit `knowledge.json` in `mrashidi-data`, then seed ([mrashidi-d1-migration](../mrashidi-d1-migration/SKILL.md)). Third person, one or two sentences per entry.
- An empty field is left out of the prompt, so Ask MR deflects to contact. Leave a field empty rather than guess.
- Never add phone numbers, a personal email beyond the site's, residence or visa status, compensation, or availability details. `AskMrKnowledgeSchema` (`packages/types/src/knowledge.ts`) rejects them at seed time; extend it when you add a new kind of field.
- `roleNotes[].company` must match `company` in `experience.json`.
- Fact checks for `pnpm eval:ask-mr` live in `ask-mr-eval.json` in `mrashidi-data` (`MR_DATA_DIR` points at it); generic behaviour cases stay in `apps/web/scripts/ask-mr-eval.ts`.

## Changing prompt, tools, or model

- Tools stay read-only. A tool that writes or sends needs a decision record.
- Server code in `server/` never imports from `ui/` or `client/`, and the reverse.
- Run `pnpm eval:ask-mr` before and after (it calls the model directly and needs `AI_GATEWAY_API_KEY`); put both pass counts in How to Test.

## Verify

`pnpm gate`, then `pnpm test:e2e apps/web/tests/e2e/ask-mr.spec.ts`. Locally the chat needs
`AI_GATEWAY_API_KEY`; without Upstash the limits fall back to memory.
