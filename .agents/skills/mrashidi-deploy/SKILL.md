---
name: mrashidi-deploy
description: >-
  Deploys and operates mrashidi.me infrastructure: Terraform roots under infra/, the API
  Worker deploy, remote D1 migrations and seeding, rollback. Use when changing infra/,
  shipping or rolling back the API, loading content into production, or rotating a secret.
disable-model-invocation: false
---

# mrashidi.me deploy

Read [docs/infrastructure.md](../../../docs/infrastructure.md) first: accounts, ownership, tokens.
Binding rules: [DR-0005](../../../docs/decisions/0005-turborepo-web-on-vercel-api-on-workers.md),
[DR-0008](../../../docs/decisions/0008-apply-on-merge-behind-approval.md).

## Normal path

- Infra: change `infra/`, open a PR, read the plan comment from `infra.yml`; merging applies after
  the `production` approval.
- API: merge changes under `apps/api` or `packages/types`; `deploy-api.yml` tests, migrates,
  deploys and smoke-checks after approval.
- Web: Vercel deploys `main` on its own.

## Local Terraform

Wrap every command in `op run --env-file infra/.env.op --`; never paste a token into a shell or
file. `init` once per root. Show the plan to the owner before any `apply`. An import is applied only
when its plan has no changes besides the imports. `live/github` runs only locally.

## Content

`pnpm --filter @mrashidi/api db:seed --source ../mrashidi-data --remote` replaces production
content after validating it. Real content lives only in the private `mrashidi-data` repo
([DR-0006](../../../docs/decisions/0006-personal-data-in-d1.md)).

## Rollback and rotation

- Worker: `pnpm --filter @mrashidi/api exec wrangler rollback`.
- Secret: update the 1Password item, apply `live/github`, then re-run `deploy-api.yml`
  (`workflow_dispatch`) and the `production` root so the Worker and Vercel get the new value.
