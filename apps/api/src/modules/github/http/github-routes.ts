import { type Context, Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { GitHubQueries } from "../application/github-queries.ts";

export function githubRoutes(queries: (c: Context<HonoEnv>) => GitHubQueries) {
  return new Hono<HonoEnv>().get("/github/contributions", publicCache, async (c) =>
    c.json(await queries(c).contributions())
  );
}
