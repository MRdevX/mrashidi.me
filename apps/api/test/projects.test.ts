import { projectSlug } from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { authedApi } from "./api.ts";

const FIXTURES = "../../../packages/types/fixtures/api";

describe("projects", () => {
  it("serves projects in order with slugs and years, matching the read-model fixture", async () => {
    const res = await authedApi("/v1/projects");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    const body = await res.json();
    expect(body).toMatchObject(fixtureContent.projects);
    await expect(`${JSON.stringify(body, null, 2)}\n`).toMatchFileSnapshot(`${FIXTURES}/projects.json`);
  });

  it("serves the catalog overview, matching the read-model fixture", async () => {
    const res = await authedApi("/v1/projects/overview");
    expect(res.status).toBe(200);
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(
      `${FIXTURES}/projects-overview.json`
    );
  });

  it("serves one project by slug", async () => {
    const project = fixtureContent.projects[2];
    const res = await authedApi(`/v1/projects/${projectSlug(project)}`);
    expect(await res.json()).toMatchObject({ ...project, slug: projectSlug(project) });
  });

  it("answers 404 for an unknown project", async () => {
    const res = await authedApi("/v1/projects/nope");
    expect(res.status).toBe(404);
  });
});
