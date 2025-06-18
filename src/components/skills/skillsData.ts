// Shared skills data for use in main page and terminal

export type SkillLevel = "advanced" | "intermediate" | "familiar";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export { default as skillCategories } from "@/data/skills";
