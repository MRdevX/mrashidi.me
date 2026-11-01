---
id: 0014
title: Run the Ask MR model on Workers AI inside the API Worker
issues: []
status: accepted
date: 2026-11-01
supersedes: []
superseded_by: []
related: [DR-0004, DR-0007, DR-0009, DR-0010]
areas: [api, app, ask-mr]
---

# DR-0014: Run the Ask MR model on Workers AI inside the API Worker

> Ask MR answers with `@cf/zai-org/glm-4.7-flash` on Workers AI (fallback
> `@cf/qwen/qwen3-30b-a3b-fp8`), called through the `AI` binding from the API Worker's `ask-mr`
> module at `POST /v1/ask-mr/chat`. The API owns the prompt, the tools and the model call. The
> web route `/api/chat` keeps every guard (kill switch, BotID, per-IP limits, daily budget),
> forwards the request with the content token, passes the UI message stream through, and logs
> the exchange from the stream's finish metadata. This amends DR-0009, which kept DR-0004's
> model rule (AI Gateway, `ASK_MR_MODEL`) through DR-0007; the rest of DR-0009 stands. It also
> narrows DR-0007's "no availability details": Ask MR may state, when asked, that the owner
> takes on consulting and project work with terms agreed case by case. Dates, notice periods
> and rates stay out of the knowledge.

## Context

Ask MR ran `anthropic/claude-haiku-5.5` through the Vercel AI Gateway, which bills per token.
The goal is a free reasoning model with tool calling that stays fast.

Evidence (Cloudflare and Vercel docs, read 2026-11-01):

- Workers AI gives every account 10,000 neurons a day. On Workers Free, requests past that
  fail; nothing is billed. This account is on Workers Free.
- `glm-4.7-flash`: function calling, reasoning, 131,072-token context, available on Workers Free,
  5,500 neurons per million input tokens and 36,400 per million output tokens.
- One Ask MR turn is about 10K input tokens (rules plus knowledge) and up to 1K output, so about
  80 neurons, about 120 turns a day. `gpt-oss-120b` costs 31,818 neurons per million input tokens,
  about 25 turns a day.
- Vercel AI Gateway BYOK removes the markup but needs purchased credits, and its failover bills
  system credentials.
- Free tiers elsewhere don't fit the prompt: Groq's free `gpt-oss-120b` allows 8,000 tokens a
  minute, less than one request.

Measured locally against Workers AI on 2026-11-01 with `pnpm eval:ask-mr` (27 cases: 10 fact
checks from `mrashidi-data`, 17 behaviour cases), first word / whole answer:

| Model, reasoning | Eval | Latency |
| ---------------- | ---- | ------- |
| `glm-4.7-flash`, effort `low` | not run | ~10 s / ~14 s; ~400 of 636 output tokens were reasoning |
| `glm-4.7-flash`, off | 24/27, 26/27 after repeating the safety rules after the knowledge | mostly 1–5 s; multi-step tool turns 10–38 s, cut to 1–3 s for contact, rate and CV questions by ending the turn at those cards |
| `qwen3-30b-a3b-fp8`, off | 22/27 | 1–3 s; leaked the prompt, skipped tools, printed raw tool-call markup |
| `gpt-oss-20b`, `low` | not run | 22 s to the first word on a tool turn |

## Decision

- The model runs in `apps/api/src/modules/ask-mr/`, built with `createAI({ binding: env.AI })`
  from `agents/models/ai-sdk`, reasoning off (`reasoningEffort: null`; `low` cost ten seconds
  for no measured gain), no SDK retries, session affinity on the conversation id
  so Workers AI's prefix cache can hit. Model ids are constants in
  `infrastructure/workers-ai-model.ts`; changing them is a code change checked with
  `pnpm eval:ask-mr`.
- The prompt, the knowledge block and the tools live in the API module next to the knowledge
  context they read. The safety rules are repeated after the knowledge block, because the small
  model follows the end of the prompt most. A turn ends at the follow-up suggestions or at the
  contact or CV card, so the model never takes a second step that repeats its answer. The web
  app holds no model code.
- `POST /v1/ask-mr/chat` sits behind `CONTENT_API_TOKEN` like every `/v1` route and is called
  only by the web route. It answers a UI message stream whose finish metadata carries the model
  and token usage.
- When Workers AI refuses for quota or capacity, the visitor sees the `budget_exhausted`
  message. `ASK_MR_DAILY_BUDGET` defaults to 120 turns so the friendly limit usually comes first.
- The request and tool output shapes live in `@mrashidi/types` (`ask-mr-chat.ts`), shared by
  both apps.

## Consequences

- **Gains:** Ask MR costs nothing; the prompt sits next to the knowledge it is built from;
  answers start in the same Cloudflare network that serves the content.
- **Costs:** about 120 turns a day before Ask MR rests; a smaller model than before, so wording
  and tool use need the eval; the web route depends on the API for chat, so local chat needs
  `pnpm dev:api` and a `wrangler login` (the AI binding always runs remotely).
- **Accepted risks:** slow multi-step turns (a tool call, then the answer) on a busy free tier;
  the visitor sees the typing indicator meanwhile. Workers AI capacity errors at peak. The fallback model covers failures
  before the first token; after that the visitor sees the generic error and can retry.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Keep the AI Gateway with a cheaper paid model | Still paid |
| AI Gateway BYOK with a free provider key | BYOK needs purchased Gateway credits; failover bills system credentials |
| Groq or Cerebras free tier from the web route | Per-minute token limits are below one Ask MR prompt, or the free tier is closed to new accounts |
| Gemini free tier | Free-tier prompts may be used to train Google models; visitor questions would go there |
| Workers AI over REST from the Vercel route | Needs a Cloudflare API token in Vercel and keeps the prompt away from the knowledge it is built from |
| `gpt-oss-120b` on Workers AI | About a fifth of the free daily turns |

## Implementation

- `apps/api/src/modules/ask-mr/` (`domain/instructions.ts`, `application/chat.ts`,
  `application/tools.ts`, `infrastructure/workers-ai-model.ts`, `http/chat-routes.ts`),
  `apps/api/wrangler.toml` (`[ai]`)
- `packages/types/src/ask-mr-chat.ts`
- `apps/web/src/app/api/chat/route.ts`, `apps/web/src/features/ask-mr/server/`
- `apps/api/scripts/ask-mr-eval.ts`

## Revisit when

- Daily turns regularly hit the budget: move to Workers Paid with a neuron budget, or a cheaper model.
- The eval pass rate falls below 26/27, or multi-step turns stay above 10 s for visitors.
- `createAI` changes its fallback or session affinity semantics.
