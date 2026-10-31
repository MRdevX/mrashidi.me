import { describe, expect, it } from "vitest";
import { projectSlug } from "./project";

describe("projectSlug", () => {
  it("creates url-safe slugs", () => {
    expect(projectSlug({ title: "EV Fleet Management Platform Suite" })).toBe("ev-fleet-management-platform-suite");
    expect(projectSlug({ title: "Café & Co. -- Tools" })).toBe("cafe-co-tools");
  });
});
