import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { authedApi } from "./api.ts";

describe("profile", () => {
  it.each([
    ["/v1/profile", fixtureContent.profile],
    ["/v1/about", fixtureContent.about],
  ])("serves %s as seeded", async (path, expected) => {
    const res = await authedApi(path);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    expect(await res.json()).toEqual(expected);
  });
});
