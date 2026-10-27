import type { Context } from "hono";
import type { HonoEnv } from "#bindings";
import type { Background } from "#shared/snapshot-read-through.ts";

export const background =
  (c: Context<HonoEnv>): Background =>
  (work) =>
    c.executionCtx.waitUntil(work);
