import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { authedApi } from "./api.ts";

const FIXTURES = "../../../packages/types/fixtures/api";

describe("Ask MR knowledge", () => {
  it("serves knowledge with the token, uncached", async () => {
    const res = await authedApi("/v1/knowledge");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await res.json()).toEqual(fixtureContent.knowledge);
  });

  it("serves the knowledge context with the token, uncached, matching the read-model fixture", async () => {
    const res = await authedApi("/v1/knowledge/context");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(
      `${FIXTURES}/knowledge-context.json`
    );
  });
});
