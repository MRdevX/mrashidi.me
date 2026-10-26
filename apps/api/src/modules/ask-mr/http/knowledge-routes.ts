import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import type { HonoEnv } from "#bindings";
import { cacheControl } from "#shared/http/cache-control.ts";
import type { KnowledgeQueries } from "../application/knowledge-queries.ts";

const requireContentToken = bearerAuth<HonoEnv>({
  verifyToken: (token, c) => timingSafeEqual(token, c.env.CONTENT_API_TOKEN),
});

export function knowledgeRoutes(queries: (db: D1Database) => KnowledgeQueries) {
  return new Hono<HonoEnv>().get("/knowledge", requireContentToken, cacheControl("private, no-store"), async (c) =>
    c.json(await queries(c.env.DB).knowledge())
  );
}
