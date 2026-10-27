import { describe, expect, it } from "vitest";
import { fixtureSiteContent } from "@/lib/content/fixtures";
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebsiteSchema,
} from "@/lib/structuredData";

const { profile } = fixtureSiteContent;

describe("structured data generators", () => {
  it("generatePersonSchema returns Person JSON-LD", () => {
    const schema = generatePersonSchema(fixtureSiteContent);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
    expect(schema.name.length).toBeGreaterThan(0);
    expect(schema.email).toContain("@");
    expect(Array.isArray(schema.sameAs)).toBe(true);
  });

  it("generatePersonSchema takes employer, schools and topics from content", () => {
    const schema = generatePersonSchema(fixtureSiteContent);
    expect(schema.worksFor.name).toBe(profile.person.worksFor);
    expect(schema.alumniOf.map((org) => org.name)).toEqual(
      fixtureSiteContent.education.map((entry) => entry.institution)
    );
    expect(schema.knowsAbout).toEqual(fixtureSiteContent.skillsOverview.featured.map((skill) => skill.name));
    expect(schema.knowsAbout.length).toBeGreaterThan(0);
  });

  it("generateWebsiteSchema returns WebSite JSON-LD", () => {
    const schema = generateWebsiteSchema(profile);
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.url.length).toBeGreaterThan(0);
    expect(schema.author["@type"]).toBe("Person");
  });

  it("generateOrganizationSchema returns Organization JSON-LD", () => {
    const schema = generateOrganizationSchema(profile);
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
