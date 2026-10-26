import { type SkillTier, SkillTierSchema } from "@mrashidi/types";

export const SKILL_TIERS: readonly SkillTier[] = SkillTierSchema.options;

export const SKILL_TIER_META: Record<SkillTier, { label: string; description: string }> = {
  core: { label: "Core", description: "daily, in production" },
  experienced: { label: "Experienced", description: "shipped with it" },
  familiar: { label: "Familiar", description: "used, not deep" },
};

export type SkillFilter = "all" | "experienced" | "core";

export const SKILL_FILTERS: ReadonlyArray<{ id: SkillFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "experienced", label: "Core + experienced" },
  { id: "core", label: "Core" },
];

export function matchesSkillFilter(tier: SkillTier, filter: SkillFilter): boolean {
  if (filter === "core") {
    return tier === "core";
  }
  if (filter === "experienced") {
    return tier !== "familiar";
  }
  return true;
}
