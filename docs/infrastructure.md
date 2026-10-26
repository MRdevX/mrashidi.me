# Infrastructure

The site runs on two platforms ([DR-0005](decisions/0005-turborepo-web-on-vercel-api-on-workers.md)):
`apps/web` on Vercel, `apps/api` on Cloudflare Workers with D1. Terraform under [`infra/`](../infra/README.md)
owns the standing resources; Wrangler deploys Worker code. Changes plan on PRs and apply on merge
behind the `deploy-gate` environment's approval ([DR-0008](decisions/0008-apply-on-merge-behind-approval.md)).

## Accounts

| What | Value |
| ---- | ----- |
| Cloudflare account | `7a13fd636e452aa1f621cc114645e586` (shared with masir and r4zzle) |
| Zone `mrashidi.me` | `e4e27fbd7bfea8bd87ea5094e8373279`, Free plan |
| Vercel project | `mrashidi-me` `prj_VBXHt24ZaW39eQpBtAunf3ukcjei`, team `notablenomads` `team_bCKuRe2AM8cqq2m3iFfobtkX` |
| Terraform state | R2 bucket `mrashidi-tf-state`, one key per root |
| Secrets | 1Password vault `Notable Nomads` (shared by the projects): one Password item per GitHub Actions secret, titled `mrashidi.me <SECRET>`, value in the password field |

## Ownership

| Owner | Owns |
| ----- | ---- |
| Terraform `live/global` | Every DNS record in the zone except custom-domain records |
| Terraform `live/production` | D1 `mrashidi-db`, Worker custom domain `api.mrashidi.me`, Vercel project settings and domains, the env vars `CONTENT_API_URL`, `CONTENT_API_TOKEN`, `REVALIDATE_SECRET` |
| Terraform `live/github` | GitHub Actions secrets and variables, the `deploy-gate` environment |
| Wrangler | Worker code and bindings (`apps/api/wrangler.toml`), Worker secret `CONTENT_API_TOKEN`, D1 migrations |
| By hand | API tokens, R2 S3 keys, 1Password items; R2 bucket `mrashidi-me-bucket` and its `s3.mrashidi.me` domain (outside Terraform) |
| Vercel dashboard | Every other web env var (AI Gateway, Upstash, SES, Sentry, reCAPTCHA, Blob) |

Never add a custom-domain hostname (`api`, `s3`) to `dns_records`: its owner creates and deletes that record.

## Tokens and secrets

| 1Password item / GitHub secret | What it is |
| ------------------------------ | ---------- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare "mrashidi deploy": Account · Workers Scripts edit, D1 edit, Account Settings read; Zone `mrashidi.me` · Workers Routes edit; used by `deploy-api.yml` |
| `TF_CLOUDFLARE_API_TOKEN` | Cloudflare "mrashidi terraform": Account · D1 edit, Workers R2 Storage edit, Workers Scripts edit (attaching a Worker custom domain needs it); Zone `mrashidi.me` · DNS edit, Workers Routes edit, Zone read. Also used by `bootstrap` |
| `TF_R2_ACCESS_KEY_ID`, `TF_R2_SECRET_ACCESS_KEY` | R2 S3 key pair, Object Read & Write on `mrashidi-tf-state` only |
| `TF_VERCEL_API_TOKEN` | Vercel token scoped to the notablenomads team |
| `GITHUB_TERRAFORM_PAT` | Fine-grained PAT on this repo: Administration, Environments, Secrets, Variables write; read by `live/github` only, not copied to GitHub |
| `CONTENT_API_TOKEN` | Random 32+ bytes; bearer for `GET /v1/knowledge`, set on the Worker and on Vercel |
| `REVALIDATE_SECRET` | Random 32+ bytes; the seed script sends it to the web app's revalidate route (Phase 5) |

Locally, Terraform reads the same values with `op run --env-file infra/.env.op -- <command>`, so values
never land in shell history or files. `live/github` reads the vault through the 1Password desktop app
(`OP_ACCOUNT=my.1password.com`, approve the prompt) and needs `TF_VAR_github_token`, a fine-grained PAT
on this repo with Secrets, Variables, Environments and Administration write, stored as
`mrashidi.me GITHUB_TERRAFORM_PAT`. No service account: nothing in CI reads 1Password.

## First run

1. Create the vault items and tokens above.
2. `pnpm infra:apply:bootstrap` (R2 write comes from the terraform token), then create the R2 S3 key pair.
3. `terraform -chdir=infra/live/github init`, then `pnpm infra:apply:github`.
4. `pnpm infra:import-dns`, review the diff, `terraform -chdir=infra/live/global init`,
   `pnpm infra:plan:global` must show only imports, then apply.
5. `terraform -chdir=infra/live/production apply -var api_worker_deployed=false` creates D1 and imports the
   Vercel project (plan must show no Vercel changes besides the three env vars). Put the
   `d1_database_id` output into `apps/api/wrangler.toml`.
6. From `apps/api`: `pnpm db:migrate:remote`, `pnpm exec wrangler deploy`, `wrangler secret put CONTENT_API_TOKEN`.
7. `pnpm infra:apply:production` attaches `api.mrashidi.me`.
8. `pnpm --filter @mrashidi/api db:seed --source ../mrashidi-data --remote` loads the real content. With
   `REVALIDATE_URL=https://www.mrashidi.me/api/revalidate` and `REVALIDATE_SECRET` set, it also refreshes the
   site's content cache; otherwise pages pick up changes within an hour.

After that, merges to `main` apply Terraform and deploy the API through `infra.yml` and `deploy-api.yml`.

## Bot Fight Mode

Bot Fight Mode is on for the zone and stays on. On the Free plan it applies to every hostname,
`api.mrashidi.me` included, and cannot be skipped by rule, so it challenges non-browser requests from
datacenter IPs. Consequences:

- `deploy-api.yml` does not curl the API: GitHub runners get 403. It checks with
  `wrangler deployments status` that the version it deployed serves 100% of traffic.
- Vercel's server-side fetches currently pass. If one is ever challenged, the fetch fails and Next keeps
  serving the last cached page; reseeding or the hourly revalidation retries.
- Smoke-test the API from your own machine: `curl https://api.mrashidi.me/health`.

## Rollback

- Worker: `pnpm --filter @mrashidi/api exec wrangler rollback`.
- Content: re-run the seed from an earlier commit of `mrashidi-data`.
- D1 schema: migrations are append-only; ship a new migration that reverses the change.
