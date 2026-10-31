import type { ExperienceEntry } from "@mrashidi/types";
import { orNotFound } from "#shared/content-not-found-error.ts";
import { describeSkills } from "../domain/skills.ts";
import { durationMonths, parseWorkPeriod, toIsoMonth, yearMonthOf } from "../domain/work-period.ts";
import type { ResumeRepository } from "./ports.ts";

export function createResumeQueries(repository: ResumeRepository) {
  async function skills() {
    return orNotFound(await repository.getSkills(), "Skills");
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
      return orNotFound(await repository.getEducation(), "Education");
    },
    async certificates() {
      return orNotFound(await repository.getCertificates(), "Certificates");
    },
  };
}

export type ResumeQueries = ReturnType<typeof createResumeQueries>;
