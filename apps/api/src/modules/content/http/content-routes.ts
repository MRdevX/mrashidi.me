import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import type { HonoEnv } from "#bindings";
import { cacheControl } from "#shared/http/cache-control.ts";
import type { ContentQueries } from "../application/content-queries.ts";

type ContentEnv = HonoEnv & { Variables: { content: ContentQueries } };

const publicCache = cacheControl("public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
const requireContentToken = bearerAuth<ContentEnv>({
  verifyToken: (token, c) => timingSafeEqual(token, c.env.CONTENT_API_TOKEN),
});

export const contentRoutes = new Hono<ContentEnv>()
  .get("/profile", publicCache, async (c) => c.json(await c.var.content.section("profile")))
  .get("/about", publicCache, async (c) => c.json(await c.var.content.section("about")))
  .get("/skills", publicCache, async (c) => c.json(await c.var.content.section("skills")))
  .get("/education", publicCache, async (c) => c.json(await c.var.content.section("education")))
  .get("/certificates", publicCache, async (c) => c.json(await c.var.content.section("certificates")))
  .get("/experience", publicCache, async (c) => c.json(await c.var.content.listExperience()))
  .get("/projects", publicCache, async (c) => c.json(await c.var.content.listProjects()))
  .get("/projects/:slug", publicCache, async (c) => c.json(await c.var.content.project(c.req.param("slug"))))
  .get("/knowledge", requireContentToken, cacheControl("private, no-store"), async (c) =>
    c.json(await c.var.content.section("knowledge"))
  );
