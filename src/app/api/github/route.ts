import { type NextRequest, NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/api/middleware";
import { APIError } from "@/lib/errors";

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

const extractRepoInfo = (githubUrl: string): { owner: string; name: string } | null => {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== "github.com") {
      return null;
    }

    const [, owner, name] = url.pathname.split("/");
    return owner && name ? { owner, name } : null;
  } catch {
    return null;
  }
};

const fetchGitHubAPI = async <T>(endpoint: string): Promise<T> => {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "mrashidi.me-portfolio",
    ...(token && { Authorization: `token ${token}` }),
  };

  const response = await fetch(`https://api.github.com${endpoint}`, { headers });

  if (!response.ok) {
    throw new APIError(`GitHub API error: ${response.status}`, response.status);
  }

  return response.json();
};

const getLatestCommitInfo = async (githubUrl: string): Promise<LatestCommitInfo | null> => {
  const repoInfo = extractRepoInfo(githubUrl);
  if (!repoInfo) {
    return null;
  }

  const branches = ["main", "master"];

  for (const branch of branches) {
    try {
      const commits = await fetchGitHubAPI<GitHubCommit[]>(
        `/repos/${repoInfo.owner}/${repoInfo.name}/commits?per_page=1&sha=${branch}`
      );

      if (commits.length > 0) {
        return {
          date: new Date(commits[0].commit.author.date),
          hash: commits[0].sha,
        };
      }
    } catch {}
  }

  return null;
};

async function handleGitHubRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const githubUrl = searchParams.get("url");

  if (action !== "commit-info") {
    throw new APIError("Invalid action", 400);
  }

  if (!githubUrl) {
    throw new APIError("GitHub URL is required", 400);
  }

  const result = await getLatestCommitInfo(githubUrl);
  return NextResponse.json(result);
}

export const GET = apiMiddleware.basic("generalApi")(handleGitHubRequest);
