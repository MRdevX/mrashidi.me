import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { Bindings, HonoEnv } from "#bindings";
import { background } from "#shared/http/background.ts";
import { publicCache } from "#shared/http/public-cache.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import type { BlogQueries } from "../application/blog-queries.ts";

const PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export function blogRoutes(queries: (env: Bindings, background: Background) => BlogQueries) {
  return new Hono<HonoEnv>().get("/blog/posts", publicCache, async (c) => {
    const parsed = PageQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      throw new HTTPException(400, { message: "page and limit must be positive integers, limit at most 100" });
    }
    return c.json(await queries(c.env, background(c)).page(parsed.data.page, parsed.data.limit));
  });
}
