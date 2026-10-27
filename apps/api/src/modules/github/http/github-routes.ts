import { Hono } from "hono";
import type { Bindings, HonoEnv } from "#bindings";
import { background } from "#shared/http/background.ts";
import { publicCache } from "#shared/http/public-cache.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import type { GitHubQueries } from "../application/github-queries.ts";

export function githubRoutes(queries: (env: Bindings, background: Background) => GitHubQueries) {
  return new Hono<HonoEnv>().get("/github/contributions", publicCache, async (c) =>
    c.json(await queries(c.env, background(c)).contributions())
  );
}
