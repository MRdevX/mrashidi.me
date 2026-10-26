import {
  AboutSchema,
  AskMrKnowledgeSchema,
  CertificateCategorySchema,
  EducationSchema,
  ProfileSchema,
  ProjectSchema,
  SkillCategorySchema,
  WorkExperienceSchema,
} from "@mrashidi/types";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import type { Db } from "#db/index.ts";
import { contentSections, projects, workExperience } from "#db/schema.ts";
import type { ContentRepository, SectionContent, SectionKey } from "../domain/content-repository.ts";

const SECTION_SCHEMAS: { [K in SectionKey]: z.ZodType<SectionContent[K]> } = {
  profile: ProfileSchema,
  about: AboutSchema,
  education: z.array(EducationSchema),
  certificates: z.array(CertificateCategorySchema),
  skills: z.array(SkillCategorySchema),
  knowledge: AskMrKnowledgeSchema,
};

export function createD1ContentRepository(db: Db): ContentRepository {
  return {
    async getSection(key) {
      const row = await db.query.contentSections.findFirst({ where: eq(contentSections.key, key) });
      return row ? SECTION_SCHEMAS[key].parse(row.data) : null;
    },
    async listProjects() {
      const rows = await db.select({ data: projects.data }).from(projects).orderBy(asc(projects.position));
      return rows.map((row) => ProjectSchema.parse(row.data));
    },
    async getProject(slug) {
      const row = await db.query.projects.findFirst({ where: eq(projects.slug, slug) });
      return row ? ProjectSchema.parse(row.data) : null;
    },
    async listExperience() {
      const rows = await db
        .select({ data: workExperience.data })
        .from(workExperience)
        .orderBy(asc(workExperience.position));
      return rows.map((row) => WorkExperienceSchema.parse(row.data));
    },
  };
}
