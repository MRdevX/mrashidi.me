import { describe, expect, it } from "vitest";
import { cleanHtmlContent, extractImageUrl } from "@/features/blog/server/html";

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
});
