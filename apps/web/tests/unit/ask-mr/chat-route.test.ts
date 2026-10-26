import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  model: null as unknown,
  checkBotId: vi.fn(),
  checkRateLimit: vi.fn(),
}));

vi.mock("botid/server", () => ({ checkBotId: mocks.checkBotId }));
vi.mock("@/lib/services/rate-limit", () => ({
  checkRateLimit: mocks.checkRateLimit,
  getClientIdentifier: () => "1.2.3.4",
}));
vi.mock("@/lib/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/core")>();
  const overrides: Record<string, unknown> = { ASK_MR_ENABLED: true, ASK_MR_DAILY_BUDGET: 1000 };
  return {
    ...actual,
    getEnv: (key: string) => {
      if (key === "ASK_MR_MODEL") {
        return mocks.model;
      }
      return key in overrides ? overrides[key] : actual.getEnv(key as never);
    },
  };
});

import { POST } from "@/app/api/chat/route";

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

function streamingModel(chunks: unknown[]) {
  return new MockLanguageModelV4({
    doStream: async () => ({ stream: simulateReadableStream({ chunks: chunks as never[] }) }),
  });
}

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

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkBotId.mockResolvedValue({ isBot: false });
    mocks.checkRateLimit.mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: new Date() });
  });

  it("streams text and tool output as a UI message stream", async () => {
    mocks.model = streamingModel([
      { type: "text-start", id: "t1" },
      { type: "text-delta", id: "t1", delta: "Jane is a backend engineer." },
      { type: "text-end", id: "t1" },
      {
        type: "tool-call",
        toolCallId: "c1",
        toolName: "suggestFollowUps",
        input: JSON.stringify({ questions: ["What stack does he use?"] }),
      },
      { type: "finish", finishReason: { unified: "tool-calls", raw: undefined }, usage },
    ]);

    const response = await post();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
    const text = await response.text();
    expect(text).toContain("Jane is a backend engineer.");
    expect(text).toContain("suggestFollowUps");
    expect(text).toContain("What stack does he use?");
  });

  it("masks upstream errors", async () => {
    mocks.model = new MockLanguageModelV4({
      doStream: async () => {
        throw new Error("gateway secret account 123 model anthropic/claude");
      },
    });

    const response = await post();
    const text = await response.text();
    expect(text).not.toContain("secret account");
    expect(text).toContain("Ask MR hit a snag");
  });

  it("returns the guard response without calling the model", async () => {
    const doStream = vi.fn();
    mocks.model = new MockLanguageModelV4({ doStream });
    mocks.checkBotId.mockResolvedValue({ isBot: true });

    const response = await post();
    expect(response.status).toBe(403);
    expect(doStream).not.toHaveBeenCalled();
  });
});
