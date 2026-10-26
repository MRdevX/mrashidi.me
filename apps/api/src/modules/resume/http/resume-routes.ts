import { Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { ResumeQueries } from "../application/resume-queries.ts";

export function resumeRoutes(queries: (db: D1Database) => ResumeQueries) {
  return new Hono<HonoEnv>()
    .get("/experience", publicCache, async (c) => c.json(await queries(c.env.DB).experience(new Date())))
    .get("/skills", publicCache, async (c) => c.json(await queries(c.env.DB).skills()))
    .get("/education", publicCache, async (c) => c.json(await queries(c.env.DB).education()))
    .get("/certificates", publicCache, async (c) => c.json(await queries(c.env.DB).certificates()));
}
