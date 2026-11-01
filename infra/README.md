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
`pnpm infra:init|plan|apply:<root>` or `terraform -chdir=…`. Run init once per root; the live roots
share the R2 backend settings in [`backend.r2.hcl`](backend.r2.hcl) (`init -backend-config=../../backend.r2.hcl`).
CI lints every root with `terraform fmt`, `validate` and TFLint ([`.tflint.hcl`](.tflint.hcl)).
Wrap commands in `op run --env-file infra/.env.op --` so the inputs come from 1Password.

An import or a refactor is applied only after its plan shows no changes beyond the imports.
