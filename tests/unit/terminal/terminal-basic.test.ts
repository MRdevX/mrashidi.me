import { describe, it, expect } from "vitest";
import { formatTimestamp, normalizeCommand, isValidCommand } from "@/components/terminal/utils";
import { mockTimestamps } from "./mocks";
import { validCommands, invalidCommands } from "./fixtures";

describe("Terminal Utils", () => {
  describe("formatTimestamp", () => {
    it("should format timestamp correctly", () => {
      const formatted = formatTimestamp(mockTimestamps.now);
      expect(formatted).toBe("14:30:45");
    });

    it("should handle different times", () => {
      const formatted = formatTimestamp(mockTimestamps.past);
      expect(formatted).toBe("14:29:30");
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
      validCommands.forEach((command) => {
        expect(isValidCommand(command)).toBe(true);
      });
    });

    it("should reject all invalid commands", () => {
      invalidCommands.forEach((command) => {
        expect(isValidCommand(command)).toBe(false);
      });
    });

    it("should handle case insensitive commands", () => {
      expect(isValidCommand("HELP")).toBe(true);
      expect(isValidCommand("About")).toBe(true);
      expect(isValidCommand("  SKILLS  ")).toBe(true);
    });
  });
});
