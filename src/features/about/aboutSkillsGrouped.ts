import { skills } from "@/data";
import { SkillLevel } from "@/data/profile/skills";

export type SkillTier = "core" | "experienced" | "familiar";

export const SKILL_TIERS: readonly SkillTier[] = ["core", "experienced", "familiar"];

export const SKILL_TIER_META: Record<SkillTier, { label: string; description: string }> = {
  core: { label: "Core", description: "daily, in production" },
  experienced: { label: "Experienced", description: "shipped with it" },
  familiar: { label: "Familiar", description: "used, not deep" },
};

const TIER_BY_LEVEL: Record<SkillLevel, SkillTier> = {
  [SkillLevel.EXPERT]: "core",
  [SkillLevel.PROFICIENT]: "core",
  [SkillLevel.EXPERIENCED]: "experienced",
  [SkillLevel.FAMILIAR]: "familiar",
};

export type SkillGroupId =
  | "backend"
  | "data"
  | "cloud"
  | "architecture"
  | "languages"
  | "observability"
  | "quality"
  | "ai"
  | "frontend"
  | "tools";

/** Display groups, in render order; each merges one or more data categories. */
export const SKILL_GROUP_DEFINITIONS: ReadonlyArray<{ id: SkillGroupId; title: string; categories: string[] }> = [
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

/** The short "what I reach for first" strip shown above the groups. */
export const PRIMARY_STACK = [
  "TypeScript",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Redis",
  "RabbitMQ",
  "Docker",
  "Kubernetes",
  "Terraform",
  "GCP",
  "Azure",
  "Cloudflare",
] as const;

export type TieredSkill = { name: string; tier: SkillTier; category: string };

export type SkillGroup = { id: SkillGroupId; title: string; skills: TieredSkill[] };

export type SkillFilter = "all" | "experienced" | "core";

export const SKILL_FILTERS: ReadonlyArray<{ id: SkillFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "experienced", label: "Core + experienced" },
  { id: "core", label: "Core" },
];

export function getSkillTier(level: SkillLevel | undefined): SkillTier {
  return level ? TIER_BY_LEVEL[level] : "familiar";
}

export function matchesSkillFilter(tier: SkillTier, filter: SkillFilter): boolean {
  if (filter === "core") {
    return tier === "core";
  }
  if (filter === "experienced") {
    return tier !== "familiar";
  }
  return true;
}

function getAllTieredSkills(): TieredSkill[] {
  const seen = new Set<string>();
  const result: TieredSkill[] = [];

  for (const { category, skills: categorySkills } of skills) {
    for (const skill of categorySkills) {
      if (seen.has(skill.name)) {
        continue;
      }
      seen.add(skill.name);
      result.push({ name: skill.name, tier: getSkillTier(skill.level), category });
    }
  }

  return result;
}

export function getSkillGroups(): SkillGroup[] {
  const allSkills = getAllTieredSkills();

  return SKILL_GROUP_DEFINITIONS.map(({ id, title, categories }) => ({
    id,
    title,
    skills: allSkills
      .filter((skill) => categories.includes(skill.category))
      .sort((a, b) => SKILL_TIERS.indexOf(a.tier) - SKILL_TIERS.indexOf(b.tier)),
  })).filter((group) => group.skills.length > 0);
}

export function getPrimaryStack(): TieredSkill[] {
  const byName = new Map(getAllTieredSkills().map((skill) => [skill.name, skill]));
  return PRIMARY_STACK.flatMap((name) => byName.get(name) ?? []);
}
