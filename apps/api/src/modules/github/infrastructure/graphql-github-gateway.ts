import type { ContributionLevel } from "@mrashidi/types";
import type { GitHubGateway } from "../application/ports.ts";
import type { RepoActivity } from "../domain/repo-activity.ts";

const GRAPHQL_URL = "https://api.github.com/graphql";
const USER_AGENT = "mrashidi-api";

const CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }
`;

const LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

interface GraphQLResponse<T> {
  data?: T | null;
  errors?: { message: string }[];
}

interface ContributionsData {
  user: {
    contributionsCollection: {
      restrictedContributionsCount: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
      };
    };
  } | null;
}

type RepositoriesData = Record<
  string,
  { defaultBranchRef: { target: { oid?: string; committedDate?: string } | null } | null } | null
>;

export function createGraphQLGitHubGateway(token: string, fetcher: typeof fetch = fetch): GitHubGateway {
  async function query<T>(document: string, variables: Record<string, string>): Promise<T> {
    const res = await fetcher(GRAPHQL_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": USER_AGENT },
      body: JSON.stringify({ query: document, variables }),
    });
    if (!res.ok) {
      throw new Error(`GitHub GraphQL answered ${res.status}`);
    }
    const body = (await res.json()) as GraphQLResponse<T>;
    if (!body.data) {
      throw new Error(`GitHub GraphQL failed: ${body.errors?.map((e) => e.message).join("; ") ?? "no data"}`);
    }
    return body.data;
  }

  return {
    async latestCommits(repos) {
      if (repos.length === 0) {
        return {};
      }
      // Repositories that are missing or private come back as null next to an error; the rest still resolve.
      const params = repos.map((_, i) => `$o${i}: String!, $n${i}: String!`).join(", ");
      const fields = repos
        .map(
          (_, i) =>
            `r${i}: repository(owner: $o${i}, name: $n${i}) { defaultBranchRef { target { ... on Commit { oid committedDate } } } }`
        )
        .join("\n");
      const variables = Object.fromEntries(
        repos.flatMap((repo, i) => [
          [`o${i}`, repo.owner],
          [`n${i}`, repo.name],
        ])
      );
      const data = await query<RepositoriesData>(`query LatestCommits(${params}) {\n${fields}\n}`, variables);

      const activity: RepoActivity = {};
      repos.forEach((repo, i) => {
        const target = data[`r${i}`]?.defaultBranchRef?.target;
        if (target?.oid && target.committedDate) {
          activity[repo.url] = { hash: target.oid, committedAt: new Date(target.committedDate).toISOString() };
        }
      });
      return activity;
    },

    async contributions(login, window) {
      const data = await query<ContributionsData>(CONTRIBUTIONS_QUERY, { login, ...window });
      const collection = data.user?.contributionsCollection;
      if (!collection) {
        throw new Error(`GitHub user "${login}" not found`);
      }
      const { contributionCalendar: calendar } = collection;
      return {
        contributions: calendar.weeks.flatMap((week) =>
          week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: LEVELS[day.contributionLevel] ?? 0,
          }))
        ),
        total: calendar.totalContributions + collection.restrictedContributionsCount,
      };
    },
  };
}
