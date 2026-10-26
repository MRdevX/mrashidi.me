import { projectSlug } from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { buildKnowledge } from "@/features/ask-mr/knowledge/buildKnowledge";

const { experience, knowledge: extra, profile, projects } = fixtureContent;

describe("buildKnowledge", () => {
  const knowledge = buildKnowledge(fixtureContent);

  it("includes every project with its slug", () => {
    for (const project of projects) {
      expect(knowledge).toContain(`## ${project.title} [slug: ${projectSlug(project)}]`);
    }
    expect(knowledge).toContain(`# Projects (${projects.length})`);
  });

  it("includes every role except hidden ones", () => {
    const hidden = experience[1].company;
    const text = buildKnowledge({ ...fixtureContent, knowledge: { ...extra, hiddenRoles: [hidden] } });
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
      expect(knowledge).toContain(`## ${project.title} (${project.year})`);
    }
    expect(knowledge).toContain("Also on his CV (no level given):");
  });

  it("includes contact links and languages", () => {
    expect(knowledge).toContain(profile.person.email);
    expect(knowledge).toContain(profile.social.github);
    const [language] = fixtureContent.about.languages;
    expect(knowledge).toContain(`${language.language}: ${language.level}`);
  });

  it("omits empty FAQ fields", () => {
    const empty = buildKnowledge({
      ...fixtureContent,
      knowledge: { ...extra, availability: "", remote: "", relocation: "", funFacts: [], faq: [], roleNotes: [] },
    });
    expect(empty).not.toContain("Availability:");
    expect(empty).not.toContain("Fun facts:");
  });

  it("renders filled FAQ fields and merges role notes", () => {
    const company = experience[0].company;
    const text = buildKnowledge({
      ...fixtureContent,
      knowledge: {
        ...extra,
        availability: "Open to senior roles",
        funFacts: ["Plays chess"],
        faq: [{ question: "Freelance?", answer: "Yes." }],
        roleNotes: [{ company, highlights: ["Built the booking service"] }],
        hiddenRoles: [],
      },
    });
    expect(text).toContain(`# Additional facts from ${profile.person.name.split(" ")[0]}`);
    expect(text).toContain("- Availability: Open to senior roles");
    expect(text).toContain("  - Plays chess");
    expect(text).toContain("Q: Freelance?\nA: Yes.");
    const roleBlock = text.split(`## ${experience[0].title} — ${company}`)[1].split("\n## ")[0];
    expect(roleBlock).toContain("- Built the booking service");
  });
});
