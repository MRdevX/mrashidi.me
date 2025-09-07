import { describe, expect, it } from "vitest";
import { formatTimestamp, isValidCommand, normalizeCommand } from "@/components/terminal/utils";
import { invalidCommands, validCommands } from "./fixtures";

describe("Terminal Utils", () => {
  describe("formatTimestamp", () => {
    it("should format timestamp in HH:MM:SS format", () => {
      const testDate = new Date("2024-01-15T14:30:45Z");
      const formatted = formatTimestamp(testDate);

      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(formatted).toHaveLength(8);
    });

    it("should handle different times consistently", () => {
      const testDate = new Date("2024-01-15T09:05:12Z");
      const formatted = formatTimestamp(testDate);

      expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(formatted).toHaveLength(8);
    });

    it("should use 24-hour format", () => {
      const testDate = new Date("2024-01-15T14:30:45Z");
      const formatted = formatTimestamp(testDate);

      expect(formatted).not.toMatch(/AM|PM/i);

      const [hours] = formatted.split(":");
      const hourNum = parseInt(hours, 10);
      expect(hourNum).toBeGreaterThanOrEqual(0);
      expect(hourNum).toBeLessThanOrEqual(23);
    });
  });

  describe("normalizeCommand", () => {
    it("should normalize command to lowercase and trim", () => {
      expect(normalizeCommand("HELP")).toBe("help");
      expect(normalizeCommand("About")).toBe("about");
      expect(normalizeCommand("  SKILLS  ")).toBe("skills");
      expect(normalizeCommand("\tprojects\n")).toBe("projects");
    });
  });

  describe("isValidCommand", () => {
    it("should validate all valid commands", () => {
      for (const command of validCommands) {
        expect(isValidCommand(command)).toBe(true);
      }
    });

    it("should reject all invalid commands", () => {
      for (const command of invalidCommands) {
        expect(isValidCommand(command)).toBe(false);
      }
    });

    it("should handle case insensitive commands", () => {
      expect(isValidCommand("HELP")).toBe(true);
      expect(isValidCommand("About")).toBe(true);
      expect(isValidCommand("  SKILLS  ")).toBe(true);
    });
  });
});
