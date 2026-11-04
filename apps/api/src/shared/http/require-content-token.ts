import type { Context } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import type { HonoEnv } from "#bindings";

const READ_METHODS = new Set(["GET", "HEAD"]);

async function canRead(token: string, c: Context<HonoEnv>): Promise<boolean> {
  const readToken = c.env.CONTENT_API_READ_TOKEN;
  return READ_METHODS.has(c.req.method) && Boolean(readToken) && (await timingSafeEqual(token, readToken ?? ""));
}

export const requireContentToken = bearerAuth<HonoEnv>({
  verifyToken: async (token, c) => (await timingSafeEqual(token, c.env.CONTENT_API_TOKEN)) || canRead(token, c),
});
