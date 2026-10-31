import type { KnowledgeContext } from "@mrashidi/types";
import type { ProfileQueries } from "#modules/profile/index.ts";
import type { ProjectQueries } from "#modules/projects/index.ts";
import type { ResumeQueries } from "#modules/resume/index.ts";
import { orNotFound } from "#shared/content-not-found-error.ts";
import { buildKnowledgeContext } from "../domain/knowledge-context.ts";
import type { KnowledgeRepository } from "./ports.ts";

export interface SiteContentQueries {
  profile: ProfileQueries;
  resume: ResumeQueries;
  projects: ProjectQueries;
}

export function createKnowledgeQueries(repository: KnowledgeRepository, site: SiteContentQueries) {
  async function knowledge() {
    return orNotFound(await repository.getKnowledge(), "Knowledge");
  }

  return {
    knowledge,
    async context(now: Date): Promise<KnowledgeContext> {
      const [profile, about, experience, skills, projects, certificates, education, extra] = await Promise.all([
        site.profile.profile(),
        site.profile.about(),
        site.resume.experience(now),
        site.resume.skills(),
        site.projects.list(),
        site.resume.certificates(),
        site.resume.education(),
        knowledge(),
      ]);
      return {
        context: buildKnowledgeContext({
          profile,
          about,
          experience,
          skills,
          projects,
          certificates,
          education,
          knowledge: extra,
        }),
      };
    },
  };
}

export type KnowledgeQueries = ReturnType<typeof createKnowledgeQueries>;
