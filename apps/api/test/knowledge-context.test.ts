import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { buildKnowledgeContext, type KnowledgeSources } from "../src/modules/ask-mr/domain/knowledge-context.ts";
import { toProjectEntry } from "../src/modules/projects/domain/project-entry.ts";

const { experience, knowledge: extra, profile } = fixtureContent;
const sources: KnowledgeSources = { ...fixtureContent, projects: fixtureContent.projects.map(toProjectEntry) };
const withKnowledge = (knowledge: Partial<KnowledgeSources["knowledge"]>) =>
  buildKnowledgeContext({ ...sources, knowledge: { ...extra, ...knowledge } });

describe("knowledge context", () => {
  const context = buildKnowledgeContext(sources);

  it("includes every project with its slug", () => {
    for (const project of sources.projects) {
      expect(context).toContain(`## ${project.title} [slug: ${project.slug}]`);
    }
    expect(context).toContain(`# Projects (${sources.projects.length})`);
  });

  it("includes every role except hidden ones", () => {
    const hidden = experience[1].company;
    const text = withKnowledge({ hiddenRoles: [hidden] });
    for (const role of experience) {
      const line = `## ${role.title} — ${role.company}`;
      if (role.company === hidden) {
        expect(text).not.toContain(line);
      } else {
        expect(text).toContain(line);
      }
    }
  });

  it("includes CV-only projects and skills", () => {
    for (const project of extra.extraProjects) {
      expect(context).toContain(`## ${project.title} (${project.year})`);
    }
    expect(context).toContain("Also on his CV (no level given):");
  });

  it("includes contact links and languages", () => {
    expect(context).toContain(profile.person.email);
    expect(context).toContain(profile.social.github);
    const [language] = fixtureContent.about.languages;
    expect(context).toContain(`${language.language}: ${language.level}`);
  });

  it("omits empty FAQ fields", () => {
    const empty = withKnowledge({ availability: "", remote: "", relocation: "", funFacts: [], faq: [], roleNotes: [] });
    expect(empty).not.toContain("Availability:");
    expect(empty).not.toContain("Fun facts:");
  });

  it("renders filled FAQ fields and merges role notes", () => {
    const company = experience[0].company;
    const text = withKnowledge({
      availability: "Open to senior roles",
      funFacts: ["Plays chess"],
      faq: [{ question: "Freelance?", answer: "Yes." }],
      roleNotes: [{ company, highlights: ["Built the booking service"] }],
      hiddenRoles: [],
    });
    expect(text).toContain(`# Additional facts from ${profile.person.name.split(" ")[0]}`);
    expect(text).toContain("- Availability: Open to senior roles");
    expect(text).toContain("  - Plays chess");
    expect(text).toContain("Q: Freelance?\nA: Yes.");
    const roleBlock = text.split(`## ${experience[0].title} — ${company}`)[1].split("\n## ")[0];
    expect(roleBlock).toContain("- Built the booking service");
  });
});
