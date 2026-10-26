import { describe, expect, it } from "vitest";
import { projectSlug } from "../src/project";
import { fixtureContent } from "./index";

describe("fixture content", () => {
  it("parses against the content schema", () => {
    expect(fixtureContent.profile.person.name).toBe("Jane Doe");
  });

  it("gives every project a unique slug", () => {
    const slugs = fixtureContent.projects.map(projectSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
