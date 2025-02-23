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
}

export const githubService = new GitHubService();
