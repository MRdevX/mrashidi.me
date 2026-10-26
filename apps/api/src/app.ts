import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import type { HonoEnv } from "#bindings";
import { ContentNotFoundError, contentRoutes, createContentContext } from "#modules/content/index.ts";

const VERCEL_PREVIEW = /^https:\/\/mrashidi-[a-z0-9-]+-notablenomads\.vercel\.app$/;

function isAllowedOrigin(origin: string, allowed: string): boolean {
  return allowed.split(",").includes(origin) || VERCEL_PREVIEW.test(origin);
}

const app = new Hono<HonoEnv & { Variables: { content: ReturnType<typeof createContentContext> } }>();

app.use(secureHeaders());
app.use(
  "/v1/*",
  cors({
    origin: (origin, c) => (isAllowedOrigin(origin, c.env.ALLOWED_ORIGINS) ? origin : null),
    allowMethods: ["GET"],
  })
);
app.use("/v1/*", async (c, next) => {
  c.set("content", createContentContext(c.env.DB));
  await next();
});

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/v1", contentRoutes);

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((error, c) => {
  if (error instanceof ContentNotFoundError) {
    return c.json({ error: error.message }, 404);
  }
  if (error instanceof HTTPException) {
    return error.getResponse();
  }
  console.error(error);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
