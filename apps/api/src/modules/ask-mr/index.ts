import type { Bindings } from "#bindings";
import { createDb } from "#db/index.ts";
import { createProfileContext } from "#modules/profile/index.ts";
import { createProjectContext } from "#modules/projects/index.ts";
import { createResumeContext } from "#modules/resume/index.ts";
import type { Background } from "#shared/snapshot-read-through.ts";
import { createKnowledgeQueries } from "./application/knowledge-queries.ts";
import { createD1KnowledgeRepository } from "./infrastructure/d1-knowledge-repository.ts";

export { knowledgeRoutes } from "./http/knowledge-routes.ts";

export function createKnowledgeContext(env: Bindings, background: Background) {
  return createKnowledgeQueries(createD1KnowledgeRepository(createDb(env.DB)), {
    profile: createProfileContext(env.DB),
    resume: createResumeContext(env.DB),
    projects: createProjectContext(env, background),
  });
}
