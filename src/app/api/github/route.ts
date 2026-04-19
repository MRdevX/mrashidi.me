import { type NextRequest, NextResponse } from "next/server";
import { createMiddleware } from "@/lib/api/middleware";
import { getEnv } from "@/lib/core";
import { APIError } from "@/lib/errors";

interface LatestCommitInfo {
  date: Date;
  hash: string;
}

interface GitHubRepo {
  default_branch: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: { date: string } | null;
    committer: { date: string } | null;
  };
}

const extractRepoInfo = (githubUrl: string): { owner: string; name: string } | null => {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== "github.com") {
      return null;
    }

    const segments = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    const owner = segments[0];
    const name = segments[1];
    return owner && name ? { owner, name } : null;
  } catch {
    return null;
  }
};

const fetchGitHubJson = async <T>(endpoint: string, useToken: boolean): Promise<T> => {
  const token = getEnv("GH_REST_API_TOKEN");
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "mrashidi.me-portfolio",
    ...(useToken && token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`https://api.github.com${endpoint}`, { headers });

  if (!response.ok) {
    throw new APIError(`GitHub API error: ${response.status}`, response.status);
  }

  return response.json();
};

/** Uses PAT when set; on 401/403 retries without auth so a bad/expired token does not break public repo reads. */
const fetchGitHubAPI = async <T>(endpoint: string): Promise<T> => {
  const token = getEnv("GH_REST_API_TOKEN");
  if (!token) {
    return fetchGitHubJson<T>(endpoint, false);
  }

  try {
    return await fetchGitHubJson<T>(endpoint, true);
  } catch (error) {
    if (error instanceof APIError && (error.statusCode === 401 || error.statusCode === 403)) {
      return fetchGitHubJson<T>(endpoint, false);
    }
    throw error;
  }
};

const commitDateFromPayload = (commit: GitHubCommit["commit"]): Date | null => {
  const raw = commit.committer?.date ?? commit.author?.date;
  if (!raw) {
    return null;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getLatestCommitInfo = async (githubUrl: string): Promise<LatestCommitInfo | null> => {
  const repoInfo = extractRepoInfo(githubUrl);
  if (!repoInfo) {
    return null;
  }

  const { owner, name } = repoInfo;

  try {
    const repo = await fetchGitHubAPI<GitHubRepo>(`/repos/${owner}/${name}`);
    const branch = encodeURIComponent(repo.default_branch || "main");
    const commits = await fetchGitHubAPI<GitHubCommit[]>(`/repos/${owner}/${name}/commits?per_page=1&sha=${branch}`);

    if (commits.length > 0) {
      const date = commitDateFromPayload(commits[0].commit);
      if (date) {
        return { date, hash: commits[0].sha };
      }
    }
  } catch {
    // fall through to legacy branch guesses
  }

  for (const branch of ["main", "master"]) {
    try {
      const commits = await fetchGitHubAPI<GitHubCommit[]>(`/repos/${owner}/${name}/commits?per_page=1&sha=${branch}`);

      if (commits.length > 0) {
        const date = commitDateFromPayload(commits[0].commit);
        if (date) {
          return { date, hash: commits[0].sha };
        }
      }
    } catch {
      // try next branch
    }
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

export const GET = createMiddleware("generalApi").build(handleGitHubRequest);
