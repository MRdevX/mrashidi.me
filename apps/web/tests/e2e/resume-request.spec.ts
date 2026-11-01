import { expect, test } from "@playwright/test";

test.describe("Resume Request", () => {
  test("should open and close CV request modal", async ({ page }) => {
    await page.goto("/resume");

    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: "Request CV" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Request Resume" })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("emails a CV link without downloading in the browser", async ({ page }) => {
    await page.route("**/api/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Resume sent successfully" }),
      });
    });

    let downloadRequested = false;
    await page.route("**/api/cv/download**", async (route) => {
      downloadRequested = true;
      await route.abort();
    });

    await page.goto("/resume");

    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: "Request CV" }).click();

    await page.getByLabel("Full Name").fill("John Doe");
    await page.getByLabel("Email Address").fill("john@example.com");
    await page.getByLabel("Company (Optional)").fill("Test Company");

    await page.getByRole("button", { name: "Email me the CV" }).click();

    await expect(page.getByText("Sent! Check your inbox for the download link.", { exact: true })).toBeVisible();
    expect(downloadRequested).toBe(false);
  });
});
