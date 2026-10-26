import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/common";

describe("cn utility", () => {
  it("should merge class names from strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", true && "bar")).toBe("foo bar");
  });

  it("should handle arrays", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle empty strings and null values", () => {
    expect(cn("foo", "", null, undefined, "bar")).toBe("foo bar");
  });

  it("should handle mixed inputs", () => {
    expect(cn("foo", ["bar", "baz"], false && "qux", "quux")).toBe("foo bar baz quux");
  });
});
