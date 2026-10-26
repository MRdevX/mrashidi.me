import { fixtureContent } from "@mrashidi/types/fixtures";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "./api.ts";

const FIXTURES = "../../../packages/types/fixtures/api";

describe("resume", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["/v1/skills", fixtureContent.skills],
    ["/v1/education", fixtureContent.education],
    ["/v1/certificates", fixtureContent.certificates],
  ])("serves %s as seeded, in order", async (path, expected) => {
    const res = await api(path);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    expect(await res.json()).toEqual(expected);
  });

  it("serves experience with structured periods, matching the read-model fixture", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-15T00:00:00Z"));
    const res = await api("/v1/experience");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject(fixtureContent.experience);
    await expect(`${JSON.stringify(body, null, 2)}\n`).toMatchFileSnapshot(`${FIXTURES}/experience.json`);
  });

  it("serves the skills overview, matching the read-model fixture", async () => {
    const res = await api("/v1/skills/overview");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(
      `${FIXTURES}/skills-overview.json`
    );
  });
});
