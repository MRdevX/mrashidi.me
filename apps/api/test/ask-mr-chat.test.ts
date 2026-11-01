import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { CloudflareAIError } from "agents/models/ai-sdk";
import { type LanguageModel, simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { describe, expect, it } from "vitest";
import { createApp } from "#app";

const usage = {
  inputTokens: { total: 120, noCache: 20, cacheRead: 100, cacheWrite: undefined },
  outputTokens: { total: 30, text: 30, reasoning: undefined },
};

const finish = { type: "finish", finishReason: { unified: "tool-calls", raw: undefined }, usage };

const toolCall = (toolCallId: string, toolName: string, input: unknown) => ({
  type: "tool-call",
  toolCallId,
  toolName,
  input: JSON.stringify(input),
});

const followUps = toolCall("f1", "suggestFollowUps", { questions: ["Which projects use Hono?"] });

function streamingModel(...steps: unknown[][]) {
  let step = 0;
  return new MockLanguageModelV4({
    modelId: "@cf/test/model",
    doStream: async () => ({ stream: simulateReadableStream({ chunks: (steps[step++] ?? []) as never[] }) }),
  });
}

const body = {
  conversationId: "6f1c1f9e-8f39-4d61-9a6e-3b8f0f6c2d11",
  pathname: "/",
  messages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "What does Jane build?" }] }],
};

async function chat(model: LanguageModel, payload: unknown = body, token = "test-token") {
  const app = createApp({ askMrModel: () => () => model });
  const ctx = createExecutionContext();
  const res = await app.request(
    "/v1/ask-mr/chat",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
    },
    env,
    ctx
  );
  const text = await res.text();
  await waitOnExecutionContext(ctx);
  return { res, text };
}

describe("POST /v1/ask-mr/chat", () => {
  it("streams an answer that ends with follow-up suggestions and usage metadata", async () => {
    const { res, text } = await chat(
      streamingModel([
        { type: "text-start", id: "t1" },
        { type: "text-delta", id: "t1", delta: "Jane builds backend services." },
        { type: "text-end", id: "t1" },
        followUps,
        finish,
      ])
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(text).toContain("Jane builds backend services.");
    expect(text).toContain("Which projects use Hono?");
    expect(text).toContain('"model":"@cf/test/model"');
    expect(text).toContain('"cachedInputTokens":100');
  });

  it("shows project cards for known slugs only", async () => {
    const { text } = await chat(
      streamingModel(
        [toolCall("p1", "showProjects", { slugs: ["order-service", "no-such-project"] }), finish],
        [followUps, finish]
      )
    );

    expect(text).toContain('"slug":"order-service"');
    expect(text).not.toContain('"slug":"no-such-project"');
  });

  it("rejects a malformed chat request", async () => {
    const { res } = await chat(streamingModel([finish]), { messages: [] });
    expect(res.status).toBe(400);
  });

  it("rejects a request without the content token", async () => {
    const { res } = await chat(streamingModel([finish]), body, "wrong");
    expect(res.status).toBe(401);
  });

  it("hides model errors behind the generic message", async () => {
    const { text } = await chat(
      new MockLanguageModelV4({
        doStream: async () => {
          throw new Error("secret account 123");
        },
      })
    );

    expect(text).not.toContain("secret account");
    expect(text).toContain("Ask MR hit a snag");
  });

  it("reports budget_exhausted when Workers AI refuses for quota", async () => {
    const { text } = await chat(
      new MockLanguageModelV4({
        doStream: async () => {
          throw new CloudflareAIError({
            message: "3036: daily free allocation used",
            model: "@cf/zai-org/glm-4.7-flash",
            url: "workers-ai",
            requestBodyValues: {},
            status: 429,
            code: "rate-limit",
          });
        },
      })
    );

    expect(text).toContain("budget_exhausted");
    expect(text).toContain("Ask MR is resting for today");
  });
});
