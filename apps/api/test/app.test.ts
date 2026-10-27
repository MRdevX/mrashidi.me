import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

describe("app", () => {
  it.each([
    "/v1/profile",
    "/v1/projects",
    "/v1/knowledge",
    "/v1/knowledge/context",
    "/v1/github/contributions",
    "/v1/blog/posts",
  ])("%s requires the content API token", async (path) => {
    expect((await api(path)).status).toBe(401);
    expect((await api(path, { headers: { Authorization: "Bearer wrong" } })).status).toBe(401);
  });

  it("reports health without a token", async () => {
    expect(await (await api("/health")).json()).toEqual({ status: "ok" });
  });
});
