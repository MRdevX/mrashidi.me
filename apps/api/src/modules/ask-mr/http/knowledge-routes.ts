import { Hono } from "hono";
import type { Bindings, HonoEnv } from "#bindings";
import { background } from "#shared/http/background.ts";
import { cacheControl } from "#shared/http/cache-control.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import type { KnowledgeQueries } from "../application/knowledge-queries.ts";

const noStore = cacheControl("private, no-store");

export function knowledgeRoutes(queries: (env: Bindings, background: Background) => KnowledgeQueries) {
  return new Hono<HonoEnv>()
    .get("/knowledge", noStore, async (c) => c.json(await queries(c.env, background(c)).knowledge()))
    .get("/knowledge/context", noStore, async (c) => c.json(await queries(c.env, background(c)).context(new Date())));
}
