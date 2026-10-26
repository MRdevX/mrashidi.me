import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, type ProjectFilters } from "@/features/projects/domain/filters";
import { parseFilters, serializeFilters } from "@/features/projects/infrastructure/filtersQueryString";

describe("filters query string", () => {
  it("round-trips every filter", () => {
    const filters: ProjectFilters = {
      query: "queue",
      type: "personal",
      openSourceOnly: true,
      stacks: ["NestJS", "Redis"],
      sort: "az",
    };
    const search = serializeFilters(filters);

    expect(search).toBe("?q=queue&type=personal&oss=1&stack=NestJS%2CRedis&sort=az");
    expect(parseFilters(search)).toEqual(filters);
  });

  it("omits defaults and ignores invalid values", () => {
    expect(serializeFilters(DEFAULT_FILTERS)).toBe("");
    expect(parseFilters("?type=nope&sort=random&stack=,Go,Go")).toEqual({ ...DEFAULT_FILTERS, stacks: ["Go"] });
  });
});
