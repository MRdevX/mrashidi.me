import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

describe("app", () => {
  it("allows CORS from the site origin only", async () => {
    const allowed = await api("/v1/profile", { headers: { Origin: "https://mrashidi.me" } });
    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe("https://mrashidi.me");
    const denied = await api("/v1/profile", { headers: { Origin: "https://evil.example" } });
    expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it.each(["/v1/profile", "/v1/projects", "/v1/knowledge", "/v1/knowledge/context"])(
    "%s requires the content API token",
    async (path) => {
      expect((await api(path)).status).toBe(401);
      expect((await api(path, { headers: { Authorization: "Bearer wrong" } })).status).toBe(401);
    }
  );

  it("reports health without a token", async () => {
    expect(await (await api("/health")).json()).toEqual({ status: "ok" });
  });
});
