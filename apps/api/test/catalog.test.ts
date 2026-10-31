import type { Project } from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { describe, expect, it } from "vitest";
import { countStackUsage, describeCatalog, groupStacks, topStacks } from "#modules/projects/domain/catalog.ts";
import { toProjectEntry } from "#modules/projects/domain/project-entry.ts";

const project = (over: Partial<Project> = {}): Project => ({
  title: "Alpha App",
  description: "A tool for betas",
  stack: ["TypeScript", "React"],
  visibility: "public",
  type: "personal",
  openSource: true,
  ...over,
});

describe("stack grouping", () => {
  it("places every technology used by a project in exactly one group", () => {
    const usage = countStackUsage(fixtureContent.projects);
    const grouped = groupStacks(usage).flatMap((group) => group.items);

    expect(new Set(grouped).size).toBe(grouped.length);
    expect(grouped.sort()).toEqual([...usage.keys()].sort());
  });

  it("orders top stacks by usage, then name", () => {
    const usage = new Map([
      ["Go", 1],
      ["Rust", 3],
      ["Bash", 3],
    ]);
    expect(topStacks(usage, 2)).toEqual(["Bash", "Rust"]);
  });
});

describe("catalog overview", () => {
  it("summarises the catalog", () => {
    const catalog = [
      project({ title: "One", stack: ["Go", "Docker"] }),
      project({ title: "Two", stack: ["Go"], openSource: false }),
      project({ title: "Three", stack: ["Rust"] }),
    ];
    expect(describeCatalog(catalog)).toMatchObject({ projectCount: 3, openSourceCount: 2, stackCount: 3 });
  });
});

describe("project entry", () => {
  it("reads the year range from free text", () => {
    expect(toProjectEntry(project({ year: "2020–2023" }))).toMatchObject({ startYear: 2020, endYear: 2023 });
    expect(toProjectEntry(project({ year: "2025" }))).toMatchObject({ startYear: 2025, endYear: 2025 });
    expect(toProjectEntry(project())).toMatchObject({ startYear: null, endYear: null });
  });

  it("derives the slug from the title", () => {
    expect(toProjectEntry(project({ title: "Alpha App" })).slug).toBe("alpha-app");
  });

  it("dates activity by the latest commit, else by the end of the last year", () => {
    const repo = project({ year: "2021–2022", githubUrl: "https://github.com/o/r/" });
    expect(toProjectEntry(repo)).toMatchObject({ latestCommit: null, lastActivityAt: "2022-12-31T00:00:00.000Z" });
    expect(
      toProjectEntry(repo, { "https://github.com/o/r/": { hash: "abc", committedAt: "2024-05-01T00:00:00.000Z" } })
    ).toMatchObject({
      latestCommit: { hash: "abc", committedAt: "2024-05-01T00:00:00.000Z", url: "https://github.com/o/r/commit/abc" },
      lastActivityAt: "2024-05-01T00:00:00.000Z",
    });
    expect(toProjectEntry(project()).lastActivityAt).toBeNull();
  });
});
