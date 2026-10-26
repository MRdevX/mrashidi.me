import { createDb } from "#db/index.ts";
import { createProjectQueries } from "./application/project-queries.ts";
import { createD1ProjectRepository } from "./infrastructure/d1-project-repository.ts";

export type { ProjectQueries } from "./application/project-queries.ts";
export { projectRoutes } from "./http/project-routes.ts";

export function createProjectContext(db: D1Database) {
  return createProjectQueries(createD1ProjectRepository(createDb(db)));
}
