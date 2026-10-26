---
id: 0008
title: Apply infra and deploy the API on merge behind an approval gate
issues: []
status: accepted
date: 2026-10-26
supersedes: []
superseded_by: []
related: [DR-0005, DR-0006]
areas: [infra, ci, api]
---

# DR-0008: Apply infra and deploy the API on merge behind an approval gate

> Terraform plans on every PR that touches `infra/` and comments the plan. A push to `main` applies
> `live/global` and `live/production` and deploys `apps/api`, each in a job bound to the GitHub
> `deploy-gate` environment, which waits for the owner's approval. `live/github` is applied only from a
> workstation. There is no staging: Vercel previews and local `wrangler dev` cover it.

## Context

masir-app applies production infra when a draft GitHub Release is published (masir DR-0043).
This repo already releases automatically on every `main` push (`auto-release.yml`, standard-version),
so a release-gated apply would gate nothing. The site has one owner, one environment, and a
read-only API; a staging Worker and D1 would double the infra for no reviewer.

## Decision

- `infra.yml`: PRs run fmt, validate and plan for `global` and `production` and comment the plan
  without saving it (`-out` would embed secrets). Push to `main` applies both roots one at a time.
- `deploy-api.yml`: push to `main` touching `apps/api`, `packages/types` or the lockfile runs the
  Worker tests, remote D1 migrations, `wrangler deploy`, the `CONTENT_API_TOKEN` secret and a smoke check.
- Both jobs use the `deploy-gate` environment (required reviewer: the owner, protected branches only),
  managed by `live/github`. It is not named `production`: GitHub environment names are
  case-insensitive and Vercel's integration already owns `Production` for its deployment records.
- `live/github` writes the secrets these workflows use, so CI never holds the 1Password service
  account or an admin PAT.

## Consequences

- **Gains:** nothing reaches Cloudflare or Vercel settings without a reviewed plan and a click.
- **Costs:** a merge that touches both API and infra asks for two approvals.
- **Accepted risks:** the plan reviewed on the PR can differ from the one applied after merge if
  something drifted in between; the apply log shows the plan it ran.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Release-gated apply like masir | Releases happen on every `main` push here, so the gate would be automatic |
| Apply without approval | A wrong DNS change takes the site and mail down with no human in the loop |
| Staging environment | One owner, read-only API; previews and `wrangler dev` already cover it |

## Implementation

- [x] `.github/workflows/infra.yml`, `.github/workflows/deploy-api.yml`, `.github/actions/terraform/`
- [x] `infra/live/github/main.tf` (`github_repository_environment.deploy_gate`)

## Revisit when

- The API gains write endpoints or a second environment is needed.
- Someone besides the owner reviews infra changes.
