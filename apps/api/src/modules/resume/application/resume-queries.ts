import type { ExperienceEntry } from "@mrashidi/types";
import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import type { ResumeRepository } from "../domain/resume-repository.ts";
import { describeSkills } from "../domain/skills.ts";
import { durationMonths, parseWorkPeriod, toIsoMonth, yearMonthOf } from "../domain/work-period.ts";

export function createResumeQueries(repository: ResumeRepository) {
  async function skills() {
    return (await repository.getSkills()) ?? notFound("Skills");
  }

  return {
    async experience(now: Date): Promise<ExperienceEntry[]> {
      const today = yearMonthOf(now);
      return (await repository.listExperience()).map((role) => {
        const period = parseWorkPeriod(role.period);
        return {
          ...role,
          start: toIsoMonth(period.start),
          end: period.end ? toIsoMonth(period.end) : null,
          durationMonths: durationMonths(period, today),
        };
      });
    },
    skills,
    async skillsOverview() {
      return describeSkills(await skills());
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
