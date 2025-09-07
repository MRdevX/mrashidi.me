import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

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

  test("should fill and submit CV request form", async ({ page }) => {
    await page.route("**/api/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Resume sent successfully" }),
      });
    });

    await page.route("**/api/cv/download", async (route) => {
      const pdfBuffer = fs.readFileSync(path.join(__dirname, "../fixtures/sample.pdf"));
      await route.fulfill({
        status: 200,
        contentType: "application/pdf",
        headers: {
          "content-length": pdfBuffer.length.toString(),
        },
        body: pdfBuffer,
      });
    });

    await page.goto("/resume");

    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: "Request CV" }).click();

    await page.getByLabel("Full Name").fill("John Doe");
    await page.getByLabel("Email Address").fill("john@example.com");
    await page.getByLabel("Company (Optional)").fill("Test Company");

    await page.getByRole("button", { name: "Download CV" }).click();

    await expect(page.locator("text=CV downloaded! Check your email for confirmation.")).toBeVisible();
  });
});
