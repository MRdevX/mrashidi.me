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

  it("serves reads with the read-only token", async () => {
    const res = await api("/v1/profile", { headers: { Authorization: "Bearer test-read-token" } });

    expect(res.status).toBe(200);
  });

  it.each(["/v1/mail/contact", "/v1/mail/cv-request", "/v1/ask-mr/chat"])(
    "%s refuses the read-only token",
    async (path) => {
      const res = await api(path, {
        method: "POST",
        headers: { Authorization: "Bearer test-read-token", "Content-Type": "application/json" },
        body: "{}",
      });

      expect(res.status).toBe(401);
    }
  );

  it("reports health without a token", async () => {
    expect(await (await api("/health")).json()).toEqual({ status: "ok" });
  });
});
