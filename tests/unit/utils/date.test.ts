import { describe, expect, it } from "vitest";
import { formatDate, formatRelativeTime } from "@/lib/utils/date";

describe("Date Utilities", () => {
  describe("formatDate", () => {
    it("should format Date object", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toBe("January 15, 2024");
    });

    it("should format ISO string", () => {
      const dateString = "2024-03-20T14:45:00Z";
      const result = formatDate(dateString);
      expect(result).toBe("March 20, 2024");
    });

    it("should handle different dates", () => {
      const date = new Date("2023-12-25T00:00:00Z");
      const result = formatDate(date);
      expect(result).toBe("December 25, 2023");
    });
  });

  describe("formatRelativeTime", () => {
    it("should format relative time for past dates", () => {
      const pastDate = new Date();
      pastDate.setMinutes(pastDate.getMinutes() - 5);
      const result = formatRelativeTime(pastDate);
      expect(result).toContain("ago");
    });

    it("should format relative time for future dates", () => {
      const futureDate = new Date();
      futureDate.setMinutes(futureDate.getMinutes() + 5);
      const result = formatRelativeTime(futureDate);
      expect(result).toContain("in");
    });

    it("should format ISO string relative time", () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);
      const isoString = pastDate.toISOString();
      const result = formatRelativeTime(isoString);
      expect(result).toContain("ago");
    });

    it("should handle recent dates", () => {
      const recentDate = new Date();
      recentDate.setSeconds(recentDate.getSeconds() - 30);
      const result = formatRelativeTime(recentDate);
      expect(result).toMatch(/ago|second|minute/);
    });
  });
});
