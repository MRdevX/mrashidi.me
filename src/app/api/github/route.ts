import { NextRequest, NextResponse } from "next/server";

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface GitHubActivity {
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
    };
  };
}

interface LatestCommitInfo {
  date: Date;
  hash: string;
}

class GitHubAPIService {
  private readonly username = "mrdevx";
  private baseUrl = "https://api.github.com";
  private readonly graphqlUrl = "https://api.github.com/graphql";
  private headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "mrashidi.me-portfolio",
  };

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      this.headers = {
        ...this.headers,
        Authorization: `token ${token}`,
      };
    }
  }

  async getTopRepositories(): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/repos?sort=stars&per_page=4`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const repos = await response.json();
      return repos;
    } catch (error) {
      console.error("Error fetching GitHub repositories:", error);
      return [];
    }
  }

  async getRecentActivity(): Promise<GitHubActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/events/public?per_page=5`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }

      const activities = await response.json();
      return activities;
    } catch (error) {
      console.error("Error fetching GitHub activity:", error);
      return [];
    }
  }

  async getContributions(): Promise<ContributionDay[]> {
    try {
      const query = `
        query {
          user(login: "${this.username}") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch(this.graphqlUrl, {
        method: "POST",
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch contributions");
      }

      const data = (await response.json()) as GitHubGraphQLResponse;
      const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
      const contributions: ContributionDay[] = [];

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      weeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
          const date = new Date(day.date);
          if (date >= sixMonthsAgo) {
            const count = day.contributionCount;
            let level: 0 | 1 | 2 | 3 | 4;

            if (count === 0) level = 0;
            else if (count <= 3) level = 1;
            else if (count <= 6) level = 2;
            else if (count <= 10) level = 3;
            else level = 4;

            contributions.push({
              date: day.date,
              count,
              level,
            });
          }
        });
      });

      return contributions;
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      return [];
    }
  }

  async getLatestCommitInfo(githubUrl: string): Promise<LatestCommitInfo | null> {
    try {
      const repoInfo = this.extractGitHubRepoInfo(githubUrl);
      if (!repoInfo) {
        console.warn(`Invalid GitHub URL format: ${githubUrl}`);
        return null;
      }

      const repoPath = `${repoInfo.owner}/${repoInfo.name}`;
      const branches = ["main", "master"];

      for (const branch of branches) {
        const response = await fetch(`${this.baseUrl}/repos/${repoPath}/commits?per_page=1&sha=${branch}`, {
          headers: this.headers,
        });

        if (response.ok) {
          const commits = await response.json();

          if (commits.length > 0) {
            return {
              date: new Date(commits[0].commit.author.date),
              hash: commits[0].sha,
            };
          }
        }
      }

      console.warn(`No commits found for ${repoPath}`);
      return null;
    } catch (error) {
      console.error(`Error fetching latest commit info for ${githubUrl}:`, error);
      return null;
    }
  }

  private extractGitHubRepoInfo(githubUrl: string): { owner: string; name: string } | null {
    try {
      const url = new URL(githubUrl);
      if (url.hostname !== "github.com") {
        return null;
      }

      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length < 2) {
        return null;
      }

      return {
        owner: pathParts[0],
        name: pathParts[1],
      };
    } catch {
      return null;
    }
  }
}

const githubService = new GitHubAPIService();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "repositories":
        const repos = await githubService.getTopRepositories();
        return NextResponse.json(repos);

      case "activity":
        const activity = await githubService.getRecentActivity();
        return NextResponse.json(activity);

      case "contributions":
        const contributions = await githubService.getContributions();
        return NextResponse.json(contributions);

      case "commit-info":
        const githubUrl = searchParams.get("url");
        if (!githubUrl) {
          return NextResponse.json({ error: "GitHub URL is required" }, { status: 400 });
        }
        const commitInfo = await githubService.getLatestCommitInfo(githubUrl);
        return NextResponse.json(commitInfo);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
