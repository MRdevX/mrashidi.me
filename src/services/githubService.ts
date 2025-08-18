interface LatestCommitInfo {
  date: Date;
  hash: string;
}

export class GitHubService {
  private readonly apiBase = "/api/github";

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
