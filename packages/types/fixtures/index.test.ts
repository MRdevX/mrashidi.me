import { describe, expect, it } from "vitest";
import { fixtureContent } from "./index";

describe("fixture content", () => {
  it("parses against the content schema", () => {
    expect(fixtureContent.profile.person.name).toBe("Jane Doe");
  });

  it("gives every project a unique title so slugs stay unique", () => {
    const titles = fixtureContent.projects.map((p) => p.title.toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
  });
});
