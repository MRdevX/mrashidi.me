import { type Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import type { HonoEnv } from "#bindings";
import { createDb } from "#db/index.ts";
import { createD1KnowledgeRepository, createKnowledgeQueries, knowledgeRoutes } from "#modules/ask-mr/index.ts";
import {
  blogRoutes,
  createBlogContext,
  createD1BlogSnapshotRepository,
  createMediumFeedGateway,
} from "#modules/blog/index.ts";
import {
  createD1GitHubSnapshotRepository,
  createGitHubContext,
  createGraphQLGitHubGateway,
  githubRoutes,
} from "#modules/github/index.ts";
import { createD1ProfileRepository, createProfileQueries, profileRoutes } from "#modules/profile/index.ts";
import {
  createD1ProjectRepository,
  createProjectQueries,
  createProjectRepoUrls,
  projectRoutes,
} from "#modules/projects/index.ts";
import { createD1ResumeRepository, createResumeQueries, resumeRoutes } from "#modules/resume/index.ts";
import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import { background } from "#shared/http/background.ts";
import { requireContentToken } from "#shared/http/require-content-token.ts";
import { InvalidContentError } from "#shared/invalid-content-error.ts";

function createModules(c: Context<HonoEnv>) {
  const db = createDb(c.env.DB);
  const profile = createProfileQueries(createD1ProfileRepository(db));
  const resume = createResumeQueries(createD1ResumeRepository(db));
  const projectRepository = createD1ProjectRepository(db);
  const github = createGitHubContext({
    repository: createD1GitHubSnapshotRepository(db),
    gateway: createGraphQLGitHubGateway(c.env.GH_API_TOKEN),
    profileUrl: () => profile.socialUrl("github"),
    repoUrls: createProjectRepoUrls(projectRepository),
    background: background(c),
  });
  const projects = createProjectQueries(projectRepository, { latestCommits: github.repoActivity });
  return {
    profile,
    resume,
    projects,
    github,
    knowledge: createKnowledgeQueries(createD1KnowledgeRepository(db), { profile, resume, projects }),
    blog: createBlogContext({
      repository: createD1BlogSnapshotRepository(db),
      gateway: createMediumFeedGateway(),
      profileUrl: () => profile.socialUrl("medium"),
      background: background(c),
    }),
  };
}

const app = new Hono<HonoEnv>();

app.use(secureHeaders());
app.use("/v1/*", requireContentToken);

app.get("/health", (c) => c.json({ status: "ok" }));
app.route(
  "/v1",
  profileRoutes((c) => createModules(c).profile)
);
app.route(
  "/v1",
  resumeRoutes((c) => createModules(c).resume)
);
app.route(
  "/v1",
  projectRoutes((c) => createModules(c).projects)
);
app.route(
  "/v1",
  knowledgeRoutes((c) => createModules(c).knowledge)
);
app.route(
  "/v1",
  githubRoutes((c) => createModules(c).github)
);
app.route(
  "/v1",
  blogRoutes((c) => createModules(c).blog)
);

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((error, c) => {
  if (error instanceof ContentNotFoundError) {
    return c.json({ error: error.message }, 404);
  }
  if (error instanceof InvalidContentError) {
    console.error(error);
    return c.json({ error: error.message }, 500);
  }
  if (error instanceof HTTPException) {
    return error.getResponse();
  }
  console.error(error);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
