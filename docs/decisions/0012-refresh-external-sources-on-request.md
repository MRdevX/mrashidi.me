---
id: 0012
title: Refresh GitHub and Medium snapshots on request instead of on a cron
issues: []
status: accepted
date: 2026-10-27
supersedes: ["DR-0011"]
superseded_by: []
related: ["DR-0009", "DR-0011"]
areas: [api, infra]
---

# DR-0012: Refresh GitHub and Medium snapshots on request instead of on a cron

> The Worker has no Cron Trigger. Each snapshot route reads the snapshot from D1 and applies
> stale-while-revalidate. With no snapshot, it fetches the source, saves it and answers. With a
> snapshot younger than six hours, it answers from D1. With an older one, it answers from D1 at
> once and refreshes the snapshot after the response with `waitUntil`. DR-0011's snapshots,
> modules, and domain rules stay; only the trigger changes.

## Context

DR-0011 refreshed the snapshots on a Cron Trigger every six hours. The Cloudflare account is
on the Workers Free plan, which allows five Cron Triggers per account, and other projects use
all five. Wrangler uploaded the Worker but couldn't register the schedule, so every Deploy API
run failed and the snapshots were never written. The blog and GitHub contributions showed
errors in production.

## Decision

- `apps/api/src/shared/snapshot-read-through.ts` owns the rule: a missing snapshot is fetched
  inline; a stale one (six hours or older) is served and refreshed in the background.
- Refresh commands return what they saved. GitHub contributions and repository activity are
  separate commands with separate staleness.
- Routes pass the Worker env and `c.executionCtx.waitUntil` to their module contexts, so the
  GitHub token and background work reach the request path.
- A failed background refresh is logged and keeps the previous snapshot. A failed first fetch
  fails contributions and blog requests; repository activity falls back to none, so project
  pages don't depend on GitHub.
- `scheduled.ts` and `[triggers]` in `wrangler.toml` are removed.

## Consequences

- **Gains:** deploys no longer depend on the account's cron quota; a new deploy needs no cron
  run before snapshot routes answer; data refreshes only when someone reads it.
- **Costs:** the first request on an empty snapshot waits on GitHub or Medium; data can be one
  read older than six hours, plus the web's hourly revalidate.
- **Accepted risks:** concurrent requests on a stale snapshot can each start a refresh. The
  web's tagged cache and `publicCache` keep that to a few requests, and refreshes are
  idempotent upserts.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Free a cron slot or upgrade to Workers Paid | Ties this API's deploys to other projects or to a paid plan |
| Always refresh inline when stale | Visitors wait on GitHub and Medium every six hours |
| A refresh lease column to stop duplicate refreshes | A migration and more code for a few extra upstream calls |

## Implementation

- `apps/api/src/shared/snapshot-read-through.ts`, `apps/api/src/shared/http/background.ts`, `apps/api/src/db/snapshots.ts`
- `apps/api/src/modules/{blog,github,projects,ask-mr}/`, `apps/api/src/app.ts`, `apps/api/src/index.ts`, `apps/api/wrangler.toml`

## Revisit when

- The account moves to Workers Paid and pre-warmed snapshots matter more than the quota.
- Traffic grows enough that duplicate background refreshes cost real upstream quota.
