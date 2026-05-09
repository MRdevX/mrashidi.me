import { describe, expect, it } from "vitest";
import { getAllTechnologies, getTechnologyCategory } from "@/lib/core";

describe("technology constants helpers", () => {
  it("getAllTechnologies returns a non-empty deduped list", () => {
    const all = getAllTechnologies();
    expect(all.length).toBeGreaterThan(5);
    expect(new Set(all).size).toBe(all.length);
  });

  it("getTechnologyCategory maps known stack names", () => {
    expect(getTechnologyCategory("TypeScript")).toBe("languages");
    expect(getTechnologyCategory("React")).toBe("frameworks");
    expect(getTechnologyCategory("PostgreSQL")).toBe("databases");
    expect(getTechnologyCategory("Docker")).toBe("clouds");
  });

  it("getTechnologyCategory returns null for unknown names", () => {
    expect(getTechnologyCategory("TotallyUnknownTech999")).toBeNull();
  });
});
