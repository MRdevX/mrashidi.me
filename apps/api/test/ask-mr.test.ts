import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { api } from "./api.ts";

const FIXTURES = "../../../packages/types/fixtures/api";
const withToken = { headers: { Authorization: "Bearer test-token" } };

describe("Ask MR knowledge", () => {
  it.each(["/v1/knowledge", "/v1/knowledge/context"])("%s requires the content API token", async (path) => {
    expect((await api(path)).status).toBe(401);
    expect((await api(path, { headers: { Authorization: "Bearer wrong" } })).status).toBe(401);
  });

  it("serves knowledge with the token, uncached", async () => {
    const res = await api("/v1/knowledge", withToken);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await res.json()).toEqual(fixtureContent.knowledge);
  });

  it("serves the knowledge context with the token, uncached, matching the read-model fixture", async () => {
    const res = await api("/v1/knowledge/context", withToken);
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(
      `${FIXTURES}/knowledge-context.json`
    );
  });
});
