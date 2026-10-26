# infra

Terraform for mrashidi.me. Accounts, ownership, tokens, first-run order and rollback:
[docs/infrastructure.md](../docs/infrastructure.md).

| Root | State key | Owns |
| ---- | --------- | ---- |
| `bootstrap/` | local, gitignored | R2 bucket `mrashidi-tf-state` |
| `live/global/` | `global/terraform.tfstate` | Zone DNS records (imported by `scripts/fetch-zone-import.mjs`) |
| `live/production/` | `production/terraform.tfstate` | D1, `api.mrashidi.me`, Vercel project, domains and API env vars |
| `live/github/` | `github/terraform.tfstate` | GitHub Actions secrets, variables, `deploy-gate` environment |

Terraform version: [`.terraform-version`](.terraform-version). Not a pnpm workspace; use
`pnpm infra:plan:<root>` / `pnpm infra:apply:<root>` or `terraform -chdir=…`. Run `init` once per root.
Wrap commands in `op run --env-file infra/.env.op --` so the inputs come from 1Password.

An import or a refactor is applied only after its plan shows no changes beyond the imports.
