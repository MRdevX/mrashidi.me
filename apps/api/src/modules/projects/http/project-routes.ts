import { type Context, Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { ProjectQueries } from "../application/project-queries.ts";

export function projectRoutes(queries: (c: Context<HonoEnv>) => ProjectQueries) {
  return new Hono<HonoEnv>()
    .get("/projects", publicCache, async (c) => c.json(await queries(c).list()))
    .get("/projects/overview", publicCache, async (c) => c.json(await queries(c).overview()))
    .get("/projects/:slug", publicCache, async (c) => c.json(await queries(c).bySlug(c.req.param("slug"))));
}
