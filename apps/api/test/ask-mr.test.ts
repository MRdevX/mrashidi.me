import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

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
