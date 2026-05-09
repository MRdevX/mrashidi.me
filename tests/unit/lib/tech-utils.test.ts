import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import {
  filterProjects,
  getSortedTechnologiesByUsage,
  matchesSearch,
  processTechnologyData,
  sortProjectsByDate,
} from "@/lib/tech/utils";

const sample = (over: Partial<Project> = {}): Project => ({
  title: "Alpha App",
  description: "A tool for betas",
  stack: ["TypeScript", "React"],
  visibility: "public",
  type: "personal",
  openSource: true,
  ...over,
});

describe("matchesSearch", () => {
  const project = sample();

  it("treats blank query as match", () => {
    expect(matchesSearch(project, "")).toBe(true);
    expect(matchesSearch(project, "   ")).toBe(true);
  });

  it("matches title and description with regex", () => {
    expect(matchesSearch(project, "Alpha")).toBe(true);
    expect(matchesSearch(project, "betas")).toBe(true);
  });

  it("matches highlights, stack, client, and role", () => {
    expect(matchesSearch(sample({ highlights: ["Gamma feature"] }), "Gamma")).toBe(true);
    expect(matchesSearch(project, "React")).toBe(true);
    expect(matchesSearch(sample({ clientName: "Acme Corp" }), "Acme")).toBe(true);
    expect(matchesSearch(sample({ role: "Lead" }), "Lead")).toBe(true);
  });

  it("falls back to substring search when regex is invalid", () => {
    expect(matchesSearch(project, "[")).toBe(false);
    expect(matchesSearch(sample({ title: "Bracket [x]" }), "[")).toBe(true);
  });
});

describe("filterProjects", () => {
  const projects = [
    sample({ title: "One", stack: ["TypeScript", "React"], openSource: true }),
    sample({ title: "Two", stack: ["Python"], openSource: false }),
  ];

  it("filters by search, stack selection, and open source flag", () => {
    expect(filterProjects(projects, "One", new Set(), false)).toHaveLength(1);
    expect(filterProjects(projects, "", new Set(["TypeScript"]), false)).toHaveLength(1);
    expect(filterProjects(projects, "", new Set(), true)).toHaveLength(1);
    expect(filterProjects(projects, "nothing", new Set(), false)).toHaveLength(0);
  });

  it("requires all selected stacks to be present on a project", () => {
    const list = [
      sample({ title: "Full", stack: ["TypeScript", "React"] }),
      sample({ title: "Partial", stack: ["TypeScript"] }),
    ];
    const filtered = filterProjects(list, "", new Set(["TypeScript", "React"]), false);
    expect(filtered.map((p) => p.title)).toEqual(["Full"]);
  });
});

describe("processTechnologyData", () => {
  it("counts usage and buckets known technologies by category", () => {
    const { categorizedStacks, stackUsageCount } = processTechnologyData([
      { stack: ["TypeScript", "React"] },
      { stack: ["TypeScript", "PostgreSQL"] },
    ]);

    expect(stackUsageCount.TypeScript).toBe(2);
    expect(stackUsageCount.React).toBe(1);
    expect(categorizedStacks.languages).toContain("TypeScript");
    expect(categorizedStacks.frameworks).toContain("React");
    expect(categorizedStacks.databases).toContain("PostgreSQL");
  });

  it("ignores technologies not in the category map", () => {
    const { categorizedStacks, stackUsageCount } = processTechnologyData([{ stack: ["UnknownXZY"] }]);
    expect(stackUsageCount.UnknownXZY).toBe(1);
    expect(Object.values(categorizedStacks).every((arr) => arr.length === 0)).toBe(true);
  });
});

describe("getSortedTechnologiesByUsage", () => {
  it("sorts entries within each category by count descending", () => {
    const sorted = getSortedTechnologiesByUsage([
      { stack: ["React", "TypeScript"] },
      { stack: ["React", "TypeScript"] },
      { stack: ["TypeScript"] },
    ]);

    const langs = sorted.languages.map((t) => t.tech);
    const fw = sorted.frameworks.map((t) => t.tech);
    expect(langs[0]).toBe("TypeScript");
    expect(fw[0]).toBe("React");
    expect(sorted.languages.find((t) => t.tech === "TypeScript")?.count).toBe(3);
    expect(sorted.frameworks.find((t) => t.tech === "React")?.count).toBe(2);
  });
});

describe("sortProjectsByDate", () => {
  it("orders by commit date when githubUrl is in map", () => {
    const a = sample({ title: "Old", githubUrl: "https://github.com/o/a" });
    const b = sample({ title: "New", githubUrl: "https://github.com/o/b" });
    const map = new Map<string, Date>([
      [a.githubUrl as string, new Date("2020-01-01")],
      [b.githubUrl as string, new Date("2024-06-01")],
    ]);
    const sorted = sortProjectsByDate([a, b], map);
    expect(sorted[0].title).toBe("New");
  });

  it("falls back to year field when no commit date", () => {
    const old = sample({ title: "A", year: "2018–2019" });
    const recent = sample({ title: "B", year: "2023" });
    const sorted = sortProjectsByDate([old, recent]);
    expect(sorted[0].title).toBe("B");
  });
});
