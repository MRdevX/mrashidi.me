import { Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { cacheControl } from "#shared/http/cache-control.ts";
import type { KnowledgeQueries } from "../application/knowledge-queries.ts";

const noStore = cacheControl("private, no-store");

export function knowledgeRoutes(queries: (db: D1Database) => KnowledgeQueries) {
  return new Hono<HonoEnv>()
    .get("/knowledge", noStore, async (c) => c.json(await queries(c.env.DB).knowledge()))
    .get("/knowledge/context", noStore, async (c) => c.json(await queries(c.env.DB).context(new Date())));
}
