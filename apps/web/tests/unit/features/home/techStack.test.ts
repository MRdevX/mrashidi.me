import { describe, expect, it } from "vitest";
import { getMainTechStack, normalizeIconKey } from "@/features/home/techStack";
import { fixtureSiteContent } from "@/lib/content/fixtures";

describe("normalizeIconKey", () => {
  it("lowercases and removes dots and spaces", () => {
    expect(normalizeIconKey("Node.js")).toBe("nodejs");
    expect(normalizeIconKey("Some Thing")).toBe("something");
  });

  it("strips parenthetical suffixes", () => {
    expect(normalizeIconKey("Foo (Bar)")).toBe("foo");
  });

  it("maps plus to p once and hash to sharp", () => {
    expect(normalizeIconKey("A+B")).toBe("apb");
    expect(normalizeIconKey("C++")).toBe("cp+");
    expect(normalizeIconKey("C#")).toBe("csharp");
  });
});

describe("getMainTechStack", () => {
  it("returns featured skills with a resolvable iconKey", () => {
    const stack = getMainTechStack(fixtureSiteContent.skillsOverview.featured);
    expect(stack.length).toBeGreaterThan(0);
    const names = stack.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
    for (const item of stack) {
      expect(item.iconKey.length).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
    }
    expect(names).toContain("Python");
    expect(names).toContain("GCP");
  });
});
