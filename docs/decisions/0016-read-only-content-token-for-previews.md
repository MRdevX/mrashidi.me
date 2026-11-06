---
id: 0016
title: Give preview deployments a read-only content API token
issues: []
status: accepted
date: 2026-11-04
supersedes: []
superseded_by: []
related: [DR-0010, DR-0014, DR-0015]
areas: [api, infra]
---

# DR-0016: Give preview deployments a read-only content API token

> The Worker accepts a second bearer, `CONTENT_API_READ_TOKEN`, on `GET` and `HEAD` `/v1` routes
> only. Vercel previews get it as their `CONTENT_API_TOKEN`; production keeps the full token. A
> preview can render real content but cannot send email through Resend or spend Workers AI on
> Ask MR. This refines DR-0010, where one token opened every `/v1` route.

## Context

Since DR-0014 and DR-0015 the API does more than serve content: `POST /v1/mail/*` sends email
from the site's domain and `POST /v1/ask-mr/chat` runs the model. Terraform gave the production
token to the `preview` target too, so code on any branch ran with the credential that sends
mail and spends neurons. The web guards (reCAPTCHA, rate limits, BotID) live in that same code,
so a preview is only as safe as its branch.

## Decision

- `requireContentToken` accepts `CONTENT_API_TOKEN` on every `/v1` route and
  `CONTENT_API_READ_TOKEN` on `GET` and `HEAD` only. An unset read token matches nothing.
- Terraform sets Vercel's `CONTENT_API_TOKEN` to the full token for `production` and to the read
  token for `preview`.
- `deploy-api.yml` puts both Worker secrets; `live/github` publishes both from 1Password.

## Consequences

- **Gains:** a preview cannot email strangers or run up model cost; leaking a preview's env
  exposes only content that is public on the site anyway.
- **Costs:** the contact form, CV request and Ask MR answer with an error on previews; test them
  locally or on production. One more secret to create and rotate.
- **Accepted risks:** the read token still opens `/v1/knowledge`, which only holds public
  knowledge (DR-0007).

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| No token on previews (serve fixtures) | Previews would stop showing real content, which is what they are for |
| Separate preview Worker and D1 | A second database to seed and keep in step for one permission |
| Keep one token, trust the web guards | The guards are part of the branch under preview, so they protect nothing there |

## Implementation

- `apps/api/src/shared/http/require-content-token.ts`, `apps/api/src/bindings.ts`
- `infra/live/production/main.tf`, `infra/live/production/variables.tf`, `infra/live/github/variables.tf`, `infra/.env.op`
- `.github/workflows/deploy-api.yml`, `.github/workflows/infra.yml`

## Revisit when

- Previews need to exercise mail or Ask MR end to end (give them a sandboxed mailer and a
  model budget instead of the full token).
- The API grows routes that need finer scopes than read and write.
