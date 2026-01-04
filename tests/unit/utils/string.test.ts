import { describe, expect, it } from "vitest";
import {
  calculateReadingTime,
  cleanHtmlContent,
  extractImageUrl,
  isValidEmail,
  truncateText,
} from "@/lib/utils/string";

describe("String Utilities", () => {
  describe("cleanHtmlContent", () => {
    it("should convert HTML to plain text", () => {
      const html = "<p>Hello <strong>world</strong></p>";
      const result = cleanHtmlContent(html);
      expect(result).toBe("Hello world");
    });

    it("should skip images", () => {
      const html = "<p>Text <img src='test.jpg' alt='test' /> more text</p>";
      const result = cleanHtmlContent(html);
      expect(result).not.toContain("test.jpg");
    });

    it("should ignore href in links", () => {
      const html = '<p>Visit <a href="https://example.com">example</a></p>';
      const result = cleanHtmlContent(html);
      expect(result).toContain("example");
      expect(result).not.toContain("https://example.com");
    });

    it("should return empty string for empty input", () => {
      expect(cleanHtmlContent("")).toBe("");
      expect(cleanHtmlContent("   ")).toBe("");
    });

    it("should handle null or undefined", () => {
      expect(cleanHtmlContent(null as unknown as string)).toBe("");
      expect(cleanHtmlContent(undefined as unknown as string)).toBe("");
    });
  });

  describe("extractImageUrl", () => {
    it("should extract image URL from HTML", () => {
      const html = '<img src="https://example.com/image.jpg" alt="test" />';
      const result = extractImageUrl(html);
      expect(result).toBe("https://example.com/image.jpg");
    });

    it("should return first image URL if multiple images exist", () => {
      const html = '<img src="https://example.com/first.jpg" /><img src="https://example.com/second.jpg" />';
      const result = extractImageUrl(html);
      expect(result).toBe("https://example.com/first.jpg");
    });

    it("should return undefined for relative URLs", () => {
      const html = '<img src="/relative/path.jpg" />';
      const result = extractImageUrl(html);
      expect(result).toBeUndefined();
    });

    it("should accept http URLs", () => {
      const html = '<img src="http://example.com/image.jpg" />';
      const result = extractImageUrl(html);
      expect(result).toBe("http://example.com/image.jpg");
    });

    it("should return undefined when no image exists", () => {
      expect(extractImageUrl("<p>No image here</p>")).toBeUndefined();
    });

    it("should return undefined for empty or invalid HTML", () => {
      expect(extractImageUrl("")).toBeUndefined();
      expect(extractImageUrl("invalid html")).toBeUndefined();
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      const text = "This is a very long text that needs to be truncated";
      const result = truncateText(text, 20);
      expect(result).toBe("This is a very lo...");
      expect(result.length).toBe(20);
    });

    it("should not truncate text shorter than maxLength", () => {
      const text = "Short text";
      const result = truncateText(text, 20);
      expect(result).toBe("Short text");
    });

    it("should handle text exactly at maxLength", () => {
      const text = "Exactly twenty chars";
      const result = truncateText(text, 20);
      expect(result).toBe("Exactly twenty chars");
    });

    it("should handle very short maxLength", () => {
      const text = "Hello";
      const result = truncateText(text, 3);
      expect(result).toBe("...");
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmail("user+tag@example.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user@domain")).toBe(false);
    });

    it("should handle empty strings", () => {
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("calculateReadingTime", () => {
    it("should calculate reading time for text", () => {
      const text = "word ".repeat(200);
      const result = calculateReadingTime(text);
      expect(result).toBe(1);
    });

    it("should round up to next minute", () => {
      const text = "word ".repeat(201);
      const result = calculateReadingTime(text);
      expect(result).toBe(2);
    });

    it("should return 0 minutes for empty text", () => {
      expect(calculateReadingTime("")).toBe(0);
      expect(calculateReadingTime("   ")).toBe(0);
    });

    it("should handle text with multiple spaces", () => {
      const text = "word1    word2    word3";
      const result = calculateReadingTime(text);
      expect(result).toBe(1);
    });
  });
});
