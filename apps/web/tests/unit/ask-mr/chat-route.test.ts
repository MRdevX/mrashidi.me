import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkBotId: vi.fn(),
  checkRateLimit: vi.fn(),
  postAskMrChat: vi.fn(),
  afterTasks: [] as Promise<unknown>[],
  logged: vi.fn(),
}));

vi.mock("botid/server", () => ({ checkBotId: mocks.checkBotId }));
vi.mock("@/lib/services/rate-limit", () => ({
  checkRateLimit: mocks.checkRateLimit,
  getClientIdentifier: () => "1.2.3.4",
}));
vi.mock("@/lib/content/server", () => ({ postAskMrChat: mocks.postAskMrChat }));
vi.mock("next/server", () => ({
  after: (task: () => Promise<unknown>) => {
    mocks.afterTasks.push(task());
  },
}));
vi.mock("@/features/ask-mr/server/redis", () => ({
  getAskMrRedis: () => ({
    rpush: mocks.logged,
    ltrim: vi.fn(),
    expire: vi.fn(),
    incr: vi.fn().mockResolvedValue(1),
    incrby: vi.fn(),
  }),
}));
vi.mock("@/lib/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/core")>();
  const overrides: Record<string, unknown> = { ASK_MR_ENABLED: true, ASK_MR_DAILY_BUDGET: 1000 };
  return {
    ...actual,
    getEnv: (key: string) => (key in overrides ? overrides[key] : actual.getEnv(key as never)),
  };
});

import { POST } from "@/app/api/chat/route";

const body = {
  conversationId: "6f1c1f9e-8f39-4d61-9a6e-3b8f0f6c2d11",
  pathname: "/",
  messages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "What does Jane do?" }] }],
};

const post = () =>
  POST(
    new Request("https://mrashidi.me/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
  );

const sse = (chunks: unknown[]) =>
  new Response(chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`).join(""), {
    headers: { "content-type": "text/event-stream" },
  });

const answer = [
  { type: "start", messageId: "m1" },
  { type: "start-step" },
  { type: "text-start", id: "t1" },
  { type: "text-delta", id: "t1", delta: "Jane is a backend engineer." },
  { type: "text-end", id: "t1" },
  { type: "tool-input-available", toolCallId: "c1", toolName: "suggestFollowUps", input: { questions: ["Stack?"] } },
  { type: "tool-output-available", toolCallId: "c1", output: { questions: ["Stack?"] } },
  { type: "finish-step" },
  {
    type: "finish",
    messageMetadata: { model: "@cf/zai-org/glm-4.7-flash", finishReason: "tool-calls", totalTokens: 9 },
  },
];

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.afterTasks.length = 0;
    mocks.checkBotId.mockResolvedValue({ isBot: false });
    mocks.checkRateLimit.mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: new Date() });
  });

  it("passes the API's UI message stream through to the visitor", async () => {
    mocks.postAskMrChat.mockResolvedValue(sse(answer));

    const response = await post();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    const text = await response.text();
    expect(text).toContain("Jane is a backend engineer.");
    expect(text).toContain("suggestFollowUps");
    expect(mocks.postAskMrChat).toHaveBeenCalledWith(
      expect.objectContaining({ conversationId: body.conversationId, pathname: "/" }),
      expect.any(AbortSignal)
    );
  });

  it("logs the answer, its tools and the model that answered", async () => {
    mocks.postAskMrChat.mockResolvedValue(sse(answer));

    await (await post()).text();
    await Promise.all(mocks.afterTasks);

    const [, entry] = mocks.logged.mock.calls[0] as [string, string];
    expect(JSON.parse(entry)).toMatchObject({
      question: "What does Jane do?",
      answer: "Jane is a backend engineer.",
      tools: ["suggestFollowUps"],
      model: "@cf/zai-org/glm-4.7-flash",
    });
  });

  it("answers the server error when the API fails", async () => {
    mocks.postAskMrChat.mockResolvedValue(new Response("boom", { status: 500 }));

    const response = await post();
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: "server" });
  });

  it("reports Ask MR as offline without a content API", async () => {
    mocks.postAskMrChat.mockResolvedValue(null);

    const response = await post();
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: "disabled" });
  });

  it("returns the guard response without calling the API", async () => {
    mocks.checkBotId.mockResolvedValue({ isBot: true });

    const response = await post();
    expect(response.status).toBe(403);
    expect(mocks.postAskMrChat).not.toHaveBeenCalled();
  });
});
