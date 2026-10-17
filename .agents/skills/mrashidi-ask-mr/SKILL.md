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

Ask MR answers only from public site data plus
`src/features/ask-mr/knowledge/askMrKnowledge.ts`
([DR-0004](../../../docs/decisions/0004-ask-mr-grounded-public-knowledge.md)). The repo is open
source, so everything the model sees is public.

## Map

| Part | Where |
| ---- | ----- |
| Extra facts | `knowledge/askMrKnowledge.ts` |
| Prompt assembly | `knowledge/buildKnowledge.ts`, `server/systemPrompt.ts` |
| Tools | `server/tools.ts` |
| Guards (BotID, limits, kill switch) | `server/guards.ts`, `server/redis.ts` |
| Model call | `server/modelCall.ts`, model id from `ASK_MR_MODEL` |
| Routes | `src/app/api/chat/route.ts`, `src/app/api/chat/feedback/route.ts` |
| UI | `ui/`, `client/`; terminal `ask` command in `src/features/home/terminal/` |

All paths under `src/features/ask-mr/` unless absolute.

## Adding facts

- Third person ("Mahdi …"), one or two sentences per entry.
- An empty field is left out of the prompt, so Ask MR deflects to contact. Leave a field empty rather than guess.
- Never add phone numbers, a personal email beyond the site's, residence or visa status, compensation, or availability details. `tests/unit/ask-mr/knowledge.test.ts` enforces this; extend it when you add a new kind of field.
- `roleNotes[].company` must match `company` in `src/data/profile/workExperience.ts`.

## Changing prompt, tools, or model

- Tools stay read-only. A tool that writes or sends needs a decision record.
- Server code in `server/` never imports from `ui/` or `client/`, and the reverse.
- Run `pnpm eval:ask-mr` before and after (it calls the model directly and needs `AI_GATEWAY_API_KEY`); put both pass counts in How to Test.

## Verify

`pnpm gate`, then `pnpm test:e2e tests/e2e/ask-mr.spec.ts`. Locally the chat needs
`AI_GATEWAY_API_KEY`; without Upstash the limits fall back to memory.
