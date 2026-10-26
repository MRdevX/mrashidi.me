import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import type { HonoEnv } from "#bindings";
import { createKnowledgeContext, knowledgeRoutes } from "#modules/ask-mr/index.ts";
import { createProfileContext, profileRoutes } from "#modules/profile/index.ts";
import { createProjectContext, projectRoutes } from "#modules/projects/index.ts";
import { createResumeContext, resumeRoutes } from "#modules/resume/index.ts";
import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import { requireContentToken } from "#shared/http/require-content-token.ts";

const app = new Hono<HonoEnv>();

app.use(secureHeaders());
app.use("/v1/*", requireContentToken);

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/v1", profileRoutes(createProfileContext));
app.route("/v1", resumeRoutes(createResumeContext));
app.route("/v1", projectRoutes(createProjectContext));
app.route("/v1", knowledgeRoutes(createKnowledgeContext));

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
