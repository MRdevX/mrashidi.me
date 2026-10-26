import { createDb } from "#db/index.ts";
import { createKnowledgeQueries } from "./application/knowledge-queries.ts";
import { createD1KnowledgeRepository } from "./infrastructure/d1-knowledge-repository.ts";

export { knowledgeRoutes } from "./http/knowledge-routes.ts";

export function createKnowledgeContext(db: D1Database) {
  return createKnowledgeQueries(createD1KnowledgeRepository(createDb(db)));
}
