import { Hono } from "hono";
import type { Bindings, HonoEnv } from "#bindings";
import { background } from "#shared/http/background.ts";
import { publicCache } from "#shared/http/public-cache.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import type { ProjectQueries } from "../application/project-queries.ts";

export function projectRoutes(queries: (env: Bindings, background: Background) => ProjectQueries) {
  return new Hono<HonoEnv>()
    .get("/projects", publicCache, async (c) => c.json(await queries(c.env, background(c)).list()))
    .get("/projects/overview", publicCache, async (c) => c.json(await queries(c.env, background(c)).overview()))
    .get("/projects/:slug", publicCache, async (c) =>
      c.json(await queries(c.env, background(c)).bySlug(c.req.param("slug")))
    );
}
