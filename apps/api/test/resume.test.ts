import { env } from "cloudflare:workers";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createDb } from "#db/index.ts";
import { workExperience } from "#db/schema.ts";
import { authedApi } from "./api.ts";

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
    const res = await authedApi(path);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    expect(await res.json()).toEqual(expected);
  });

  it("serves experience with structured periods, matching the read-model fixture", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-15T00:00:00Z"));
    const res = await authedApi("/v1/experience");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject(fixtureContent.experience);
    await expect(`${JSON.stringify(body, null, 2)}\n`).toMatchFileSnapshot(`${FIXTURES}/experience.json`);
  });

  it("serves the skills overview, matching the read-model fixture", async () => {
    const res = await authedApi("/v1/skills/overview");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(
      `${FIXTURES}/skills-overview.json`
    );
  });

  it("answers 500 with the reason when a stored work period is unreadable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const db = createDb(env.DB);
    const [role] = fixtureContent.experience;
    await db
      .update(workExperience)
      .set({ data: { ...role, period: "Foo 2015 – Present" } })
      .where(eq(workExperience.position, 0));
    try {
      const res = await authedApi("/v1/experience");
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Unreadable work period "Foo 2015 – Present"' });
    } finally {
      await db.update(workExperience).set({ data: role }).where(eq(workExperience.position, 0));
    }
  });
});
