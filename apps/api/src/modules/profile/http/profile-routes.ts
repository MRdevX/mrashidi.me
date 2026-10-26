import { Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { ProfileQueries } from "../application/profile-queries.ts";

export function profileRoutes(queries: (db: D1Database) => ProfileQueries) {
  return new Hono<HonoEnv>()
    .get("/profile", publicCache, async (c) => c.json(await queries(c.env.DB).profile()))
    .get("/about", publicCache, async (c) => c.json(await queries(c.env.DB).about()));
}
