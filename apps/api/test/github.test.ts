import { env } from "cloudflare:workers";
import type { ContributionLevel, Contributions } from "@mrashidi/types";
import { fixtureContent } from "@mrashidi/types/fixtures";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDb } from "#db/index.ts";
import { snapshots } from "#db/schema.ts";
import { createGitHubQueries } from "#modules/github/application/github-queries.ts";
import type { GitHubGateway } from "#modules/github/application/ports.ts";
import { createRefreshContributions, createRefreshRepoActivity } from "#modules/github/application/refresh-github.ts";
import { contributionWindow } from "#modules/github/domain/contribution-window.ts";
import { InvalidGitHubProfileUrlError, parseGitHubLogin, parseRepoRef } from "#modules/github/domain/repo-ref.ts";
import { createD1GitHubSnapshotRepository } from "#modules/github/infrastructure/d1-github-snapshot-repository.ts";
import { createGraphQLGitHubGateway } from "#modules/github/infrastructure/graphql-github-gateway.ts";
import { authedApi } from "./api.ts";

const FIXTURES = "../../../packages/types/fixtures/api";
const NOW = new Date("2026-03-04T05:00:00Z");
const repoUrl = fixtureContent.projects.find((project) => project.githubUrl)?.githubUrl ?? "";

function fakeContributions(): Contributions {
  const start = Date.UTC(2026, 0, 5);
  const contributions = Array.from({ length: 8 * 7 }, (_, i) => {
    const count = (i * 7) % 11;
    return {
      date: new Date(start + i * 86_400_000).toISOString().slice(0, 10),
      count,
      level: Math.min(4, Math.ceil(count / 3)) as ContributionLevel,
    };
  });
  return { contributions, total: contributions.reduce((sum, day) => sum + day.count, 0) };
}

function fakeGateway(overrides: Partial<GitHubGateway> = {}): GitHubGateway {
  return {
    latestCommits: async (repos) =>
      Object.fromEntries(repos.map((repo) => [repo.url, { hash: "abc123", committedAt: "2026-03-01T10:00:00.000Z" }])),
    contributions: async () => fakeContributions(),
    ...overrides,
  };
}

const repository = () => createD1GitHubSnapshotRepository(createDb(env.DB));
const refreshContributions = (gateway: GitHubGateway, now: Date) =>
  createRefreshContributions(gateway, repository())({ profileUrl: fixtureContent.profile.social.github, now });
const refreshRepoActivity = (gateway: GitHubGateway, now: Date) =>
  createRefreshRepoActivity(gateway, repository())({ repoUrls: [repoUrl], now });
const refresh = async (gateway: GitHubGateway, now = new Date()) => {
  await refreshContributions(gateway, now);
  await refreshRepoActivity(gateway, now);
};
const queries = (gateway: GitHubGateway) =>
  createGitHubQueries(
    repository(),
    {
      contributions: (now) => refreshContributions(gateway, now),
      repoActivity: (now) => refreshRepoActivity(gateway, now),
    },
    () => {},
    () => NOW
  );

describe("GitHub domain", () => {
  it("reads owner and name from repository URLs and ignores other hosts", () => {
    expect(parseRepoRef("https://github.com/o/r/")).toEqual({ url: "https://github.com/o/r/", owner: "o", name: "r" });
    expect(parseRepoRef("https://gitlab.com/o/r")).toBeNull();
    expect(parseRepoRef("https://github.com/o")).toBeNull();
    expect(parseRepoRef("not a url")).toBeNull();
  });

  it("reads the login from a GitHub profile URL", () => {
    expect(parseGitHubLogin("https://github.com/janedoe")).toBe("janedoe");
    expect(parseGitHubLogin("https://example.com/janedoe")).toBeNull();
  });

  it("starts the contribution year on a Monday", () => {
    const window = contributionWindow(NOW);
    expect(window).toEqual({ from: "2025-03-10T00:00:00Z", to: "2026-03-04T23:59:59Z" });
    expect(new Date(window.from).getUTCDay()).toBe(1);
  });
});

describe("GraphQL GitHub gateway", () => {
  it("asks for every repository in one request and keeps the ones that resolve", async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Response.json({
        data: {
          r0: { defaultBranchRef: { target: { oid: "def456", committedDate: "2026-02-01T00:00:00Z" } } },
          r1: null,
        },
        errors: [{ message: "Could not resolve to a Repository" }],
      })
    );
    const gateway = createGraphQLGitHubGateway("token", fetcher);

    const activity = await gateway.latestCommits([
      { url: "https://github.com/o/a", owner: "o", name: "a" },
      { url: "https://github.com/o/gone", owner: "o", name: "gone" },
    ]);

    expect(fetcher).toHaveBeenCalledTimes(1);
    const body = JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body));
    expect(body.variables).toEqual({ o0: "o", n0: "a", o1: "o", n1: "gone" });
    expect(activity).toEqual({ "https://github.com/o/a": { hash: "def456", committedAt: "2026-02-01T00:00:00.000Z" } });
  });

  it("maps contribution quartiles to levels and counts private contributions", async () => {
    const fetcher = vi.fn<typeof fetch>(async () =>
      Response.json({
        data: {
          user: {
            contributionsCollection: {
              restrictedContributionsCount: 5,
              contributionCalendar: {
                totalContributions: 3,
                weeks: [
                  {
                    contributionDays: [
                      { date: "2026-01-05", contributionCount: 3, contributionLevel: "THIRD_QUARTILE" },
                    ],
                  },
                ],
              },
            },
          },
        },
      })
    );

    const result = await createGraphQLGitHubGateway("token", fetcher).contributions("janedoe", contributionWindow(NOW));

    expect(result).toEqual({ contributions: [{ date: "2026-01-05", count: 3, level: 3 }], total: 8 });
  });

  it("fails when GitHub answers with an error status", async () => {
    const gateway = createGraphQLGitHubGateway("token", async () => new Response("nope", { status: 502 }));
    await expect(gateway.contributions("janedoe", contributionWindow(NOW))).rejects.toThrow("502");
  });
});

describe("GitHub refresh and routes", () => {
  beforeEach(async () => {
    await createDb(env.DB).delete(snapshots);
  });

  it("serves the refreshed contributions, matching the read-model fixture", async () => {
    await refresh(fakeGateway());

    const res = await authedApi("/v1/github/contributions");
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
    await expect(`${JSON.stringify(await res.json(), null, 2)}\n`).toMatchFileSnapshot(
      `${FIXTURES}/github-contributions.json`
    );
  });

  it("puts the latest commit on the project and dates its activity by it", async () => {
    await refresh(fakeGateway());

    const projects = (await (await authedApi("/v1/projects")).json()) as Record<string, unknown>[];
    const project = projects.find((entry) => entry.githubUrl === repoUrl);
    expect(project).toMatchObject({
      latestCommit: {
        hash: "abc123",
        committedAt: "2026-03-01T10:00:00.000Z",
        url: `${repoUrl.replace(/\/+$/, "")}/commit/abc123`,
      },
      lastActivityAt: "2026-03-01T10:00:00.000Z",
    });
  });

  it("rejects a profile URL that is not on GitHub", async () => {
    await expect(
      createRefreshContributions(fakeGateway(), repository())({ profileUrl: "https://example.com/janedoe", now: NOW })
    ).rejects.toThrow(InvalidGitHubProfileUrlError);
  });

  it("fetches and saves contributions on the first request", async () => {
    expect(await queries(fakeGateway()).contributions()).toEqual(fakeContributions());
    expect(await repository().getContributions()).toEqual({ data: fakeContributions(), fetchedAt: NOW });
  });

  it("answers no repo activity when GitHub fails before the first snapshot", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failing = fakeGateway({
      latestCommits: async () => {
        throw new Error("GitHub down");
      },
    });

    expect(await queries(failing).repoActivity()).toEqual({});
  });
});
