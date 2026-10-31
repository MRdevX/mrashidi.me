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

const themes = ["dark", "light"] as const;

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

for (const theme of themes) {
  test.describe(`${theme} theme`, () => {
    /** The theme class lands after mount and colours transition to it; axe must wait for both. */
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("theme", value);
      }, theme);
    });

    for (const { path, name } of routes) {
      test(`no automatic WCAG A/AA violations on ${name}`, async ({ page }) => {
        await page.goto(path, { waitUntil: "load" });
        await expect(page.locator("main")).toBeVisible();
        await expect
          .poll(async () => page.evaluate(() => document.documentElement.classList.contains("dark")), {
            timeout: 15_000,
          })
          .toBe(theme === "dark");
        await expect
          .poll(async () =>
            page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSTransition).length)
          )
          .toBe(0);

        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();

        expect(results.violations, formatViolations(results.violations)).toEqual([]);
      });
    }
  });
}
