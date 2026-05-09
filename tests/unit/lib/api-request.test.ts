import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { getJsonBody } from "@/lib/api/request";

describe("api/request", () => {
  describe("getJsonBody", () => {
    it("parses JSON payload", async () => {
      const request = new NextRequest("https://example.com/api", {
        method: "POST",
        body: JSON.stringify({ ok: true, n: 2 }),
      });
      await expect(getJsonBody<{ ok: boolean; n: number }>(request)).resolves.toEqual({
        ok: true,
        n: 2,
      });
    });

    it("throws when body is not valid JSON", async () => {
      const request = new NextRequest("https://example.com/api", {
        method: "POST",
        body: "not-json",
      });
      await expect(getJsonBody(request)).rejects.toThrow("Invalid JSON body");
    });
  });
});
