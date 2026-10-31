import { expect, type Page, test } from "@playwright/test";

const contributionGraph = (page: Page) => page.getByRole("img", { name: /GitHub contributions in the last year/ });
const viewToggle = (page: Page, name: "2d" | "3d") => page.getByRole("button", { name, exact: true });

async function supports3D(page: Page): Promise<boolean> {
  return page.evaluate(
    () => navigator.hardwareConcurrency > 2 && document.createElement("canvas").getContext("webgl2") !== null
  );
}

test("desktop opens the 2D graph and shows the skyline on request", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "3D runs on desktop Chromium only");
  await page.goto("/");
  test.skip(!(await supports3D(page)), "this machine has no WebGL2 or too few cores");

  await contributionGraph(page).scrollIntoViewIfNeeded();
  await expect(viewToggle(page, "2d")).toHaveAttribute("aria-pressed", "true");
  await expect(contributionGraph(page)).toHaveJSProperty("tagName", "svg");

  await viewToggle(page, "3d").click();
  await expect(contributionGraph(page).locator("canvas")).toBeVisible();

  await viewToggle(page, "2d").click();
  await expect(contributionGraph(page)).toHaveJSProperty("tagName", "svg");
});

test("reduced motion keeps the 2D graph and no WebGL", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await contributionGraph(page).scrollIntoViewIfNeeded();
  await expect(contributionGraph(page)).toHaveJSProperty("tagName", "svg");
  await expect(viewToggle(page, "3d")).toHaveCount(0);
});

test("phones keep the floating buttons apart", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "mobile layout only");
  await page.goto("/");
  await expect(page.getByRole("button", { name: /open an AI assistant/ })).toBeVisible();

  await expect(page.locator("#bmc-wbtn")).toBeHidden();
  const themeButton = await page.locator(".floating-action-btn").filter({ visible: true }).boundingBox();
  const askMr = await page.getByRole("button", { name: /open an AI assistant/ }).boundingBox();
  expect(themeButton).not.toBeNull();
  expect(askMr).not.toBeNull();
  if (themeButton && askMr) {
    expect(themeButton.x + themeButton.width).toBeLessThan(askMr.x);
  }
});
