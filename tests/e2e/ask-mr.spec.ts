import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

/** Builds an AI SDK UI message stream (SSE) so tests never hit the real model. */
function uiStream(text: string, tools: { name: string; input: unknown; output: unknown }[] = []): string {
  const frame = (chunk: unknown) => `data: ${JSON.stringify(chunk)}\n\n`;
  return [
    frame({ type: "start", messageId: "msg-1" }),
    frame({ type: "start-step" }),
    frame({ type: "text-start", id: "t1" }),
    ...text.split(/(?<= )/).map((delta) => frame({ type: "text-delta", id: "t1", delta })),
    frame({ type: "text-end", id: "t1" }),
    ...tools.flatMap((tool, i) => [
      frame({ type: "tool-input-available", toolCallId: `c${i}`, toolName: tool.name, input: tool.input }),
      frame({ type: "tool-output-available", toolCallId: `c${i}`, output: tool.output }),
    ]),
    frame({ type: "finish-step" }),
    frame({ type: "finish" }),
    "data: [DONE]\n\n",
  ].join("");
}

const PROJECT = {
  slug: "ev-fleet-management-platform-suite",
  title: "EV Fleet Management Platform Suite",
  description: "A comprehensive suite of tools for an EV SaaS provider.",
  stack: ["NestJS", "Kubernetes", "Azure"],
  type: "client",
  year: "2021–2025",
};

async function mockChat(page: Page, body = uiStream("Mahdi led a zero-downtime GCP to Azure migration.")) {
  const requests: unknown[] = [];
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      headers: { "content-type": "text/event-stream", "x-vercel-ai-ui-message-stream": "v1" },
      body,
    });
  });
  return requests;
}

const panel = (page: Page) => page.getByRole("dialog", { name: /Ask MR/ });
const launcher = (page: Page) => page.getByRole("button", { name: /Open Ask MR/ });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark");
    sessionStorage.clear();
  });
});

test("answers a starter question with streamed text, a project card and follow-ups", async ({ page }) => {
  const requests = await mockChat(
    page,
    uiStream("Mahdi led a zero-downtime GCP to Azure migration.", [
      { name: "showProjects", input: { slugs: [PROJECT.slug] }, output: { projects: [PROJECT] } },
      {
        name: "suggestFollowUps",
        input: { questions: ["Which tools did he use?"] },
        output: { questions: ["Which tools did he use?"] },
      },
    ])
  );
  await page.goto("/");
  await launcher(page).click();
  await expect(panel(page)).toBeVisible();

  await panel(page).getByRole("button", { name: "What does Mahdi work on these days?" }).click();

  await expect(panel(page).getByText("Mahdi led a zero-downtime GCP to Azure migration.")).toBeVisible();
  await expect(panel(page).getByText(PROJECT.title)).toBeVisible();
  await expect(panel(page).getByRole("button", { name: "Which tools did he use?" })).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({ pathname: "/" });
});

test("project cards open the project drawer and minimize the chat", async ({ page }) => {
  await mockChat(
    page,
    uiStream("Here is his biggest project.", [
      { name: "showProjects", input: { slugs: [PROJECT.slug] }, output: { projects: [PROJECT] } },
    ])
  );
  await page.goto("/");
  await launcher(page).click();
  await panel(page).getByLabel("Ask a question about Mahdi").fill("Biggest project?");
  await page.keyboard.press("Enter");

  await panel(page)
    .getByRole("button", { name: /Open project details/ })
    .click();

  await expect(page).toHaveURL(/\/projects/);
  await expect(page.getByRole("dialog").getByRole("heading", { name: PROJECT.title })).toBeVisible();
  await expect(panel(page)).toBeHidden();
});

test("keeps the conversation across navigation", async ({ page }) => {
  await mockChat(page);
  await page.goto("/");
  await launcher(page).click();
  await panel(page).getByLabel("Ask a question about Mahdi").fill("Cloud experience?");
  await page.keyboard.press("Enter");
  await expect(panel(page).getByText("Cloud experience?")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("link", { name: "Projects" }).first().click();
  await expect(page).toHaveURL(/\/projects/);
  await launcher(page).click();
  await expect(panel(page).getByText("Cloud experience?")).toBeVisible();
});

test("Cmd/Ctrl+K toggles the chat", async ({ page }) => {
  await page.goto("/");
  await expect(launcher(page)).toBeVisible();
  await page.keyboard.press("ControlOrMeta+k");
  await expect(panel(page)).toBeVisible();
  await page.keyboard.press("ControlOrMeta+k");
  await expect(panel(page)).toBeHidden();
});

test("hero chips send their question", async ({ page }) => {
  const requests = await mockChat(page);
  await page.goto("/");
  await page.getByRole("list", { name: "Ask Ask MR" }).getByRole("button", { name: "Is he open to work?" }).click();
  await expect(panel(page).getByText("Is he open to work?")).toBeVisible();
  await expect(panel(page).getByText("Mahdi led a zero-downtime GCP to Azure migration.")).toBeVisible();
  expect(requests).toHaveLength(1);
});

test("shows a countdown when rate limited", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ error: "rate_limited", message: "You're sending messages quickly.", retryAfter: 30 }),
    })
  );
  await page.goto("/");
  await launcher(page).click();
  await panel(page).getByLabel("Ask a question about Mahdi").fill("Hello?");
  await page.keyboard.press("Enter");
  await expect(panel(page).getByRole("alert")).toContainText("You're sending messages quickly.");
  await expect(panel(page).getByRole("alert")).toContainText(/Try again in \d+s/);
});

test("terminal `ask` streams an answer", async ({ page }) => {
  await mockChat(page, uiStream("His core stack is NestJS and PostgreSQL."));
  await page.goto("/");
  const input = page.getByPlaceholder("Type 'help' for available commands...");
  await input.fill("ask what is his stack?");
  await input.press("Enter");
  await expect(page.getByText("His core stack is NestJS and PostgreSQL.")).toBeVisible();
});

for (const theme of ["dark", "light"] as const) {
  test(`open chat panel has no automatic WCAG A/AA violations (${theme})`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    await mockChat(page);
    await page.goto("/");
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.classList.contains("dark")), {
        timeout: 15_000,
      })
      .toBe(theme === "dark");
    await launcher(page).click();
    await panel(page).getByLabel("Ask a question about Mahdi").fill("Cloud experience?");
    await page.keyboard.press("Enter");
    await expect(panel(page).getByText("Mahdi led a zero-downtime GCP to Azure migration.")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include("[data-ask-mr]")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const report = results.violations.flatMap((v) =>
      v.nodes.map((n) => `${v.id}: ${n.failureSummary?.split("\n").at(-1)?.trim()} → ${n.html}`)
    );
    expect(report).toEqual([]);
  });
}
