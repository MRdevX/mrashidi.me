export type SkillLevel = "expert" | "proficient" | "experienced" | "familiar";

export interface Skill {
  name: string;
  level?: SkillLevel;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export { default as skillCategories } from "@/data/skills";
