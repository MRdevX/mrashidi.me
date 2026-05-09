import type { Skill } from "@/data";
import { skills } from "@/data";

export const SKILL_LEVEL_META = {
  expert: { color: "#9A3412", label: "Expert" },
  proficient: { color: "#EA580C", label: "Proficient" },
  experienced: { color: "#FBBF24", label: "Experienced" },
  familiar: { color: "#FEF9C3", label: "Familiar" },
  unspecified: { color: "#6B7280", label: "Tools & Concepts" },
} as const;

export type SkillLevelBucket = keyof typeof SKILL_LEVEL_META;

export type SkillWithCategory = Skill & { category: string };

export function getSkillsGroupedByLevel(): Record<SkillLevelBucket, SkillWithCategory[]> {
  const allSkills: SkillWithCategory[] = skills.flatMap((cat) =>
    cat.skills.map((skill) => ({ ...skill, category: cat.category }))
  );

  return {
    expert: allSkills.filter((skill) => skill.level === "expert"),
    proficient: allSkills.filter((skill) => skill.level === "proficient"),
    experienced: allSkills.filter((skill) => skill.level === "experienced"),
    familiar: allSkills.filter((skill) => skill.level === "familiar"),
    unspecified: allSkills.filter((skill) => !skill.level),
  };
}
