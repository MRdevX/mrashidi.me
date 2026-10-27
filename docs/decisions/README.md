# Decision records

Durable engineering decisions for mrashidi.me, versioned with the code they constrain.

| Question | Where |
| -------- | ----- |
| What are we building, and when? | GitHub issues |
| **Why** did we build it this way? | **Here**, one file per decision |
| How does the site work today? | [`AGENTS.md`](../../AGENTS.md), [`docs/agent/`](../agent/stack.md), and the other `docs/` pages, rewritten freely to stay current |

A record is immutable history. Once `accepted`, edit it only to fix an error or change its
`status`. When the decision changes, write a new record that supersedes it.

## When to write one

Write a record when a change is:

- **Hard to reverse:** hosting, data storage, auth, a vendor choice
- **Cross-cutting:** touches several features, or the app plus CI or infrastructure
- **Non-obvious:** you rejected the option a competent engineer would reach for first
- **Expensive to re-derive:** you spent hours gathering evidence someone would otherwise gather again

Not for routine features, fixes, copy, or dependency bumps. If nothing was rejected, there was
no decision.

## Naming

`docs/decisions/NNNN-short-slug.md`. `NNNN` is zero-padded, assigned at creation, never reused,
and cited as **DR-0007**. The slug names the decision, not the task.

## Status

| Status | Meaning |
| ------ | ------- |
| `proposed` | Written, not yet agreed |
| `accepted` | In force until superseded |
| `superseded` | Replaced; `superseded_by` names the replacement |
| `reverted` | Tried and undone; the body says what broke |

Never delete a record.

## Adding one

1. Copy [`_template.md`](_template.md) to `NNNN-short-slug.md` with the next free number.
2. Fill every section; write "None" where one is empty.
3. Add a row to the index below in the same commit.
4. Link the record from the issue or PR that prompted it.

Skill: `house-decision`. The house rules have their own records (HR-NNNN) in the house-rules
repo; this folder covers this site's choices, including how it adopts them
([DR-0001](0001-adopt-shared-house-rules.md)).

## Index

| ID | Decision | Status | Date |
| -- | -------- | ------ | ---- |
| [DR-0001](0001-adopt-shared-house-rules.md) | Adopt the shared house rules, vendored from their own repo | `accepted` | 2026-10-13 |
| [DR-0002](0002-feature-slices.md) | Organise code by feature slice under src/features | `accepted` | 2026-10-13 |
| [DR-0003](0003-biome-only.md) | Lint and format with Biome only | `accepted` | 2025-08-27 |
| [DR-0004](0004-ask-mr-grounded-public-knowledge.md) | Ground Ask MR only in public site data and a public knowledge file | `superseded` | 2026-10-13 |
| [DR-0005](0005-turborepo-web-on-vercel-api-on-workers.md) | Split the site into a Turborepo with Next.js on Vercel and a Hono API on Workers | `accepted` | 2026-10-26 |
| [DR-0006](0006-personal-data-in-d1.md) | Keep personal data in D1, seeded from a private repo | `accepted` | 2026-10-26 |
| [DR-0007](0007-ask-mr-knowledge-from-d1.md) | Load Ask MR knowledge from the content API and guard it at seed time | `superseded` | 2026-10-26 |
| [DR-0008](0008-apply-on-merge-behind-approval.md) | Apply infra and deploy the API on merge behind an approval gate | `accepted` | 2026-10-26 |
| [DR-0009](0009-api-owns-content-derivations.md) | Derive content read models in the API, render them in the web app | `accepted` | 2026-10-26 |
| [DR-0010](0010-private-content-api-over-workers-dev.md) | Serve the content API privately to Vercel over workers.dev | `accepted` | 2026-10-26 |
| [DR-0011](0011-api-owns-external-sources-on-cron.md) | Fetch GitHub and Medium in the API on a cron, serve them from D1 | `superseded` | 2026-10-27 |
| [DR-0012](0012-refresh-external-sources-on-request.md) | Refresh GitHub and Medium snapshots on request instead of on a cron | `accepted` | 2026-10-27 |
