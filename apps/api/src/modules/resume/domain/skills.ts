import type { SkillCategory, SkillGroupId, SkillLevel, SkillsOverview, SkillTier, TieredSkill } from "@mrashidi/types";

const TIER_BY_LEVEL: Record<SkillLevel, SkillTier> = {
  expert: "core",
  proficient: "core",
  experienced: "experienced",
  familiar: "familiar",
};

const TIER_ORDER: readonly SkillTier[] = ["core", "experienced", "familiar"];

export const SKILL_GROUPS: ReadonlyArray<{ id: SkillGroupId; title: string; categories: readonly string[] }> = [
  { id: "backend", title: "Backend & APIs", categories: ["Frameworks", "APIs & Protocols"] },
  { id: "data", title: "Data & Messaging", categories: ["Databases & ORMs", "Messaging"] },
  { id: "cloud", title: "Cloud & Infrastructure", categories: ["Cloud", "DevOps & Infrastructure"] },
  { id: "architecture", title: "Architecture", categories: ["Architecture"] },
  { id: "languages", title: "Languages", categories: ["Programming Languages"] },
  { id: "observability", title: "Observability", categories: ["Monitoring"] },
  { id: "quality", title: "Testing & Security", categories: ["Testing", "Security"] },
  { id: "ai", title: "AI & LLMs", categories: ["AI"] },
  { id: "frontend", title: "Frontend & Mobile", categories: ["Frontend"] },
  { id: "tools", title: "Tools & Workflow", categories: ["Tools"] },
];

export function skillTier(level: SkillLevel | undefined): SkillTier {
  return level ? TIER_BY_LEVEL[level] : "familiar";
}

function uniqueTieredSkills(categories: readonly SkillCategory[]): TieredSkill[] {
  const seen = new Set<string>();
  return categories.flatMap(({ category, skills }) =>
    skills.flatMap((skill) => {
      if (seen.has(skill.name)) {
        return [];
      }
      seen.add(skill.name);
      return [{ name: skill.name, tier: skillTier(skill.level), category }];
    })
  );
}

export function describeSkills(categories: readonly SkillCategory[]): SkillsOverview {
  const skills = uniqueTieredSkills(categories);
  const featuredNames = new Set(
    categories.flatMap((category) => category.skills.filter((skill) => skill.includeInMainStack).map((s) => s.name))
  );

  return {
    groups: SKILL_GROUPS.map(({ id, title, categories: members }) => ({
      id,
      title,
      skills: skills
        .filter((skill) => members.includes(skill.category))
        .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier)),
    })).filter((group) => group.skills.length > 0),
    featured: skills.filter((skill) => featuredNames.has(skill.name)),
  };
}
