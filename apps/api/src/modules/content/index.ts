import { createDb } from "#db/index.ts";
import { createContentQueries } from "./application/content-queries.ts";
import { createD1ContentRepository } from "./infrastructure/d1-content-repository.ts";

export { ContentNotFoundError } from "./application/content-queries.ts";
export { contentRoutes } from "./http/content-routes.ts";

export function createContentContext(db: D1Database) {
  return createContentQueries(createD1ContentRepository(createDb(db)));
}
