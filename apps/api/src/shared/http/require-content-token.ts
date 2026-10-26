import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import type { HonoEnv } from "#bindings";

export const requireContentToken = bearerAuth<HonoEnv>({
  verifyToken: (token, c) => timingSafeEqual(token, c.env.CONTENT_API_TOKEN),
});
