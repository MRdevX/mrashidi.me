import { createDb } from "#db/index.ts";
import { createProfileQueries } from "./application/profile-queries.ts";
import { createD1ProfileRepository } from "./infrastructure/d1-profile-repository.ts";

export type { ProfileQueries } from "./application/profile-queries.ts";
export { profileRoutes } from "./http/profile-routes.ts";

export function createProfileContext(db: D1Database) {
  return createProfileQueries(createD1ProfileRepository(createDb(db)));
}
