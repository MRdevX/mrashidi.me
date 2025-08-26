import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

interface LatestCommitInfo {
  date: Date;
  hash: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
    };
  };
}

class GitHubService {
  private readonly baseUrl = "https://api.github.com";
  private readonly headers: HeadersInit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    this.headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "mrashidi.me-portfolio",
      ...(token && { Authorization: `token ${token}` }),
    };
  }

  private async fetchGitHubAPI<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getLatestCommitInfo(githubUrl: string): Promise<LatestCommitInfo | null> {
    try {
      const repoInfo = this.extractRepoInfo(githubUrl);
      if (!repoInfo) return null;

      const branches = ["main", "master"];

      for (const branch of branches) {
        try {
          const commits = await this.fetchGitHubAPI<GitHubCommit[]>(
            `/repos/${repoInfo.owner}/${repoInfo.name}/commits?per_page=1&sha=${branch}`
          );

          if (commits.length > 0) {
            return {
              date: new Date(commits[0].commit.author.date),
              hash: commits[0].sha,
            };
          }
        } catch {
          continue;
        }
      }

      return null;
    } catch (error) {
      logger.error({
        operation: "getLatestCommitInfo",
        githubUrl,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  private extractRepoInfo(githubUrl: string): { owner: string; name: string } | null {
    try {
      const url = new URL(githubUrl);
      if (url.hostname !== "github.com") return null;

      const [, owner, name] = url.pathname.split("/");
      return owner && name ? { owner, name } : null;
    } catch {
      return null;
    }
  }
}

const githubService = new GitHubService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action !== "commit-info") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const githubUrl = searchParams.get("url");
    if (!githubUrl) {
      return NextResponse.json({ error: "GitHub URL is required" }, { status: 400 });
    }

    const result = await githubService.getLatestCommitInfo(githubUrl);
    return NextResponse.json(result);
  } catch (error) {
    logger.error({
      operation: "GET",
      endpoint: "/api/github",
      error: error instanceof Error ? error.message : String(error),
    });
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
