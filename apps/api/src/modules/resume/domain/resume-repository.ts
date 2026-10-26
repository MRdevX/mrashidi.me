import type { CertificateCategory, Education, SkillCategory, WorkExperience } from "@mrashidi/types";

export interface ResumeRepository {
  listExperience(): Promise<WorkExperience[]>;
  getSkills(): Promise<SkillCategory[] | null>;
  getEducation(): Promise<Education[] | null>;
  getCertificates(): Promise<CertificateCategory[] | null>;
}
