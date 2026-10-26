import { describe, expect, it } from "vitest";
import { matchesSkillFilter, SKILL_TIERS } from "@/features/about/aboutSkillsGrouped";
import { fixtureSiteContent } from "@/lib/content/fixtures";
import { getTechIcon } from "@/lib/tech";

describe("skill groups", () => {
  it("gives every skill a real tech icon", () => {
    const fallback = getTechIcon("not-a-real-technology").Icon;
    const names = fixtureSiteContent.skillsOverview.groups.flatMap((group) => group.skills.map((skill) => skill.name));
    expect(names.filter((name) => getTechIcon(name).Icon === fallback)).toEqual([]);
  });
});

describe("skill filters", () => {
  it("narrows by filter", () => {
    expect(SKILL_TIERS.filter((tier) => matchesSkillFilter(tier, "all"))).toEqual(SKILL_TIERS);
    expect(SKILL_TIERS.filter((tier) => matchesSkillFilter(tier, "experienced"))).toEqual(["core", "experienced"]);
    expect(SKILL_TIERS.filter((tier) => matchesSkillFilter(tier, "core"))).toEqual(["core"]);
  });
});
