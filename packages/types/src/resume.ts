import { z } from "zod";

const PERIOD = /^[A-Z][a-z]{2} \d{4} – ([A-Z][a-z]{2} \d{4}|Present)$/;

export const WorkExperienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string(),
  employmentType: z.string(),
  period: z.string().regex(PERIOD, 'Expected "Mon YYYY – Mon YYYY" or "Mon YYYY – Present"'),
  summary: z.string().optional(),
  stack: z.array(z.string()).optional(),
  achievements: z.array(z.string()),
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  period: z.string(),
  location: z.string(),
  details: z.array(z.string()).optional(),
  url: z.url().optional(),
});

export const CertificateSchema = z.object({
  name: z.string().min(1),
  year: z.string(),
  provider: z.string(),
  type: z.string(),
  url: z.url().optional(),
});

export const CertificateCategorySchema = z.object({
  category: z.string().min(1),
  certificates: z.array(CertificateSchema),
});

export const SkillLevelSchema = z.enum(["expert", "proficient", "experienced", "familiar"]);

export const SkillSchema = z.object({
  name: z.string().min(1),
  level: SkillLevelSchema.optional(),
  includeInMainStack: z.boolean().optional(),
});

export const SkillCategorySchema = z.object({
  category: z.string().min(1),
  skills: z.array(SkillSchema),
});

export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type CertificateCategory = z.infer<typeof CertificateCategorySchema>;
export type SkillLevel = z.infer<typeof SkillLevelSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
