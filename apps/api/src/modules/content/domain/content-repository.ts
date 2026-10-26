import type {
  About,
  AskMrKnowledge,
  CertificateCategory,
  Education,
  Profile,
  Project,
  SkillCategory,
  WorkExperience,
} from "@mrashidi/types";

export interface SectionContent {
  profile: Profile;
  about: About;
  education: Education[];
  certificates: CertificateCategory[];
  skills: SkillCategory[];
  knowledge: AskMrKnowledge;
}

export type SectionKey = keyof SectionContent;

export interface ContentRepository {
  getSection<K extends SectionKey>(key: K): Promise<SectionContent[K] | null>;
  listProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  listExperience(): Promise<WorkExperience[]>;
}
