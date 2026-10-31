import { describe, expect, it } from "vitest";
import { fixtureContent } from "../fixtures";
import { AskMrKnowledgeSchema } from "./index";

describe("AskMrKnowledgeSchema", () => {
  const knowledge = fixtureContent.knowledge;

  it.each([
    ["phone number", { funFacts: ["Call me on +49 151 2345678"] }],
    ["personal email", { funFacts: ["jane@gmail.com"] }],
    ["residence or visa status", { relocation: "Holds a Blue Card" }],
    ["compensation", { faq: [{ question: "Rate?", answer: "Salary from €80k" }] }],
    ["workAuthorization", { workAuthorization: "Citizen" }],
  ])("rejects knowledge with a %s", (_label, patch) => {
    expect(AskMrKnowledgeSchema.safeParse({ ...knowledge, ...patch }).success).toBe(false);
  });

  it("accepts knowledge without private details", () => {
    expect(AskMrKnowledgeSchema.safeParse(knowledge).success).toBe(true);
  });
});
