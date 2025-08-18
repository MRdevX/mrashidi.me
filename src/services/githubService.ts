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

interface LatestCommitInfo {
  date: Date;
  hash: string;
}

export class GitHubService {
  private readonly apiBase = "/api/github";

  async getTopRepositories(): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(`${this.apiBase}?action=repositories`);

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
      const response = await fetch(`${this.apiBase}?action=activity`);

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
      const response = await fetch(`${this.apiBase}?action=contributions`);

      if (!response.ok) {
        throw new Error("Failed to fetch contributions");
      }

      const contributions = await response.json();
      return contributions;
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      return [];
    }
  }

  async getLatestCommitInfo(githubUrl: string): Promise<LatestCommitInfo | null> {
    try {
      const response = await fetch(`${this.apiBase}?action=commit-info&url=${encodeURIComponent(githubUrl)}`);

      if (!response.ok) {
        throw new Error("Failed to fetch commit info");
      }

      const commitInfo = await response.json();

      if (!commitInfo) {
        return null;
      }

      return {
        date: new Date(commitInfo.date),
        hash: commitInfo.hash,
      };
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
      const commitInfo = await this.getLatestCommitInfo(githubUrl);
      return commitInfo !== null;
    } catch (error) {
      console.error("Error testing GitHub API:", error);
      return false;
    }
  }
}

export const githubService = new GitHubService();
