import { projectSlug } from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

describe("projects", () => {
  it("serves projects as seeded, in order", async () => {
    const res = await api("/v1/projects");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    expect(await res.json()).toEqual(fixtureContent.projects);
  });

  it("serves one project by slug", async () => {
    const project = fixtureContent.projects[2];
    const res = await api(`/v1/projects/${projectSlug(project)}`);
    expect(await res.json()).toEqual(project);
  });

  it("answers 404 for an unknown project", async () => {
    const res = await api("/v1/projects/nope");
    expect(res.status).toBe(404);
  });
});
