---
name: mrashidi-d1-migration
description: >-
  Changes the D1 schema of @mrashidi/api with Drizzle and reseeds content: edit the
  schema, generate a migration, apply it locally, seed from fixtures or the private
  data repo. Use when adding or changing a table or column, or loading content into D1.
disable-model-invocation: false
---

# mrashidi.me D1 migration and seed

## Schema change

1. Edit `apps/api/src/db/schema.ts`.
2. `pnpm --filter @mrashidi/api db:generate --name <what>`; read the SQL in `apps/api/migrations/`.
3. `pnpm --filter @mrashidi/api db:migrate:local`, then update `apps/api/scripts/seed-sql.ts` if the tables it writes changed.
4. `pnpm check-migrations` (also in `pnpm gate`) checks the journal against the SQL files.

Migrations are append-only. Never edit one that has reached production; add a new one.
Production migrations run in the API deploy (`cf:deploy` runs `db:migrate:remote` first).

## Seed

- `pnpm --filter @mrashidi/api db:seed` loads the fixtures from `packages/types/fixtures/` into local D1.
- `--source <dir>` (or `MR_DATA_DIR`) loads another folder with the same file names, e.g. the private `mrashidi-data` checkout. `--remote` writes production D1.
- The seed validates against `ContentSchema`, including the Ask MR privacy rule ([DR-0007](../../../docs/decisions/0007-ask-mr-knowledge-from-d1.md)), and replaces every row, so it is safe to re-run.
- Real content never goes into this repo ([DR-0006](../../../docs/decisions/0006-personal-data-in-d1.md)).
