import { type NextRequest, NextResponse } from "next/server";
import { createMiddleware } from "@/lib/api/middleware";
import { API_CONFIG, getEnv } from "@/lib/core";
import { APIError } from "@/lib/errors";

const CONTRIBUTIONS_QUERY = `
  query Contributions($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
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

async function handler(_req: NextRequest): Promise<NextResponse> {
  const token = getEnv("GH_REST_API_TOKEN");
  if (!token) {
    throw new APIError("GitHub token not configured", 503);
  }

  const now = new Date();
  const to = `${now.toISOString().slice(0, 10)}T23:59:59Z`;
  const fromDate = new Date(now);
  fromDate.setFullYear(fromDate.getFullYear() - 1);
  fromDate.setDate(fromDate.getDate() + 1);
  const from = `${fromDate.toISOString().slice(0, 10)}T00:00:00Z`;

  const res = await fetch(API_CONFIG.GITHUB.GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "mrashidi.me-portfolio",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { username: API_CONFIG.GITHUB.USERNAME, from, to },
    }),
    next: { revalidate: 86_400 },
  });

  if (!res.ok) {
    throw new APIError(`GitHub API responded with ${res.status}`, 502);
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors?.length) {
    throw new APIError(json.errors[0]?.message ?? "GraphQL error", 502);
  }

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
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

  return NextResponse.json({
    contributions,
    total: calendar.totalContributions,
  });
}

export const GET = createMiddleware("generalApi").cache(86_400, 3_600).build(handler);
