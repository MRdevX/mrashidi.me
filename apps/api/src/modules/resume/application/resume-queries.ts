import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import type { ResumeRepository } from "../domain/resume-repository.ts";

export function createResumeQueries(repository: ResumeRepository) {
  return {
    experience: () => repository.listExperience(),
    async skills() {
      return (await repository.getSkills()) ?? notFound("Skills");
    },
    async education() {
      return (await repository.getEducation()) ?? notFound("Education");
    },
    async certificates() {
      return (await repository.getCertificates()) ?? notFound("Certificates");
    },
  };
}

function notFound(what: string): never {
  throw new ContentNotFoundError(what);
}

export type ResumeQueries = ReturnType<typeof createResumeQueries>;
