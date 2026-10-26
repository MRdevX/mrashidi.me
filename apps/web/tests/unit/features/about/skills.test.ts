import { describe, expect, it } from "vitest";
import { skills } from "@/data";
import { SkillLevel } from "@/data/profile/skills";
import {
  getPrimaryStack,
  getSkillGroups,
  getSkillTier,
  matchesSkillFilter,
  PRIMARY_STACK,
  SKILL_GROUP_DEFINITIONS,
  SKILL_TIERS,
} from "@/features/about/aboutSkillsGrouped";
import { getTechIcon } from "@/lib/tech";

describe("getSkillGroups", () => {
  const groups = getSkillGroups();
  const grouped = groups.flatMap((group) => group.skills.map((skill) => skill.name));

  it("maps every data category to a display group", () => {
    const mapped = new Set(SKILL_GROUP_DEFINITIONS.flatMap((group) => group.categories));
    const unmapped = skills.map((category) => category.category).filter((category) => !mapped.has(category));
    expect(unmapped).toEqual([]);
  });

  it("places every skill exactly once", () => {
    const unique = new Set(skills.flatMap((category) => category.skills.map((skill) => skill.name)));
    expect(grouped).toHaveLength(unique.size);
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it("sorts each group core first, familiar last", () => {
    for (const group of groups) {
      const ranks = group.skills.map((skill) => SKILL_TIERS.indexOf(skill.tier));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });

  it("gives every skill a real tech icon", () => {
    const fallback = getTechIcon("not-a-real-technology").Icon;
    expect(grouped.filter((name) => getTechIcon(name).Icon === fallback)).toEqual([]);
  });
});

describe("tiers and filters", () => {
  it("folds expert and proficient into core", () => {
    expect(getSkillTier(SkillLevel.EXPERT)).toBe("core");
    expect(getSkillTier(SkillLevel.PROFICIENT)).toBe("core");
    expect(getSkillTier(SkillLevel.EXPERIENCED)).toBe("experienced");
    expect(getSkillTier(undefined)).toBe("familiar");
  });

  it("narrows by filter", () => {
    expect(SKILL_TIERS.filter((tier) => matchesSkillFilter(tier, "all"))).toEqual(SKILL_TIERS);
    expect(SKILL_TIERS.filter((tier) => matchesSkillFilter(tier, "experienced"))).toEqual(["core", "experienced"]);
    expect(SKILL_TIERS.filter((tier) => matchesSkillFilter(tier, "core"))).toEqual(["core"]);
  });
});

describe("getPrimaryStack", () => {
  it("resolves every listed skill", () => {
    expect(getPrimaryStack().map((skill) => skill.name)).toEqual([...PRIMARY_STACK]);
  });
});
