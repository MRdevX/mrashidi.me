import { convert } from "html-to-text";
import validator from "validator";

export function cleanHtmlContent(html: string): string {
  if (!html?.trim()) {
    return "";
  }

  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ],
  }).trim();
}

export function extractImageUrl(html: string): string | undefined {
  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

export function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3)}...`;
}

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
