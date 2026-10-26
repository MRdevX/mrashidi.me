import { describe, expect, it } from "vitest";
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebsiteSchema,
} from "@/lib/structuredData";

describe("structured data generators", () => {
  it("generatePersonSchema returns Person JSON-LD", () => {
    const schema = generatePersonSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
    expect(schema.name.length).toBeGreaterThan(0);
    expect(schema.email).toContain("@");
    expect(Array.isArray(schema.sameAs)).toBe(true);
  });

  it("generateWebsiteSchema returns WebSite JSON-LD", () => {
    const schema = generateWebsiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.url.length).toBeGreaterThan(0);
    expect(schema.author["@type"]).toBe("Person");
  });

  it("generateOrganizationSchema returns Organization JSON-LD", () => {
    const schema = generateOrganizationSchema();
    expect(schema["@type"]).toBe("Organization");
    expect(schema.contactPoint["@type"]).toBe("ContactPoint");
  });

  it("generateBreadcrumbSchema builds item list", () => {
    const schema = generateBreadcrumbSchema("/projects", "Projects");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(Array.isArray(schema.itemListElement)).toBe(true);
    expect(schema.itemListElement.length).toBeGreaterThan(0);
  });
});
