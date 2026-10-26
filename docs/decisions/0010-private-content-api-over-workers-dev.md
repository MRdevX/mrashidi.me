---
id: 0010
title: Serve the content API privately to Vercel over workers.dev
issues: []
status: accepted
date: 2026-10-26
supersedes: []
superseded_by: []
related: [DR-0005, DR-0007, DR-0009]
areas: [api, infra]
---

# DR-0010: Serve the content API privately to Vercel over workers.dev

> Every `/v1` route requires `Authorization: Bearer $CONTENT_API_TOKEN`, and the Vercel server
> calls the Worker on `mrashidi-api.<subdomain>.workers.dev` instead of `api.mrashidi.me`. This
> keeps Bot Fight Mode on for the zone. On the Free plan it can't be skipped for Vercel's
> server-side fetches, and `workers.dev` sits outside the zone. No browser calls the API, so CORS
> is gone.

## Context

Bot Fight Mode challenged the Next.js server's fetches to `api.mrashidi.me`, and the site failed
to load content until it was turned off. Free-plan Bot Fight Mode runs outside the Ruleset
Engine: WAF Skip, Allow, and Page Rules have no effect on it
([docs](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/#limitations)). An IP
Access rule would exempt a client, but Vercel functions have no fixed egress IPs. Every content
fetch is server-side (`apps/web/src/lib/content/server.ts`). Cloudflare's DDoS protection is
separate from Bot Fight Mode and stays on either way.

## Decision

- `apps/api/src/app.ts` applies `requireContentToken` to `/v1/*`. `/health` stays open.
- `wrangler.toml` sets `workers_dev = true`. Terraform sets Vercel's `CONTENT_API_URL` to the
  `workers.dev` host.
- The web sends the token on every content fetch.
- `api.mrashidi.me` stays attached behind Bot Fight Mode and the token. Nothing depends on it.
- Bot Fight Mode stays on for the zone.

## Consequences

- **Gains:** the zone keeps bot protection; the API is no longer an open read endpoint; CORS
  config and the preview-origin allowlist are gone.
- **Costs:** the API has two hostnames; `workers.dev` is treated as a Free website by Cloudflare;
  the token must be set wherever the real API is used, local dev included.
- **Accepted risks:** unauthenticated requests to `workers.dev` still invoke the Worker and return
  401. If that becomes abuse, add a Workers rate-limit binding or Cloudflare Access.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Keep Bot Fight Mode off | Drops bot protection for the apex site and the cPanel hosts |
| WAF Skip rule for Vercel | Free-plan Bot Fight Mode cannot be skipped by any rule |
| IP Access allow rule | Vercel has no fixed egress IPs outside Secure Compute (Enterprise) |
| Pro plan: Super Bot Fight Mode with a Skip rule on a secret header | Recurring cost for one server-to-server call |
| Move the web to Workers and call the API through a Service Binding | Would supersede DR-0005; replaces Vercel Analytics, Speed Insights, Blob and the Next cache for a problem this fixes in one PR |

## Implementation

- `apps/api/src/shared/http/require-content-token.ts`, `apps/api/src/app.ts`
- `apps/api/wrangler.toml`, `infra/live/production/main.tf`, `infra/live/production/variables.tf`
- `apps/web/src/lib/content/server.ts`

## Revisit when

- The zone moves to Pro or above (use Super Bot Fight Mode with a Skip rule and drop `workers.dev`).
- The web moves to Workers (use a Service Binding).
- A browser needs to call the API directly.
