import { type Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { BlogQueries } from "../application/blog-queries.ts";

const PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export function blogRoutes(queries: (c: Context<HonoEnv>) => BlogQueries) {
  return new Hono<HonoEnv>().get("/blog/posts", publicCache, async (c) => {
    const parsed = PageQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      throw new HTTPException(400, { message: "page and limit must be positive integers, limit at most 100" });
    }
    return c.json(await queries(c).page(parsed.data.page, parsed.data.limit));
  });
}
