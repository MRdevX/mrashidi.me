import { z } from "zod";
import { AboutSchema } from "./about";
import { AskMrKnowledgeSchema } from "./knowledge";
import { ProfileSchema } from "./profile";
import { ProjectSchema } from "./project";
import { CertificateCategorySchema, EducationSchema, SkillCategorySchema, WorkExperienceSchema } from "./resume";

export const ContentSchema = z.object({
  profile: ProfileSchema,
  about: AboutSchema,
  experience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  certificates: z.array(CertificateCategorySchema),
  skills: z.array(SkillCategorySchema),
  projects: z.array(ProjectSchema),
  knowledge: AskMrKnowledgeSchema,
});

export type Content = z.infer<typeof ContentSchema>;
export type ContentSection = keyof Content;
