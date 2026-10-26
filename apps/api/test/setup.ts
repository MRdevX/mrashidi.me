import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { beforeAll } from "vitest";
import { buildSeedStatements } from "../scripts/seed-sql.ts";

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  const statements = buildSeedStatements(fixtureContent, new Date("2026-01-01T00:00:00Z"));
  await env.DB.batch(statements.map((sql) => env.DB.prepare(sql)));
});
