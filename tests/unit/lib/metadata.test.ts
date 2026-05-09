import { describe, expect, it } from "vitest";
import { generatePageMetadata, generateRootMetadata, generateViewport, pageMetadataConfigs } from "@/lib/metadata";

describe("metadata helpers", () => {
  it("generatePageMetadata merges title, OG, and canonical", () => {
    const meta = generatePageMetadata(pageMetadataConfigs.contact);
    expect(meta.title).toContain("Contact");
    expect(meta.description).toBeTruthy();
    expect(meta.openGraph?.url).toBeDefined();
    expect(meta.alternates?.canonical).toBeDefined();
  });

  it("generateRootMetadata extends home config with icons and robots", () => {
    const meta = generateRootMetadata();
    expect(meta.robots).toBe("index, follow");
    expect(meta.icons).toMatchObject({
      icon: "/favicon.ico",
    });
  });

  it("generateViewport allows scaling and sets theme color", () => {
    const vp = generateViewport();
    expect(vp.width).toBe("device-width");
    expect(vp.initialScale).toBe(1);
    expect(vp.userScalable).toBe(true);
    expect(vp.themeColor).toBeDefined();
    expect(vp.viewportFit).toBe("cover");
  });
});
