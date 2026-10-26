import type { CatalogOverview } from "@mrashidi/types";
import { describe, expect, it } from "vitest";
import { queryCatalog } from "@/features/projects/domain/catalog";
import { createProjectMatcher, DEFAULT_FILTERS, toggleStack } from "@/features/projects/domain/filters";
import type { Project } from "@/features/projects/domain/project";
import { sortProjects } from "@/features/projects/domain/sort";

const project = (over: Partial<Project> = {}): Project => ({
  slug: "alpha-app",
  startYear: null,
  endYear: null,
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
  const older = project({ title: "Beta", startYear: 2020, endYear: 2021 });
  const newer = project({ title: "Alpha", startYear: 2025, endYear: 2025 });

  it("sorts by latest commit, falling back to the latest year", () => {
    const withCommit = project({ title: "Gamma", startYear: 2021, endYear: 2021, githubUrl: "https://github.com/o/g" });
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

describe("queryCatalog", () => {
  const catalog = [
    project({ title: "One", stack: ["Go", "Docker"] }),
    project({ title: "Two", stack: ["Go"], type: "client", openSource: false }),
    project({ title: "Three", stack: ["Rust"] }),
  ];
  const overview: CatalogOverview = {
    projectCount: 3,
    openSourceCount: 2,
    stackCount: 3,
    topStacks: ["Go", "Docker", "Rust"],
    stackGroups: [{ name: "More", items: ["Docker", "Go", "Rust"] }],
  };

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
});
