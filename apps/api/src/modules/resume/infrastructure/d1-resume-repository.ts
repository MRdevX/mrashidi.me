import { CertificateCategorySchema, EducationSchema, SkillCategorySchema, WorkExperienceSchema } from "@mrashidi/types";
import { asc } from "drizzle-orm";
import { z } from "zod";
import type { Db } from "#db/index.ts";
import { workExperience } from "#db/schema.ts";
import { readSection } from "#db/sections.ts";
import type { ResumeRepository } from "../domain/resume-repository.ts";

export function createD1ResumeRepository(db: Db): ResumeRepository {
  return {
    async listExperience() {
      const rows = await db
        .select({ data: workExperience.data })
        .from(workExperience)
        .orderBy(asc(workExperience.position));
      return rows.map((row) => WorkExperienceSchema.parse(row.data));
    },
    getSkills: () => readSection(db, "skills", z.array(SkillCategorySchema)),
    getEducation: () => readSection(db, "education", z.array(EducationSchema)),
    getCertificates: () => readSection(db, "certificates", z.array(CertificateCategorySchema)),
  };
}
