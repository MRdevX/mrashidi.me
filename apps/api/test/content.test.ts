import { exports } from "cloudflare:workers";
import { projectSlug } from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";

const api = (path: string, init?: RequestInit) => exports.default.fetch(`https://api.test${path}`, init);

describe("public content", () => {
  it.each([
    ["/v1/profile", fixtureContent.profile],
    ["/v1/about", fixtureContent.about],
    ["/v1/skills", fixtureContent.skills],
    ["/v1/education", fixtureContent.education],
    ["/v1/certificates", fixtureContent.certificates],
    ["/v1/experience", fixtureContent.experience],
    ["/v1/projects", fixtureContent.projects],
  ])("serves %s as seeded, in order", async (path, expected) => {
    const res = await api(path);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    expect(await res.json()).toEqual(expected);
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

  it("allows CORS from the site origin only", async () => {
    const allowed = await api("/v1/profile", { headers: { Origin: "https://mrashidi.me" } });
    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe("https://mrashidi.me");
    const denied = await api("/v1/profile", { headers: { Origin: "https://evil.example" } });
    expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });
});

describe("Ask MR knowledge", () => {
  it("requires the content API token", async () => {
    expect((await api("/v1/knowledge")).status).toBe(401);
    expect((await api("/v1/knowledge", { headers: { Authorization: "Bearer wrong" } })).status).toBe(401);
  });

  it("serves knowledge with the token, uncached", async () => {
    const res = await api("/v1/knowledge", { headers: { Authorization: "Bearer test-token" } });
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await res.json()).toEqual(fixtureContent.knowledge);
  });
});

describe("health", () => {
  it("reports ok", async () => {
    expect(await (await api("/health")).json()).toEqual({ status: "ok" });
  });
});
