import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

describe("app", () => {
  it("allows CORS from the site origin only", async () => {
    const allowed = await api("/v1/profile", { headers: { Origin: "https://mrashidi.me" } });
    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe("https://mrashidi.me");
    const denied = await api("/v1/profile", { headers: { Origin: "https://evil.example" } });
    expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("reports health", async () => {
    expect(await (await api("/health")).json()).toEqual({ status: "ok" });
  });
});
