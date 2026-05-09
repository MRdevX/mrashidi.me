import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { getJsonBody, getPaginationParams } from "@/lib/api/request";

describe("api/request", () => {
  describe("getPaginationParams", () => {
    it("delegates to extractPaginationParams", () => {
      const request = new NextRequest("https://example.com/api?page=3&limit=15");
      expect(getPaginationParams(request)).toEqual({ page: 3, limit: 15 });
    });
  });

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
