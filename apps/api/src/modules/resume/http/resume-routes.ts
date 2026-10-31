import { type Context, Hono } from "hono";
import type { HonoEnv } from "#bindings";
import { publicCache } from "#shared/http/public-cache.ts";
import type { ResumeQueries } from "../application/resume-queries.ts";

export function resumeRoutes(queries: (c: Context<HonoEnv>) => ResumeQueries) {
  return new Hono<HonoEnv>()
    .get("/experience", publicCache, async (c) => c.json(await queries(c).experience(new Date())))
    .get("/skills", publicCache, async (c) => c.json(await queries(c).skills()))
    .get("/skills/overview", publicCache, async (c) => c.json(await queries(c).skillsOverview()))
    .get("/education", publicCache, async (c) => c.json(await queries(c).education()))
    .get("/certificates", publicCache, async (c) => c.json(await queries(c).certificates()));
}
