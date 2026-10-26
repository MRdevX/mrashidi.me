import { createDb } from "#db/index.ts";
import { createResumeQueries } from "./application/resume-queries.ts";
import { createD1ResumeRepository } from "./infrastructure/d1-resume-repository.ts";

export type { ResumeQueries } from "./application/resume-queries.ts";
export { resumeRoutes } from "./http/resume-routes.ts";

export function createResumeContext(db: D1Database) {
  return createResumeQueries(createD1ResumeRepository(createDb(db)));
}
