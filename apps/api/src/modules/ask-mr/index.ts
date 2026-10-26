import { createDb } from "#db/index.ts";
import { createProfileContext } from "#modules/profile/index.ts";
import { createProjectContext } from "#modules/projects/index.ts";
import { createResumeContext } from "#modules/resume/index.ts";
import { createKnowledgeQueries } from "./application/knowledge-queries.ts";
import { createD1KnowledgeRepository } from "./infrastructure/d1-knowledge-repository.ts";

export { knowledgeRoutes } from "./http/knowledge-routes.ts";

export function createKnowledgeContext(db: D1Database) {
  return createKnowledgeQueries(createD1KnowledgeRepository(createDb(db)), {
    profile: createProfileContext(db),
    resume: createResumeContext(db),
    projects: createProjectContext(db),
  });
}
