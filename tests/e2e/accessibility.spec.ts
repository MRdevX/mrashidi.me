import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Result } from "axe-core";

const routes = [
  { path: "/", name: "home" },
  { path: "/projects", name: "projects" },
  { path: "/contact", name: "contact" },
  { path: "/blog", name: "blog" },
  { path: "/about", name: "about" },
  { path: "/resume", name: "resume" },
] as const;

function formatViolations(violations: Result[]): string {
  if (violations.length === 0) {
    return "";
  }
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 5)
        .map((n) => n.html)
        .join("\n    ");
      return `${v.id}: ${v.help}\n  Impact: ${v.impact}\n  Nodes (sample):\n    ${nodes}`;
    })
    .join("\n\n");
}

for (const { path, name } of routes) {
  test(`no automatic WCAG A/AA violations on ${name}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "load" });
    await expect(page.locator("main")).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

    expect(results.violations, formatViolations(results.violations)).toEqual([]);
  });
}
