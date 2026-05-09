import { describe, expect, it } from "vitest";
import { getMainTechStack, normalizeIconKey } from "@/lib/tech/skills";

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
  it("returns deduplicated items with name and resolvable iconKey", () => {
    const stack = getMainTechStack();
    expect(stack.length).toBeGreaterThan(0);
    const names = stack.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
    for (const item of stack) {
      expect(item.iconKey.length).toBeGreaterThan(0);
      expect(item.name.length).toBeGreaterThan(0);
    }
  });
});
