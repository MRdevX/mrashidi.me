import { Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { ProjectQueries } from "../application/project-queries.ts";

export function projectRoutes(queries: (db: D1Database) => ProjectQueries) {
  return new Hono<HonoEnv>()
    .get("/projects", publicCache, async (c) => c.json(await queries(c.env.DB).list()))
    .get("/projects/overview", publicCache, async (c) => c.json(await queries(c.env.DB).overview()))
    .get("/projects/:slug", publicCache, async (c) => c.json(await queries(c.env.DB).bySlug(c.req.param("slug"))));
}
