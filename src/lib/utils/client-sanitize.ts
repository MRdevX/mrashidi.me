/**
 * Client-side safe HTML sanitization utilities
 * These functions work in the browser environment
 */

/**
 * Escape HTML characters to prevent XSS
 * @param text - The text to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Strip HTML tags from text (convert to plain text)
 * @param html - The HTML string to strip
 * @returns Plain text string
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/**
 * Sanitize user input for display (removes HTML and escapes special characters)
 * @param input - The user input to sanitize
 * @returns Sanitized string safe for display
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // First strip any HTML tags
  const stripped = stripHtml(input);

  // Then escape any remaining special characters
  return escapeHtml(stripped).trim();
}

/**
 * Create a safe HTML string from text (escapes HTML but preserves line breaks)
 * @param text - The text to convert
 * @returns Safe HTML string
 */
export function textToSafeHtml(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  return escapeHtml(text).replace(/\n/g, "<br>").replace(/\r\n/g, "<br>");
}
