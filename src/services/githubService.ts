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

interface ContributionDayResponse {
  contributionCount: number;
  date: string;
}

import { extractGitHubRepoInfo } from "@/lib/utils";

interface LatestCommitInfo {
  date: Date;
  hash: string;
}

export class GitHubService {
  private readonly username = "mrdevx";
  private baseUrl = "https://api.github.com";
  private readonly graphqlUrl = "https://api.github.com/graphql";
  private headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "mrashidi.me-portfolio",
  };

  constructor() {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
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
        week.contributionDays.forEach((day: ContributionDayResponse) => {
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
      const repoInfo = extractGitHubRepoInfo(githubUrl);
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

  async getLatestCommitDate(githubUrl: string): Promise<Date | null> {
    const commitInfo = await this.getLatestCommitInfo(githubUrl);
    return commitInfo?.date || null;
  }

  async testGitHubAPI(githubUrl: string): Promise<boolean> {
    try {
      const repoInfo = extractGitHubRepoInfo(githubUrl);
      if (!repoInfo) {
        console.warn(`Invalid GitHub URL format: ${githubUrl}`);
        return false;
      }

      const repoPath = `${repoInfo.owner}/${repoInfo.name}`;

      const response = await fetch(`${this.baseUrl}/repos/${repoPath}`);

      if (!response.ok) {
        console.warn(`Failed to fetch repo info: ${response.status}`);
        return false;
      }

      await response.json();
      return true;
    } catch (error) {
      console.error("Error testing GitHub API:", error);
      return false;
    }
  }
}

export const githubService = new GitHubService();
