import { describe, expect, it } from "vitest";
import { parseAskMrError } from "@/features/ask-mr/client/errors";
import { safeLink } from "@/features/ask-mr/client/links";
import { starterQuestions } from "@/features/ask-mr/client/suggestions";
import { parseAskCommand } from "@/features/home/terminal/utils";

const ORIGIN = "https://mrashidi.me";

describe("safeLink", () => {
  it("keeps internal paths as client-side links", () => {
    expect(safeLink("/projects", ORIGIN)).toEqual({ href: "/projects", external: false });
    expect(safeLink("https://mrashidi.me/resume#cv", ORIGIN)).toEqual({ href: "/resume#cv", external: false });
  });

  it("allows hosts that appear in the site data", () => {
    expect(safeLink("https://github.com/mrdevx/some-repo", ORIGIN)).toEqual({
      href: "https://github.com/mrdevx/some-repo",
      external: true,
    });
    expect(safeLink("https://mrdevx.medium.com/post", ORIGIN)?.external).toBe(true);
  });

  it("only allows mailto for Mahdi's address", () => {
    expect(safeLink("mailto:contact@mrashidi.me", ORIGIN)).not.toBeNull();
    expect(safeLink("mailto:someone@else.com", ORIGIN)).toBeNull();
  });

  it("drops unknown hosts and dangerous schemes", () => {
    expect(safeLink("https://evil.example/phish", ORIGIN)).toBeNull();
    expect(safeLink("javascript:alert(1)", ORIGIN)).toBeNull();
    expect(safeLink("//evil.example", ORIGIN)).toBeNull();
    expect(safeLink(undefined, ORIGIN)).toBeNull();
  });
});

describe("parseAskMrError", () => {
  it("reads typed API error bodies", () => {
    const error = new Error(JSON.stringify({ error: "rate_limited", message: "Slow down", retryAfter: 12 }));
    expect(parseAskMrError(error)).toEqual({ code: "rate_limited", message: "Slow down", retryAfter: 12 });
  });

  it("falls back to a generic message", () => {
    expect(parseAskMrError(new Error("Ask MR hit a snag. Please try again."))?.code).toBe("server");
    expect(parseAskMrError(undefined)).toBeNull();
  });

  it("explains network failures", () => {
    expect(parseAskMrError(new TypeError("Failed to fetch"))?.message).toMatch(/connection/);
  });
});

describe("starterQuestions", () => {
  it("tailors questions to the current section", () => {
    expect(starterQuestions("/projects")).toContain("What's his most complex project?");
    expect(starterQuestions("/projects/anything")).toContain("What's his most complex project?");
    expect(starterQuestions("/")).toContain("What does Mahdi work on these days?");
    expect(starterQuestions(null).length).toBeGreaterThan(0);
  });
});

describe("parseAskCommand", () => {
  it("extracts the question", () => {
    expect(parseAskCommand("ask what is his stack?")).toBe("what is his stack?");
    expect(parseAskCommand("  ASK  Has he used Kafka?  ")).toBe("Has he used Kafka?");
  });

  it("ignores bare ask and other commands", () => {
    expect(parseAskCommand("ask")).toBeNull();
    expect(parseAskCommand("asking around")).toBeNull();
    expect(parseAskCommand("help")).toBeNull();
  });
});
