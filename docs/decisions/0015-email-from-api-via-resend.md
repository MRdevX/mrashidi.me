---
id: 0015
title: Send transactional email from the API Worker through Resend
issues: []
status: accepted
date: 2026-11-01
supersedes: []
superseded_by: []
related: [DR-0005, DR-0009, DR-0010]
areas: [api, app, infra]
---

# DR-0015: Send transactional email from the API Worker through Resend

> The contact form and the CV request send their emails from the API Worker's `mail` module
> through Resend's HTTP API (`POST /emails/batch`, one call per request with an
> `Idempotency-Key`), at `POST /v1/mail/contact` and `POST /v1/mail/cv-request` behind
> `CONTENT_API_TOKEN`. The web routes keep the public boundary: rate limits, reCAPTCHA, and
> signing the CV link. The React Email templates live in the API module. Amazon SES and its
> AWS keys in Vercel are removed.

## Context

Email went out through Amazon SES from the Next.js routes, with long-lived AWS keys in Vercel.
The admin and visitor emails were two separate sends, so a failure on the second made the
visitor retry and duplicated the first. Every failure was turned into `false`, so neither the
visitor nor Sentry saw why. The domain is moving to Resend, whose token is in 1Password as
`mrashidi.me RESEND_API_TOKEN`.

Resend's batch endpoint (docs read 2026-11-01) takes up to 100 emails in one request, accepts
an `Idempotency-Key` (at most 256 characters, kept 24 hours), and answers `{ data: [{ id }] }`
or `{ statusCode, name, message }`.

## Decision

- `apps/api/src/modules/mail/` owns who gets which email (`domain/`), the send commands
  (`application/`), the Resend adapter and the templates (`infrastructure/`), and the routes
  (`http/`). The Resend call is plain `fetch`, no SDK.
- Each request is one batch call: both emails go out or neither does. The idempotency key is
  derived from the request body, so a retry of the same submission within 24 hours sends nothing new.
- A Resend error becomes `MailDeliveryError` and a `502` from the API; the web route maps it
  to a `502` for the visitor.
- The request shapes are `ContactMessageSchema` and `CvRequestSchema` in `@mrashidi/types`,
  shared by the web forms and the API routes.
- `RESEND_API_TOKEN` is a Worker secret, set by `deploy-api.yml` from the GitHub secret that
  `infra/live/github` reads from 1Password. `MAIL_FROM` and `MAIL_TO` are `[vars]` in `wrangler.toml`.
- Resend's DKIM, MX and SPF records for the `send` subdomain live in the Terraform DNS records.

## Consequences

- **Gains:** no AWS keys in Vercel; one place for email; failures are visible; retries no
  longer duplicate mail.
- **Costs:** the API ships `react` and `react-email` to render templates; email needs the API
  running, so local forms need `pnpm dev:api` with a Resend token in `.dev.vars`.
- **Accepted risks:** Resend's free tier (100 emails a day) caps a spam wave; the web rate
  limits stay the first line. If Resend is down, both forms answer 502 until it recovers.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Keep SES and fix the error handling | Keeps AWS keys in Vercel, and the domain is moving to Resend |
| Resend from the Next.js routes | Keeps server work in the web app that DR-0009 and DR-0010 move to the API |
| Render templates in the web, send HTML to the API | The API becomes a relay for any HTML its caller sends; templates split from the data that fills them |
| Resend Node SDK | One `fetch` call covers the endpoint we use; the SDK adds a dependency for it |
| Cloudflare Email Routing `send_email` binding | Sends only to verified destination addresses, not to visitors |

## Implementation

- `apps/api/src/modules/mail/`, `apps/api/src/app.ts`, `apps/api/src/bindings.ts`, `apps/api/wrangler.toml`
- `packages/types/src/mail.ts`
- `apps/web/src/app/api/contact/route.ts`, `apps/web/src/app/api/resume/route.ts`,
  `apps/web/src/features/contact/server/`, `apps/web/src/features/resume/server/`
- `infra/live/github/variables.tf`, `infra/live/global/dns_records.auto.tfvars.json`, `.github/workflows/deploy-api.yml`

## Revisit when

- Daily mail regularly nears Resend's free-tier limit.
- Emails need attachments, which the batch endpoint does not support.
