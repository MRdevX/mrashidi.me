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

class GitHubService {
  private readonly username = "mrdevx";
  private readonly baseUrl = "https://api.github.com";

  async getTopRepositories(): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/repos?sort=stars&per_page=4`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
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
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
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
      // This is a mock implementation since GitHub doesn't provide an API for contributions
      // In a real implementation, you would need to use GitHub GraphQL API with authentication
      const today = new Date();
      const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      const days: ContributionDay[] = [];

      for (let d = new Date(sixMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const count = Math.floor(Math.random() * 10); // Mock contribution count
        let level: 0 | 1 | 2 | 3 | 4;

        if (count === 0) level = 0;
        else if (count <= 2) level = 1;
        else if (count <= 4) level = 2;
        else if (count <= 6) level = 3;
        else level = 4;

        days.push({
          date: d.toISOString().split("T")[0],
          count,
          level,
        });
      }

      return days;
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      return [];
    }
  }
}

export const githubService = new GitHubService();
