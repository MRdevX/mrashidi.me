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

class GitHubService {
  private readonly username = "mrdevx";
  private readonly baseUrl = "https://api.github.com";
  private readonly graphqlUrl = "https://api.github.com/graphql";
  private readonly headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
  };

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
}

export const githubService = new GitHubService();
