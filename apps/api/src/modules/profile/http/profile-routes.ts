import { type Context, Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { ProfileQueries } from "../application/profile-queries.ts";

export function profileRoutes(queries: (c: Context<HonoEnv>) => ProfileQueries) {
  return new Hono<HonoEnv>()
    .get("/profile", publicCache, async (c) => c.json(await queries(c).profile()))
    .get("/about", publicCache, async (c) => c.json(await queries(c).about()));
}
