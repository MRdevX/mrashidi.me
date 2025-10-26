import sanitizeHtml from "sanitize-html";

/**
 * Configuration for HTML sanitization
 */
const sanitizeConfig: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "a",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    code: ["class"],
    pre: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    a: ["http", "https", "mailto"],
    img: ["http", "https", "data"],
  },
  allowedClasses: {
    code: ["language-*", "hljs", "hljs-*"],
    pre: ["language-*", "hljs", "hljs-*"],
  },
  transformTags: {
    a: (tagName: string, attribs: Record<string, string>) => {
      if (attribs.href?.startsWith("http")) {
        return {
          tagName,
          attribs: {
            ...attribs,
            rel: "noopener noreferrer",
            target: "_blank",
          },
        };
      }
      return { tagName, attribs };
    },
  },
  disallowedTagsMode: "discard",
  allowedIframeHostnames: [],
  allowedIframeDomains: [],
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlContent(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  return sanitizeHtml(html, sanitizeConfig);
}

/**
 * Sanitize plain text content (removes all HTML tags)
 * @param html - The HTML string to convert to plain text
 * @returns Plain text string
 */
export function sanitizeToPlainText(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

/**
 * Sanitize user input for display in forms or messages
 * @param input - The user input string
 * @returns Sanitized string safe for display
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
