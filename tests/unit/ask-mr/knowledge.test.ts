import { describe, expect, it } from "vitest";
import { workExperience } from "@/data";
import { askMrKnowledge } from "@/features/ask-mr/knowledge/askMrKnowledge";
import { buildKnowledge, defaultKnowledgeSources } from "@/features/ask-mr/knowledge/buildKnowledge";
import { projectSlug } from "@/features/projects/domain/project";
import { projects } from "@/features/projects/infrastructure/projectData";

describe("projectSlug", () => {
  it("creates url-safe slugs", () => {
    expect(projectSlug({ title: "EV Fleet Management Platform Suite" })).toBe("ev-fleet-management-platform-suite");
    expect(projectSlug({ title: "NestJS Queue Worker PoC" })).toBe("nestjs-queue-worker-poc");
    expect(projectSlug({ title: "Café & Co. -- Tools" })).toBe("cafe-co-tools");
  });

  it("is unique across all projects", () => {
    const slugs = projects.map(projectSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("buildKnowledge", () => {
  const knowledge = buildKnowledge();

  it("includes every project with its slug", () => {
    for (const project of projects) {
      expect(knowledge).toContain(`## ${project.title} [slug: ${projectSlug(project)}]`);
    }
    expect(knowledge).toContain(`# Projects (${projects.length})`);
  });

  it("includes every role except hidden ones", () => {
    for (const role of workExperience) {
      const line = `## ${role.title} — ${role.company}`;
      if (askMrKnowledge.hiddenRoles.includes(role.company)) {
        expect(knowledge).not.toContain(line);
      } else {
        expect(knowledge).toContain(line);
      }
    }
  });

  it("includes CV-only projects and skills", () => {
    for (const project of askMrKnowledge.extraProjects) {
      expect(knowledge).toContain(`## ${project.title} (${project.year})`);
    }
    expect(knowledge).toContain("Also on his CV (no level given):");
  });

  it("keeps private details out of the public knowledge file", () => {
    const serialized = JSON.stringify(askMrKnowledge);
    expect(serialized).not.toMatch(/\+\d[\d\s]{7,}/); // phone numbers
    expect(serialized).not.toMatch(/@gmail\.com/i);
    expect(serialized).not.toMatch(/blue card|visa|residence permit|salary|€|\$\d/i);
    expect(askMrKnowledge.workAuthorization).toBe("");
  });

  it("includes contact links and languages but not placeholder fields", () => {
    expect(knowledge).toContain("contact@mrashidi.me");
    expect(knowledge).toContain("https://github.com/mrdevx");
    expect(knowledge).toContain("German: Pre-Intermediate (A2)");
    expect(knowledge).not.toContain("your_twitter_handle");
  });

  it("omits empty FAQ fields", () => {
    const empty = buildKnowledge({
      ...defaultKnowledgeSources,
      extra: { ...askMrKnowledge, availability: "", remote: "", relocation: "", funFacts: [], faq: [], roleNotes: [] },
    });
    expect(empty).not.toContain("Availability:");
    expect(empty).not.toContain("Fun facts:");
  });

  it("renders filled FAQ fields and merges role notes", () => {
    const company = workExperience[0].company;
    const text = buildKnowledge({
      ...defaultKnowledgeSources,
      extra: {
        ...askMrKnowledge,
        availability: "Open to senior roles",
        funFacts: ["Plays chess"],
        faq: [{ question: "Freelance?", answer: "Yes, via Notable Nomads." }],
        roleNotes: [{ company, highlights: ["Built the booking service"] }],
        hiddenRoles: [],
      },
    });
    expect(text).toContain("# Additional facts from Mahdi");
    expect(text).toContain("- Availability: Open to senior roles");
    expect(text).toContain("  - Plays chess");
    expect(text).toContain("Q: Freelance?\nA: Yes, via Notable Nomads.");
    const roleBlock = text.split(`## ${workExperience[0].title} — ${company}`)[1].split("\n## ")[0];
    expect(roleBlock).toContain("- Built the booking service");
  });

  it("stays small enough to send on every request", () => {
    // ~4 chars per token; keep the cached prefix comfortably under ~20k tokens.
    expect(knowledge.length).toBeLessThan(80_000);
  });
});
