import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { extractPaginationParams } from "@/lib/utils/pagination";

describe("Pagination Utilities", () => {
  describe("extractPaginationParams", () => {
    it("should extract valid page and limit from query params", () => {
      const request = new NextRequest("https://example.com?page=2&limit=20");
      const result = extractPaginationParams(request);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });

    it("should use default values when params are missing", () => {
      const request = new NextRequest("https://example.com");
      const result = extractPaginationParams(request);
      expect(result.page).toBeGreaterThanOrEqual(1);
      expect(result.limit).toBeGreaterThanOrEqual(1);
    });

    it("should handle invalid page values", () => {
      const request = new NextRequest("https://example.com?page=invalid&limit=10");
      const result = extractPaginationParams(request);
      expect(result.page).toBeGreaterThanOrEqual(1);
    });

    it("should handle invalid limit values", () => {
      const request = new NextRequest("https://example.com?page=1&limit=invalid");
      const result = extractPaginationParams(request);
      expect(result.limit).toBeGreaterThanOrEqual(1);
    });

    it("should enforce minimum page value of 1", () => {
      const request = new NextRequest("https://example.com?page=0&limit=10");
      const result = extractPaginationParams(request);
      expect(result.page).toBe(1);
    });

    it("should enforce minimum limit value of 1", () => {
      const request = new NextRequest("https://example.com?page=1&limit=0");
      const result = extractPaginationParams(request);
      expect(result.limit).toBe(1);
    });

    it("should enforce maximum limit", () => {
      const request = new NextRequest("https://example.com?page=1&limit=1000");
      const result = extractPaginationParams(request);
      expect(result.limit).toBeLessThanOrEqual(100);
    });

    it("should handle negative values", () => {
      const request = new NextRequest("https://example.com?page=-5&limit=-10");
      const result = extractPaginationParams(request);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
    });
  });
});
