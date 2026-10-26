import { describe, expect, it } from "vitest";
import { describeCatalog, queryCatalog } from "@/features/projects/domain/catalog";
import { createProjectMatcher, DEFAULT_FILTERS, toggleStack } from "@/features/projects/domain/filters";
import type { Project } from "@/features/projects/domain/project";
import { sortProjects } from "@/features/projects/domain/sort";
import { countStackUsage, groupStacks, topStacks } from "@/features/projects/domain/stack";
import { projects } from "@/features/projects/infrastructure/projectData";

const project = (over: Partial<Project> = {}): Project => ({
  title: "Alpha App",
  description: "A tool for betas",
  stack: ["TypeScript", "React"],
  visibility: "public",
  type: "personal",
  openSource: true,
  ...over,
});

const NO_COMMITS = new Map();

describe("createProjectMatcher", () => {
  const client = project({
    title: "Client",
    type: "client",
    openSource: false,
    stack: ["NestJS", "Redis"],
    highlights: ["Gamma"],
  });

  it("applies type, open source and every selected stack", () => {
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, type: "personal" })(client)).toBe(false);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, type: "personal" }, { ignoreType: true })(client)).toBe(true);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, openSourceOnly: true })(client)).toBe(false);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, stacks: ["NestJS", "Redis"] })(client)).toBe(true);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, stacks: ["NestJS", "Go"] })(client)).toBe(false);
  });

  it("searches text fields with regex and falls back to substring for invalid patterns", () => {
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, query: "gam+a" })(client)).toBe(true);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, query: "redis|kafka" })(client)).toBe(true);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, query: "[" })(client)).toBe(false);
    expect(createProjectMatcher({ ...DEFAULT_FILTERS, query: "[" })(project({ title: "Bracket [x]" }))).toBe(true);
  });

  it("toggles stacks in and out", () => {
    expect(toggleStack(["Go"], "Rust")).toEqual(["Go", "Rust"]);
    expect(toggleStack(["Go", "Rust"], "Go")).toEqual(["Rust"]);
  });
});

describe("sortProjects", () => {
  const older = project({ title: "Beta", year: "2020–2021" });
  const newer = project({ title: "Alpha", year: "2025" });

  it("sorts by latest commit, falling back to the latest year", () => {
    const withCommit = project({ title: "Gamma", year: "2021", githubUrl: "https://github.com/o/g" });
    const commits = new Map([["https://github.com/o/g", { date: new Date("2026-03-01") }]]);

    expect(sortProjects([older, newer, withCommit], "recent", commits).map((p) => p.title)).toEqual([
      "Gamma",
      "Alpha",
      "Beta",
    ]);
  });

  it("sorts oldest first and alphabetically", () => {
    expect(sortProjects([newer, older], "oldest", NO_COMMITS).map((p) => p.title)).toEqual(["Beta", "Alpha"]);
    expect(sortProjects([older, newer], "az", NO_COMMITS).map((p) => p.title)).toEqual(["Alpha", "Beta"]);
  });
});

describe("stack grouping", () => {
  it("places every technology used by a project in exactly one group", () => {
    const usage = countStackUsage(projects);
    const grouped = groupStacks(usage).flatMap((group) => group.items);

    expect(new Set(grouped).size).toBe(grouped.length);
    expect(grouped.sort()).toEqual([...usage.keys()].sort());
  });

  it("orders top stacks by usage, then name", () => {
    expect(
      topStacks(
        new Map([
          ["Go", 1],
          ["Rust", 3],
          ["Bash", 3],
        ]),
        2
      )
    ).toEqual(["Bash", "Rust"]);
  });
});

describe("queryCatalog", () => {
  const catalog = [
    project({ title: "One", stack: ["Go", "Docker"] }),
    project({ title: "Two", stack: ["Go"], type: "client", openSource: false }),
    project({ title: "Three", stack: ["Rust"] }),
  ];
  const overview = describeCatalog(catalog);

  it("counts types across the other filters and marks dead-end stacks", () => {
    const { results, typeCounts, topFacets } = queryCatalog(
      catalog,
      overview,
      { ...DEFAULT_FILTERS, type: "personal", stacks: ["Go"] },
      NO_COMMITS
    );

    expect(results.map((p) => p.title)).toEqual(["One"]);
    expect(typeCounts).toEqual({ all: 2, personal: 1, client: 1 });
    expect(topFacets.find((facet) => facet.tech === "Rust")).toMatchObject({ count: 0, disabled: true });
    expect(topFacets.find((facet) => facet.tech === "Go")).toMatchObject({ count: 1, selected: true, disabled: false });
  });

  it("summarises the catalog", () => {
    expect(overview).toMatchObject({ projectCount: 3, openSourceCount: 2, stackCount: 3 });
  });
});
