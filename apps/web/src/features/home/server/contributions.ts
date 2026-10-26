import { GITHUB_USER_AGENT } from "@/features/projects/server";
import { API_CONFIG, getEnv } from "@/lib/core";
import { APIError } from "@/lib/errors";

export const CONTRIBUTIONS_TTL_SECONDS = 86_400;

const CONTRIBUTIONS_QUERY = `
  query Contributions($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

type GhLevel = "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";

const LEVEL_MAP: Record<GhLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        restrictedContributionsCount: number;
        contributionCalendar?: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }[];
          }[];
        };
      };
    };
  };
  errors?: { message: string }[];
};

export interface ContributionsSummary {
  contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
  total: number;
}

const toDay = (date: Date) => date.toISOString().slice(0, 10);

const lastYearFromMonday = (now: Date): { from: string; to: string } => {
  const fromDate = new Date(now);
  fromDate.setFullYear(fromDate.getFullYear() - 1);
  fromDate.setDate(fromDate.getDate() + 1);
  const daysUntilMonday = (1 - fromDate.getDay() + 7) % 7;
  fromDate.setDate(fromDate.getDate() + daysUntilMonday);
  return { from: `${toDay(fromDate)}T00:00:00Z`, to: `${toDay(now)}T23:59:59Z` };
};

export async function fetchContributions(): Promise<ContributionsSummary> {
  const token = getEnv("GH_REST_API_TOKEN");
  if (!token) {
    throw new APIError("GitHub token not configured", 503);
  }

  const { from, to } = lastYearFromMonday(new Date());

  const res = await fetch(API_CONFIG.GITHUB.GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": GITHUB_USER_AGENT,
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { username: API_CONFIG.GITHUB.USERNAME, from, to },
    }),
    next: { revalidate: CONTRIBUTIONS_TTL_SECONDS },
  });

  if (!res.ok) {
    throw new APIError(`GitHub API responded with ${res.status}`, 502);
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors?.length) {
    throw new APIError(json.errors[0]?.message ?? "GraphQL error", 502);
  }

  const collection = json.data?.user?.contributionsCollection;
  const calendar = collection?.contributionCalendar;
  if (!calendar) {
    throw new APIError("No contribution data returned", 404);
  }

  const contributions = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVEL_MAP[day.contributionLevel as GhLevel] ?? 0,
    }))
  );

  return {
    contributions,
    total: calendar.totalContributions + (collection?.restrictedContributionsCount ?? 0),
  };
}
