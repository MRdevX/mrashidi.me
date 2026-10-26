import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { describeSkills, SKILL_GROUPS, skillTier } from "../src/modules/resume/domain/skills.ts";

const { skills } = fixtureContent;
const TIER_ORDER = ["core", "experienced", "familiar"];

describe("skills overview", () => {
  const { groups, featured } = describeSkills(skills);
  const grouped = groups.flatMap((group) => group.skills.map((skill) => skill.name));

  it("maps every data category to a display group", () => {
    const mapped = new Set(SKILL_GROUPS.flatMap((group) => group.categories));
    expect(skills.map((category) => category.category).filter((category) => !mapped.has(category))).toEqual([]);
  });

  it("places every skill exactly once", () => {
    const unique = new Set(skills.flatMap((category) => category.skills.map((skill) => skill.name)));
    expect(grouped).toHaveLength(unique.size);
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it("sorts each group core first, familiar last", () => {
    for (const group of groups) {
      const ranks = group.skills.map((skill) => TIER_ORDER.indexOf(skill.tier));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });

  it("features the skills flagged for the main stack, once each", () => {
    const flagged = skills.flatMap((category) =>
      category.skills.filter((skill) => skill.includeInMainStack).map((skill) => skill.name)
    );
    expect(featured.map((skill) => skill.name)).toEqual([...new Set(flagged)]);
  });

  it("folds expert and proficient into core", () => {
    expect(skillTier("expert")).toBe("core");
    expect(skillTier("proficient")).toBe("core");
    expect(skillTier("experienced")).toBe("experienced");
    expect(skillTier(undefined)).toBe("familiar");
  });
});
