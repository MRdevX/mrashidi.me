---
id: 0011
title: Fetch GitHub and Medium in the API on a cron, serve them from D1
issues: []
status: superseded
date: 2026-10-27
supersedes: []
superseded_by: ["DR-0012"]
related: [DR-0005, DR-0009, DR-0010]
areas: [api, app, infra]
---

# DR-0011: Fetch GitHub and Medium in the API on a cron, serve them from D1

> The Worker fetches the external sources the site shows (GitHub commit activity and
> contributions, the Medium feed) on a Cron Trigger every six hours and stores each result as
> a JSON snapshot in D1. `/v1` routes and read models serve only those snapshots, so no page
> request waits on GitHub or Medium. Rules on that data (the contribution year, a project's
> last activity, commit links) live in the API's domain, as DR-0009 requires for content.
> The web keeps presentation. A failed refresh keeps the previous snapshot and fails the cron
> run so it shows in Workers observability.

## Context

After DR-0009 the web still held the integrations:

- Every visitor's browser called `/api/github?action=commit-info&url=…` once per project
  (two to four GitHub REST calls each), cached the result in `localStorage`, and sorted
  "Recently updated" from it. The route accepted any GitHub URL, so it spent the site's token
  on whatever repository a caller named.
- `/api/github/contributions` ran a GraphQL query on Vercel with a username in code.
- The Medium RSS fetch and HTML cleanup ran on Vercel, behind `/api/blog`, the home terminal,
  and an in-memory cache in the Ask MR tools.

A Worker on the Free plan allows 50 subrequests per invocation. Fetching live per request
would put GitHub's and Medium's latency and outages on page loads.

## Decision

- An API module per source (`github`, `blog`) under the usual slice layout. The gateway
  (GraphQL or RSS) is an `infrastructure/` adapter behind a `domain/` port. A refresh is an
  `application/` command. Reads are queries over a snapshot repository.
- D1 table `snapshots` (`key`, `data` JSON, `fetched_at`), written only by refresh commands.
  Content seeding does not touch it.
- `apps/api/src/scheduled.ts` is the second composition root next to `app.ts`. It reads the
  profile and projects through their modules' public entries and runs each source's refresh
  in isolation. `wrangler.toml` schedules it at `0 */6 * * *`.
- GitHub repository commits come from a single aliased GraphQL query for all catalog repos.
  The Worker secret `GH_API_TOKEN` replaces Vercel's `GH_REST_API_TOKEN`.
- The GitHub login and the Medium feed come from the profile (`social.github`,
  `social.medium`), not from code.
- Response changes stay additive (DR-0009). Before the first refresh a snapshot route answers
  404 and project activity falls back to the end of the project's last year.

## Consequences

- **Gains:** pages render commit dates and the "recent" order on the server; no browser
  fan-out to GitHub; the open commit proxy is gone; the GitHub token lives only in the Worker;
  one place to change each integration.
- **Costs:** data can be up to six hours old plus the web's hourly revalidate; one more
  secret and one more table; a new deploy needs one cron run before snapshot routes answer.
- **Accepted risks:** a long GitHub or Medium outage serves stale data without notice to
  visitors. The failed cron runs show in Workers observability.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Fetch on request in the Worker, cached with the Cache API | Page loads wait on GitHub and Medium; per-repo calls run into the subrequest limit |
| Workers KV for snapshots | A second storage product for data D1 already holds well; KV is eventually consistent |
| Keep the integrations in the web and close the proxy | Leaves the token on Vercel and the derived rules in the web, against DR-0009 |

## Implementation

- `apps/api/src/modules/github/`, `apps/api/src/modules/blog/`, `apps/api/src/scheduled.ts`, `apps/api/src/index.ts`
- `apps/api/src/db/snapshots.ts`, `apps/api/migrations/0001_snapshots.sql`, `apps/api/wrangler.toml`
- `apps/web/src/lib/content/server.ts`, `apps/web/src/app/api/github/contributions/route.ts`, `apps/web/src/app/api/blog/route.ts`
- `.github/workflows/deploy-api.yml`, `infra/live/github/variables.tf`

## Revisit when

- Visitors need fresher data than six hours (move to a webhook or a shorter cron).
- The site adds a source that needs per-request input, such as a search.
