import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/core/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

import {
  canonicalOrigin,
  computeCorsAllowedOrigins,
  parseCommaSeparatedOrigins,
  reflectOriginAgainstAllowlist,
} from "@/lib/api/cors-allowlist";

describe("canonicalOrigin", () => {
  it("normalizes page URLs", () => {
    expect(canonicalOrigin("https://mrashidi.me/about")).toBe("https://mrashidi.me");
    expect(canonicalOrigin("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("returns null on invalid input", () => {
    expect(canonicalOrigin("")).toBeNull();
    expect(canonicalOrigin("not a url")).toBeNull();
  });
});

describe("parseCommaSeparatedOrigins", () => {
  it("parses comma-separated canonical origins when scheme present", () => {
    expect(parseCommaSeparatedOrigins("https://a.example, https://b.example/foo")).toEqual([
      "https://a.example",
      "https://b.example",
    ]);
  });

  it("drops entries missing a scheme", () => {
    expect(parseCommaSeparatedOrigins("mrashidi.me")).toEqual([]);
  });
});

describe("computeCorsAllowedOrigins", () => {
  it("merges CSV and site URL (no VERCEL/dev without env simulation)", () => {
    expect(
      [
        ...computeCorsAllowedOrigins({
          nextPublicSiteUrl: "https://mrashidi.me",
          corsAllowedOriginsCsv: "https://www.mrashidi.me",
        }),
      ].sort()
    ).toEqual(["https://mrashidi.me", "https://www.mrashidi.me"]);
  });
});

describe("reflectOriginAgainstAllowlist", () => {
  const allow = new Set(["https://mrashidi.me"]);

  it("returns canonical origin when matched", () => {
    expect(reflectOriginAgainstAllowlist("https://mrashidi.me", allow)).toBe("https://mrashidi.me");
  });

  it("returns null for unknown origins", () => {
    expect(reflectOriginAgainstAllowlist("https://evil.example", allow)).toBeNull();
  });
});
