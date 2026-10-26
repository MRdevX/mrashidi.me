import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

describe("resume", () => {
  it.each([
    ["/v1/skills", fixtureContent.skills],
    ["/v1/education", fixtureContent.education],
    ["/v1/certificates", fixtureContent.certificates],
    ["/v1/experience", fixtureContent.experience],
  ])("serves %s as seeded, in order", async (path, expected) => {
    const res = await api(path);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    expect(await res.json()).toEqual(expected);
  });
});
